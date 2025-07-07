// src/pages/UTP/Students.jsx

import React, { useState, useEffect, useRef } from "react";
import "../../styles/UTP/Students.css";
import logoZorro from "../../assets/logo.png";
import toggleIcon from "../../assets/toggledown.png";
import studentService from "../../services/studentService";
import api from "../../services/api";
import botonEliminar from "../../assets/botonEliminar.png";
import Swal from "sweetalert2";
import { getUserFromStorage, getToken } from "../../utils/userUtils";
import * as XLSX from "xlsx";

const UTPStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    level: 1,
    experience: 1,
    password: "",
    courseId: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [userSchoolId, setUserSchoolId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        Swal.fire({
          title: "Cargando estudiantes...",
          text: "Por favor espera.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        const studentsData = await studentService.getAll();
        console.log('Estudiantes recibidos:', studentsData);
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

    const loadCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      }
    };

    loadStudents();
    loadCourses();

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
        didOpen: () => Swal.showLoading(),
      });

      // 1️⃣ Crear estudiante
      const newStudentResponse = await studentService.create({
        nombre: formData.nombre,
        level: 1,
        experience: 1,
      });
      const newStudent = newStudentResponse.student;
      const studentId = newStudent?.id;
      if (!studentId) throw new Error("No se obtuvo studentId");

      setStudents(prev => [...prev, newStudent]);

      const token = getToken();

      // 2️⃣ Crear usuario
      const userPayload = {
        username: formData.nombre,
        email: `${formData.nombre.toLowerCase().replace(/\s/g, "")}${Date.now()}@zorrecursos.cl`,
        password: formData.password,
        schoolId: userSchoolId,
        role: "STUDENT",
      };

      const userResponse = await api.post("/users", userPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const createdUser = userResponse.data.user || userResponse.data;
      if (!createdUser.id) throw new Error("No se pudo crear el usuario.");

      // 3️⃣ Asociar studentId al usuario
      await api.put(
        `/users/${createdUser.id}`,
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 4️⃣ Asociar estudiante a curso si se eligió uno
      if (formData.courseId) {
        console.log("📦 Enviando a /api/enrollments:", {
          studentId: studentId,
          courseId: formData.courseId,
        });
        await api.post(
          "/enrollments",
          { studentId, courseId: formData.courseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Estudiante y usuario creados exitosamente",
        html: `Email generado: <strong>${userPayload.email}</strong>`,
        confirmButtonText: "Aceptar",
      });

      setFormData({
        nombre: "",
        level: 1,
        experience: 1,
        password: "",
        courseId: "",
      });
    } catch (error) {
      console.error("Error al crear estudiante y usuario:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error en el proceso",
        text: error?.response?.data?.message || error.message || "Revisa los datos e intenta nuevamente.",
      });
    }
  };

  const confirmarEliminacion = async (student) => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${student.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await studentService.remove(student.id);
        setStudents(prev => prev.filter(s => s.id !== student.id));
        Swal.fire("Eliminado", `${student.nombre} ha sido eliminado.`, "success");
      } catch (error) {
        console.error("Error al eliminar estudiante:", error);
        Swal.fire("Error", "No se pudo eliminar el estudiante.", "error");
      }
    }
  };

  const handleDownloadTemplate = () => {
    // Hoja 1: Estudiantes (solo encabezados y ejemplo, sin password)
    const wsEstudiantes = XLSX.utils.json_to_sheet([
      { nombre: "Juan Perez", curso: "Segundo Básico" }
    ]);
    // Insertar tabla de cursos a la derecha (columna E en adelante)
    const cursosData = courses.map(c => [c.name]);
    // Encabezado de cursos
    XLSX.utils.sheet_add_aoa(wsEstudiantes, [["Cursos Disponibles"]], { origin: "E1" });
    // Nombres de cursos debajo del encabezado
    XLSX.utils.sheet_add_aoa(wsEstudiantes, cursosData, { origin: "E2" });

    // Mejorar estilo: encabezados en negrita y color
    const setHeaderStyle = (ws, range, bgColor = 'FFC000') => {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
        if (cell) {
          cell.s = {
            font: { bold: true },
            fill: { fgColor: { rgb: bgColor } },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            },
            alignment: { horizontal: "center" }
          };
        }
      }
    };

    try {
      setHeaderStyle(wsEstudiantes, XLSX.utils.decode_range(wsEstudiantes['!ref']));
      // Encabezado de cursos (columna E)
      const cursosHeaderCell = wsEstudiantes["E1"];
      if (cursosHeaderCell) {
        cursosHeaderCell.s = {
          font: { bold: true },
          fill: { fgColor: { rgb: '92D050' } },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          },
          alignment: { horizontal: "center" }
        };
      }
    } catch (e) { /* Si no soporta estilos, ignorar */ }

    // Ajustar ancho de columnas
    wsEstudiantes['!cols'] = [
      { wch: 20 }, // nombre
      { wch: 25 }, // curso
      { wch: 2 },  // espacio
      { wch: 30 }  // cursos disponibles
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsEstudiantes, "Estudiantes");
    XLSX.writeFile(wb, "plantilla_estudiantes.xlsx");
  };

  // Función para normalizar nombres (sin tildes, espacios extra, minúsculas)
  function normalizarTexto(texto) {
    return String(texto)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quitar tildes
      .replace(/\s+/g, " ") // espacios múltiples a uno
      .trim()
      .toLowerCase();
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : "");
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      // Validar y limpiar datos
      const estudiantes = [];
      const filasInvalidas = [];
      jsonData.forEach((est, idx) => {
        // Solo validar filas que tengan nombre y curso
        if (est.nombre && est.curso) {
          const nombreCursoExcel = normalizarTexto(est.curso);
          const cursoEncontrado = courses.find(c => normalizarTexto(c.name) === nombreCursoExcel);
          if (!cursoEncontrado) {
            filasInvalidas.push(idx + 2); // +2 porque json_to_sheet ignora encabezado y Excel es 1-indexed
          }
          estudiantes.push({
            nombre: est.nombre,
            password: "123456",
            courseId: cursoEncontrado ? cursoEncontrado.id : null,
            level: 1,
            experience: 1
          });
        }
      });
      if (filasInvalidas.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Curso no encontrado",
          html: `Revisa el nombre del curso en las filas:<br>${filasInvalidas.join(", ")}`
        });
        return;
      }
      try {
        Swal.fire({ title: "Cargando estudiantes...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const token = getToken();
        const resp = await studentService.bulkCreate(estudiantes, token);
        Swal.close();
        if (resp.errors && resp.errors.length > 0) {
          Swal.fire({
            icon: "warning",
            title: "Carga masiva parcial",
            html: `<b>Algunos estudiantes no se crearon:</b><br><ul style='text-align:left;'>${resp.errors.map(e => `<li>Fila ${e.row}${e.nombre ? ` (${e.nombre})` : ''}: ${e.error}</li>`).join('')}</ul>`
          });
        } else {
          Swal.fire({ icon: "success", title: "Carga masiva exitosa" });
        }
        // Recargar estudiantes
        const studentsData = await studentService.getAll();
        setStudents(studentsData);
      } catch (error) {
        Swal.close();
        Swal.fire({ icon: "error", title: "Error en la carga masiva", text: error?.response?.data?.message || error.message });
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFileName("");
    };
    reader.readAsArrayBuffer(file);
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
                <span>Nombre</span>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </label>
              <label>
                Contraseña
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </label>
              <label>
                Curso
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={e => setFormData({...formData, courseId: e.target.value})}
                >
                  <option value="">-- Selecciona un curso --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Crear Estudiante</button>
            </form>
          )}
        </div>
        <img src={logoZorro} alt="Logo Zorro" className="logo-zorro" />
      </div>

      <div className="listado-container">
        <h2>Listado de Estudiantes</h2>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <button onClick={handleDownloadTemplate} style={{ padding: 8, borderRadius: 6, background: '#2563eb', color: 'white', border: 'none', fontWeight: 600 }}>Descargar plantilla Excel</button>
          <label htmlFor="file-upload" style={{ padding: 8, borderRadius: 6, background: '#2563eb', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'inline-block' }}>
            Seleccionar archivo
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
          </label>
          {selectedFileName && <span style={{ marginLeft: 8, fontWeight: 500 }}>{selectedFileName}</span>}
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="student-list-section">
          {students.length > 0 ? (
            students
              .filter((student) =>
                ((student.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-card-header">
                    <img src="/avatar.jpeg" alt="Avatar" className="student-avatar" />
                    <div className="student-card-header-content">
                      <h3>{student.nombre}</h3>
                      <p>Nivel: {student.level}</p>
                      <p>Experiencia: {student.experience}</p>
                    </div>
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
