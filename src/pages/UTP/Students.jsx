// src/pages/UTP/Students.jsx

import React, { useState, useEffect } from "react";
import "../../styles/UTP/Students.css";
import logoZorro from "../../assets/logo.png";
import toggleIcon from "../../assets/toggledown.png";
import studentService from "../../services/studentService";
import api from "../../services/api";
import botonEliminar from "../../assets/botonEliminar.png";
import Swal from "sweetalert2";
import { getUserFromStorage, getToken } from "../../utils/userUtils";

const UTPStudents = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    level: 1,
    experience: 1,
    password: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [userSchoolId, setUserSchoolId] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        Swal.fire({
          title: "Cargando estudiantes...",
          text: "Por favor espera.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const studentsData = await studentService.getAll();
        setStudents(studentsData);

        Swal.close();
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Error al cargar estudiantes",
          text: "Intenta nuevamente.",
        });
      }
    };

    loadStudents();

    const user = getUserFromStorage();
    if (user) {
      setUserSchoolId(user.schoolId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.password || !userSchoolId) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos requeridos.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Creando Estudiante...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // 1️⃣ Crear el estudiante en tabla Student
      const newStudent = await studentService.create({
        nombre: formData.nombre,
        level: formData.level,
        experience: formData.experience,
      });

      setStudents((prev) => [...prev, newStudent]);

      const token = getToken();

      // 2️⃣ Crear el User (sin confiar en que studentId quede bien)
      const userPayload = {
        username: formData.nombre,
        email: `${formData.nombre.toLowerCase().replace(/\s/g, "")}${Date.now()}@zorrecursos.cl`,
        password: formData.password,
        schoolId: userSchoolId,
        role: "STUDENT",
      };

      console.log("Enviando userPayload:", userPayload);

      const userResponse = await api.post("/users", userPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const createdUser = userResponse.data.user || userResponse.data;

      if (!createdUser?.id) {
        throw new Error("Error al crear el User");
      }

      // 3️⃣ Ahora actualizar el campo studentId con PUT
      await api.put(`/users/${createdUser.id}`, {
        studentId: newStudent.id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 4️⃣ Mostrar éxito
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Estudiante y usuario creados exitosamente",
        html: `Email generado: <strong>${userPayload.email}</strong>`,
        confirmButtonText: "Aceptar",
      });

      // Reset form
      setFormData({ nombre: "", level: 1, experience: 1, password: "" });

    } catch (error) {
      console.error("Error al crear estudiante y usuario:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error al crear estudiante",
        text: error.message || "Revisa los datos e intenta nuevamente.",
      });
    }
  };

  const confirmarEliminacion = async (student) => {
    const resultado = await Swal.fire({
      title: `¿Eliminar a ${student.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        await studentService.remove(student.id);
        setStudents((prev) => prev.filter((s) => s.id !== student.id));
        Swal.fire("Eliminado", `${student.nombre} ha sido eliminado.`, "success");
      } catch (error) {
        console.error("Error al eliminar estudiante:", error);
        Swal.fire("Error", "No se pudo eliminar el estudiante.", "error");
      }
    }
  };

  return (
    <div className="students-page">
      <div className={`formulario-container ${showForm ? "" : "collapsed"}`}>
        <div className="toggle-button" onClick={() => setShowForm(!showForm)}>
          <img src={toggleIcon} alt="Toggle" />
        </div>
        <div className="formulario-campos">
          <h2>Crear Nuevo Estudiante</h2>
          {showForm && (
            <form onSubmit={handleSubmit}>
              <label>
                Nombre
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </label>
              <label>
                Nivel
                <input
                  type="number"
                  name="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value, 10) })}
                  min="1"
                />
              </label>
              <label>
                Experiencia
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value, 10) })}
                  min="0"
                />
              </label>
              <label>
                Contraseña
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </label>

              <button type="submit">Crear Estudiante</button>
            </form>
          )}
        </div>
        <img src={logoZorro} alt="Logo Zorro" className="logo-zorro" />
      </div>

      <div className="listado-container">
        <h2>Listado de Estudiantes</h2>
        <div className="student-list-section">
          {students.length > 0 ? (
            students
              .filter((st) => st.id)
              .map((st) => (
                <div key={st.id} className="student-card">
                  <div className="student-card-header">
                    <img src="/avatar.jpeg" alt="Avatar" className="student-avatar" />
                    <div className="student-card-header-content">
                      <h3>{st.nombre}</h3>
                      <p>Nivel: {st.level}</p>
                      <p>Experiencia: {st.experience}</p>
                    </div>
                    <img
                      src={botonEliminar}
                      alt="Eliminar"
                      className="delete-icon"
                      onClick={() => confirmarEliminacion(st)}
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                  <div className="student-card-body">
                    <p>Tareas: Sin tareas asignadas</p>
                    <p>Evaluaciones: Sin evaluaciones</p>
                  </div>
                </div>
              ))
          ) : (
            <p>No hay estudiantes registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UTPStudents;
