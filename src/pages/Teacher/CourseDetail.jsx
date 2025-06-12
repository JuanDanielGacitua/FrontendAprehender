// src/pages/Teacher/CourseDetail.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UnitForm from "../../components/Courses/UnitForm";
import UnitList from "../../components/Courses/UnitList";
import estudianteImage from "../../assets/EstudianteFondo.jpeg";
import unidadImage from "../../assets/ObjetivoLogo.jpeg"; // Usa una imagen para la pestaña Unidades
import { getUserFromStorage } from "../../utils/userUtils";

const CourseDetail = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [activeTab, setActiveTab] = useState("unidades");
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    fetch(`https://aprehender-backendapi.fly.dev/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCurso(data);
      })
      .catch((err) => console.error("Error cargando curso:", err));
  }, [id]);

  useEffect(() => {
    const user = getUserFromStorage();
    if (!user) return;

    fetch(`https://aprehender-backendapi.fly.dev/students?schoolId=${user.schoolId}`)
      .then((res) => res.json())
      .then((data) => {
        setEstudiantes(data);
      })
      .catch((err) => console.error("Error cargando estudiantes:", err));
  }, [id]);

  if (!curso) return <p>Cargando curso...</p>;

  return (
    <div
      className={`courses-container ${
        curso.subject === "Lenguaje" ? "tema-lenguaje" : "tema-matematicas"
      }`}
    >
      <h1>Programa del Curso</h1>
      <p>
        <strong>Asignatura:</strong> {curso.subject} &nbsp;
        <strong>Grado:</strong> {curso.grade}
      </p>

      <div className="cards-grid">
        <div
          className={`course-card-item ${activeTab === "unidades" ? "active" : ""}`}
          onClick={() => setActiveTab("unidades")}
        >
          <img src={unidadImage} alt="Unidades" />
          <h3>Unidades</h3>
        </div>

        <div
          className={`course-card-item ${activeTab === "estudiantes" ? "active" : ""}`}
          onClick={() => setActiveTab("estudiantes")}
        >
          <img src={estudianteImage} alt="Estudiantes" />
          <h3>Estudiantes</h3>
        </div>
      </div>

      {activeTab === "unidades" && (
        <div className="materiales-card">
          <UnitForm courseId={curso.id} />
          <UnitList courseId={curso.id} />
        </div>
      )}

      {activeTab === "estudiantes" && (
        <div className="materiales-card">
          <h3>Estudiantes Asignados</h3>
          <ul>
            {estudiantes.length === 0 ? (
              <p>No hay estudiantes asignados a este curso.</p>
            ) : (
              estudiantes.map((s) => <li key={s.id}>{s.nombre}</li>)
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
