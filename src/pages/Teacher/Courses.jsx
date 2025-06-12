import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Courses.css";
import CreateCourseForm from "../../components/Courses/CreateCourseForm";
import coursesImage from "../../assets/cursos.jpeg";
import { getUserFromStorage } from "../../utils/userUtils";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const user = getUserFromStorage();

  useEffect(() => {
    fetch("https://aprehender-backendapi.fly.dev/courses")
      .then((res) => res.json())
      .then((data) => {
        // Filtrar cursos que correspondan al subjectId del docente
        const cursosFiltrados = data.filter((curso) => curso.subjectId === user.subjectId);
        setCourses(cursosFiltrados);
      })
      .catch((err) => console.error("Error cargando cursos:", err));
  }, [user.subjectId]);

  const handleCourseCreated = (nuevoCurso) => {
    // Si el nuevo curso es del subjectId del docente, lo agregamos
    if (nuevoCurso.subjectId === user.subjectId) {
      setCourses((prev) => [...prev, nuevoCurso]);
    }
  };

  const obtenerClaseTema = (subject) => {
    if (subject.toLowerCase() === "matemáticas") return "tema-matematicas";
    if (subject.toLowerCase() === "lenguaje") return "tema-lenguaje";
    return "";
  };

  // Agrupar cursos por Grado
  const cursosPorGrado = courses.reduce((acc, curso) => {
    if (!acc[curso.grade]) {
      acc[curso.grade] = [];
    }
    acc[curso.grade].push(curso);
    return acc;
  }, {});

  return (
    <div className="courses-container">
      <h1>Listado de Cursos</h1>
      <p>Selecciona un curso para ver su programa.</p>

      <CreateCourseForm onCourseCreated={handleCourseCreated} />

      {Object.keys(cursosPorGrado).length === 0 ? (
        <p>No hay cursos disponibles.</p>
      ) : (
        Object.keys(cursosPorGrado).map((grado) => (
          <div key={grado} className="grado-section">
            <h2>{grado}</h2>
            <div className="cards-grid">
              {cursosPorGrado[grado].map((curso) => (
                <div
                  key={curso.id}
                  className={`course-card-item ${obtenerClaseTema(curso.subject)}`}
                  onClick={() => navigate(`/home/courses/${curso.id}`)}
                >
                  <div className="card-image-container">
                    <img src={coursesImage} alt="Curso" />
                  </div>
                  <div className="card-bottom">
                    <h3>{curso.subject}</h3>
                    <p className="course-id">ID: {curso.id}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/home/courses/${curso.id}`);
                      }}
                      className="ver-programa-btn"
                    >
                      Ver Programa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Courses;
