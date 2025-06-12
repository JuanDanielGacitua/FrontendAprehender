import React, { useState, useEffect } from "react";
import "../../styles/UTP/Teachers.css";
import logoZorro from "../../assets/logo.png";
import toggleIcon from "../../assets/toggledown.png";
import teacherService from "../../services/teacherService";
import api from "../../services/api";
import Swal from "sweetalert2";
import botonEliminar from "../../assets/botonEliminar.png";
import { getUserFromStorage, getToken } from "../../utils/userUtils";

const UTPTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    subjectId: "",
    password: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userSchoolId, setUserSchoolId] = useState("");

  useEffect(() => {
    teacherService.getAll().then(setTeachers).catch(console.error);

    api.get("/subjects").then((res) => setSubjects(res.data)).catch(console.error);

    // Obtener schoolId desde userUtils
    const user = getUserFromStorage();
    if (user) {
      setUserSchoolId(user.schoolId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos antes del POST
    if (!formData.name || !formData.password || !formData.subjectId || !userSchoolId) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos requeridos.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Creando Docente...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Preparar email único
      const generatedEmail = `${formData.name
        .toLowerCase()
        .replace(/\s/g, "")}${Date.now()}@zorrecursos.cl`;

      // Token para Authorization
      const token = getToken();

      // Construir userBody
      const userBody = {
        username: formData.name,
        email: generatedEmail,
        password: formData.password,
        schoolId: userSchoolId,
        role: "TEACHER",
      };

      console.log("Enviando userBody:", userBody);

      // POST /users con token
      const userResponse = await api.post("/users", userBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userResponse.data.user || userResponse.data;

      if (!userData?.id) throw new Error("Error al crear el User");

      // Construir teacherBody
      const teacherBody = {
        name: formData.name,
        subjectId: formData.subjectId,
        schoolId: userSchoolId,
        profileType: "TEACHER",
      };

      console.log("Enviando teacherBody:", teacherBody);

      // POST /teachers con token
      const teacherResponse = await api.post("/teachers", teacherBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const teacherData = teacherResponse.data.teacher || teacherResponse.data;

      if (!teacherData?.id) throw new Error("Error al crear el Teacher");

      // PUT /users/{id} para actualizar teacherId
      await api.put(`/users/${userData.id}`, {
        teacherId: teacherData.id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar listado de teachers
      const updatedTeachers = await teacherService.getAll();
      setTeachers(updatedTeachers);

      // Mostrar éxito
      Swal.fire({
        icon: "success",
        title: "Docente y usuario creados exitosamente",
        html: `Email generado: <strong>${generatedEmail}</strong>`,
        confirmButtonText: "Aceptar",
      });

      // Reset form
      setFormData({ name: "", subjectId: "", password: "" });
    } catch (error) {
      console.error("Error al crear docente y usuario:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error al crear docente",
        text: error.message || "Revisa los datos e intenta nuevamente.",
      });
    }
  };

  const handleDelete = async (teacherId, teacherName) => {
    Swal.fire({
      title: `¿Eliminar al docente ${teacherName}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await teacherService.remove(teacherId);
          setTeachers((prev) => prev.filter((t) => t.id !== teacherId));

          Swal.fire({
            icon: "success",
            title: "Docente eliminado",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (e) {
          console.error("Error al eliminar docente:", e);
          Swal.fire({
            icon: "error",
            title: "Error al eliminar docente",
          });
        }
      }
    });
  };

  return (
    <div className="teachers-page">
      <div className={`formulario-container ${showForm ? "" : "collapsed"}`}>
        <div className="toggle-button" onClick={() => setShowForm(!showForm)}>
          <img src={toggleIcon} alt="Toggle" />
        </div>
        <div className="formulario-campos">
          <h2>Crear Nuevo Docente</h2>
          {showForm && (
            <form onSubmit={handleSubmit}>
              <label>
                <span>Nombre</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>Asignatura</span>
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectId: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar asignatura</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Contraseña</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </label>

              <button type="submit">Crear Docente</button>
            </form>
          )}
        </div>
        <img src={logoZorro} alt="Logo Zorro" className="logo-zorro-docente" />
      </div>

      {/* Listado */}
      <div className="listado-container">
        <h2>Listado de Docentes</h2>
        <div className="teacher-cards">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card">
                <div className="teacher-card-header">
                  <img src="/avatar.jpeg" alt="Avatar" className="teacher-avatar" />
                  <div className="teacher-card-header-content">
                    <h3>{teacher.name}</h3>
                    <p>Asignatura: {teacher.subjectId}</p>
                    <p>Colegio: {teacher.schoolId}</p>
                    <p>Perfil: {teacher.profileType}</p>
                  </div>
                  <img
                    src={botonEliminar}
                    alt="Eliminar"
                    className="delete-icon"
                    onClick={() => handleDelete(teacher.id, teacher.name)}
                    style={{
                      cursor: "pointer",
                      width: "20px",
                      height: "20px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
                <div className="teacher-card-body">
                  <p>Observaciones: Sin observaciones</p>
                </div>
              </div>
            ))
          ) : (
            <p>No hay docentes registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UTPTeachers;
