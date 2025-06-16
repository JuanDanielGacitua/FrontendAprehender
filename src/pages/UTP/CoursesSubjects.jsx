// src/pages/UTP/CoursesSubjects.jsx

import React, { useState, useEffect } from "react";
import "../../styles/UTP/CoursesSubjects.css";
import logoZorro from "../../assets/logo.png";
import toggleIcon from "../../assets/toggledown.png";
import api from "../../services/api";
import Swal from "sweetalert2";
import botonEliminar from "../../assets/botonEliminar.png";
import { getUserFromStorage, getToken } from "../../utils/userUtils";

const CoursesSubjects = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formCourse, setFormCourse] = useState({ name: "" });
  const [formSubject, setFormSubject] = useState({ name: "" });
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [userSchoolId, setUserSchoolId] = useState("");
  const [userTeacherId, setUserTeacherId] = useState("");

  useEffect(() => {
    fetchCourses();
    fetchSubjects();

    const user = getUserFromStorage();
    if (user) {
      setUserSchoolId(user.schoolId);
      setUserTeacherId(user.teacher?.id);
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Error cargando cursos:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Error cargando asignaturas:", error);
    }
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();

    if (!formCourse.name || !userSchoolId || !userTeacherId) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos requeridos.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Creando Curso...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const token = getToken();

      const courseBody = {
        name: formCourse.name,
        schoolId: userSchoolId,
        teacherId: userTeacherId,
      };

      await api.post("/courses", courseBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchCourses();

      Swal.fire({
        icon: "success",
        title: "Curso creado exitosamente",
      });

      setFormCourse({ name: "" });
    } catch (error) {
      console.error("Error al crear curso:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error al crear curso",
        text: error.message || "Revisa los datos e intenta nuevamente.",
      });
    }
  };

  const handleSubmitSubject = async (e) => {
    e.preventDefault();

    if (!formSubject.name) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: "Por favor ingresa el nombre de la asignatura.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Creando Asignatura...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const token = getToken();

      const subjectBody = {
        name: formSubject.name,
        courseId: formSubject.courseId,
      };

      await api.post("/subjects", subjectBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchSubjects();

      Swal.fire({
        icon: "success",
        title: "Asignatura creada exitosamente",
      });

      setFormSubject({ name: "", courseId: "" });
    } catch (error) {
      console.error("Error al crear asignatura:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error al crear asignatura",
        text: error.message || "Revisa los datos e intenta nuevamente.",
      });
    }
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    Swal.fire({
      title: `¿Eliminar el curso "${courseName}"?`,
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
          await api.delete(`/courses/${courseId}`);
          setCourses((prev) => prev.filter((c) => c.id !== courseId));

          Swal.fire({
            icon: "success",
            title: "Curso eliminado",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (e) {
          console.error("Error al eliminar curso:", e);
          Swal.fire({
            icon: "error",
            title: "Error al eliminar curso",
          });
        }
      }
    });
  };

  const handleDeleteSubject = async (subjectId, subjectName) => {
    Swal.fire({
      title: `¿Eliminar la asignatura "${subjectName}"?`,
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
          await api.delete(`/subjects/${subjectId}`);
          setSubjects((prev) => prev.filter((s) => s.id !== subjectId));

          Swal.fire({
            icon: "success",
            title: "Asignatura eliminada",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (e) {
          console.error("Error al eliminar asignatura:", e);
          Swal.fire({
            icon: "error",
            title: "Error al eliminar asignatura",
          });
        }
      }
    });
  };

  return (
    <div className="courses-subjects-page">
      <div className="formularios-contenedor">
        {/* Formulario Curso */}
        <div className={`formulario-container ${showCourseForm ? "" : "collapsed"}`}>
          <div className="toggle-button" onClick={() => setShowCourseForm(!showCourseForm)}>
            <img src={toggleIcon} alt="Toggle" />
          </div>
          <div className="formulario-campos">
            <h2>Crear Nuevo Curso</h2>
            {showCourseForm && (
              <form onSubmit={handleSubmitCourse}>
                <label>
                  <span>Nombre del Curso</span>
                  <input
                    type="text"
                    name="name"
                    value={formCourse.name}
                    onChange={(e) =>
                      setFormCourse({ ...formCourse, name: e.target.value })
                    }
                    required
                  />
                </label>
                <button type="submit">Crear Curso</button>
              </form>
            )}
          </div>
          <img src={logoZorro} alt="Logo Zorro" className="logo-zorro-docente" />
        </div>

        {/* Formulario Subject */}
        <div className={`formulario-container ${showSubjectForm ? "" : "collapsed"}`}>
          <div className="toggle-button" onClick={() => setShowSubjectForm(!showSubjectForm)}>
            <img src={toggleIcon} alt="Toggle" />
          </div>
          <div className="formulario-campos">
            <h2>Crear Nueva Asignatura</h2>
            {showSubjectForm && (
              <form onSubmit={handleSubmitSubject}>
                <label>
                  <span>Nombre de la Asignatura</span>
                  <input
                    type="text"
                    name="name"
                    value={formSubject.name}
                    onChange={(e) =>
                      setFormSubject({ ...formSubject, name: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  <span>Curso</span>
                  <select
                    value={formSubject.courseId || ""}
                    onChange={(e) =>
                      setFormSubject({ ...formSubject, courseId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccione un curso</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </label>

                <button type="submit">Crear Asignatura</button>
              </form>
            )}
          </div>
          <img src={logoZorro} alt="Logo Zorro" className="logo-zorro-asignatura" />
        </div>
      </div>

      {/* Listado de Courses */}
      <div className="listado-container">
        <h2>Listado de Cursos</h2>
        <div className="teacher-cards">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="teacher-card">
                <div className="teacher-card-header">
                  <h3>{course.name}</h3>
                  <img
                    src={botonEliminar}
                    alt="Eliminar"
                    className="delete-icon"
                    onClick={() => handleDeleteCourse(course.id, course.name)}
                  />
                </div>
                <div className="teacher-card-body">
                  <p>Colegio: {course.schoolName}</p>
                  <p>Profesor: {course.teacherName}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No hay cursos registrados.</p>
          )}
        </div>
      </div>

      {/* Listado de Subjects */}
      <div className="listado-container">
        <h2>Listado de Asignaturas</h2>
        <div className="teacher-cards">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <div key={subject.id} className="teacher-card">
                <div className="teacher-card-header">
                  <h3>{subject.name}</h3>
                  <img
                    src={botonEliminar}
                    alt="Eliminar"
                    className="delete-icon"
                    onClick={() => handleDeleteSubject(subject.id, subject.name)}
                  />
                </div>
                <div className="teacher-card-body">
                  {/* No mostrar el ID */}
                </div>
              </div>
            ))
          ) : (
            <p>No hay asignaturas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesSubjects;
