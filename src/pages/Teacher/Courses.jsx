import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Courses.css";
import CreateCourseForm from "../../components/Courses/CreateCourseForm";
import coursesImage from "../../assets/cursos.jpeg";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://aprehender-backendapi.fly.dev/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error cargando cursos:", err));
  }, []);

  const handleCourseCreated = (nuevoCurso) => {
    setCourses((prev) => [...prev, nuevoCurso]);
  };

  const obtenerClaseTema = (subject) => {
    if (subject.toLowerCase() === "matemáticas") return "tema-matematicas";
    if (subject.toLowerCase() === "lenguaje") return "tema-lenguaje";
    return "";
  };

  return (
    <div className="courses-container">
      <h1>Listado de Cursos</h1>
      <p>Selecciona un curso para ver su programa.</p>

      <CreateCourseForm onCourseCreated={handleCourseCreated} />

      <div className="cards-grid">
        {courses.map((curso) => (
          <div
            key={curso.id}
            className={`course-card-item ${obtenerClaseTema(curso.subject)}`}
            onClick={() => navigate(`/home/courses/${curso.id}`)} 
          >
            <div className="card-image-container">
              <img src={coursesImage} alt="Curso" />
            </div>
            <div className="card-bottom">
              <h3>{curso.subject} - {curso.grade}</h3>
              <p className="course-id">ID: {curso.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
