import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MaterialForm from "../../components/Courses/MaterialForm";
import MaterialList from "../../components/Courses/MaterialList";
import ActivityForm from "../../components/Courses/ActivityForm";
import ActivityList from "../../components/Courses/ActivityList";
import "../../styles/Courses.css";
import materialImage from "../../assets/material_estudio.jpeg";
import evaluacionImage from "../../assets/evaluaciones.jpeg";
import estudianteImage from "../../assets/EstudianteFondo.jpeg";
import { getUserFromStorage } from "../../utils/userUtils";

const CourseDetail = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [activeTab, setActiveTab] = useState("material");
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
        // Por ahora no tienes campo courseId en student → los mostramos todos del colegio
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
          className={`course-card-item ${activeTab === "material" ? "active" : ""}`}
          onClick={() => setActiveTab("material")}
        >
          <img src={materialImage} alt="Material de Estudio" />
          <h3>Material de Estudio</h3>
        </div>

        <div
          className={`course-card-item ${activeTab === "actividad" ? "active" : ""}`}
          onClick={() => setActiveTab("actividad")}
        >
          <img src={evaluacionImage} alt="Evaluaciones" />
          <h3>Evaluaciones</h3>
        </div>

        <div
          className={`course-card-item ${activeTab === "estudiantes" ? "active" : ""}`}
          onClick={() => setActiveTab("estudiantes")}
        >
          <img src={estudianteImage} alt="Estudiantes" />
          <h3>Estudiantes</h3>
        </div>
      </div>

      {activeTab === "material" && (
        <div className="materiales-card">
          <MaterialForm courseId={curso.id} />
          <MaterialList courseId={curso.id} />
        </div>
      )}

      {activeTab === "actividad" && (
        <div className="materiales-card">
          <ActivityList courseId={curso.id} />
          <ActivityForm courseId={curso.id} />
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
