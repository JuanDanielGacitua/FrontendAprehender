import React, { useState, useEffect } from "react";
import { Card, CardContent, CardActions, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
import AttendanceChart from "../../components/AttendanceChart";
import ResumenTabla from "../../components/ResumenTabla";
import cursoActivoImg from "../../assets/cursoActivo.jpeg";
import estudianteFondoImg from "../../assets/EstudianteFondo.jpeg";
import asistenciaFondoImg from "../../assets/AsistenciaFondo.jpeg";
import { getUserFromStorage } from "../../utils/userUtils";
import studentService from "../../services/studentService";

const Home = () => {
  const [resumen, setResumen] = useState([]);
  const [students, setStudents] = useState([]);
  const [lastAttendance, setLastAttendance] = useState({ cantidad: null, fecha: null });
  const user = getUserFromStorage();
  const subjectId = user?.subject?.id;

  useEffect(() => {
    // Llamada a endpoint real para obtener el resumen de cursos
    fetch("/api/courses/resumen")
      .then((res) => res.json())
      .then((data) => setResumen(data.resumenCursos || []))
      .catch((error) => console.error("Error al obtener resumen de cursos:", error));
  }, []);

  useEffect(() => {
    // Usar el mismo servicio que Students.jsx para obtener estudiantes con progreso
    studentService.getStudentsWithProgress()
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error al obtener estudiantes:", error));
  }, []);

  useEffect(() => {
    if (!subjectId) return;
    studentService.getSubjectActivity(subjectId)
      .then((res) => {
        // Buscar la fecha más reciente entre todos los estudiantes
        let fechas = [];
        res.forEach(est => {
          if (Array.isArray(est.dias)) {
            est.dias.forEach(d => fechas.push(d.fecha));
          }
        });
        if (fechas.length === 0) return;
        const ultimaFecha = fechas.sort().reverse()[0];
        // Contar cuántos estudiantes tienen logs en esa fecha
        let cantidad = 0;
        res.forEach(est => {
          const dia = est.dias.find(d => d.fecha === ultimaFecha);
          if (dia && dia.cantidad > 0) cantidad++;
        });
        setLastAttendance({ cantidad, fecha: ultimaFecha });
      })
      .catch((error) => console.error("Error al obtener última asistencia:", error));
  }, [subjectId]);

  // Filtrar estudiantes por subjectId igual que en Students.jsx
  const filteredStudents = students.filter(est =>
    Array.isArray(est.subjectId) && est.subjectId.includes(subjectId)
  );

  const totalCursos = resumen.length;
  const totalEstudiantes = filteredStudents.length;

  const cards = [
    {
      title: "Asignaturas",
      subtitle: `1 asignatura asignada`,
      image: cursoActivoImg,
      link: "cursos",
      buttonText: "Ir a Cursos",
    },
    {
      title: "Estudiantes",
      subtitle: `${totalEstudiantes} alumnos inscritos`,
      image: estudianteFondoImg,
      link: "estudiantes",
      buttonText: "Ir a Estudiantes",
    },
    {
      title: "Asistencias",
      subtitle: lastAttendance.cantidad !== null
        ? `${lastAttendance.cantidad} asistencia${lastAttendance.cantidad === 1 ? '' : 's'}`
        : "Sin registros recientes",
      image: asistenciaFondoImg,
      link: "asistencias",
      buttonText: "Ir a Asistencias",
    },
  ];

  return (
    <div className="home-container">
      <h2>Bienvenido(a), Docente</h2>
      <p>Revisa tus cursos, estudiantes y reportes fácilmente.</p>

      <div className="info-boxes">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="mui-card"
            sx={{
              flex: 1,
              minWidth: 250,
              height: "100%",
              backgroundImage: `url(${card.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ backgroundColor: "rgba(0,0,0,0.5)", flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body2">{card.subtitle}</Typography>
            </CardContent>
            <CardActions sx={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                component={Link}
                to={card.link}
              >
                {card.buttonText}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <AttendanceChart />
      <ResumenTabla />
    </div>
  );
};

export default Home;
