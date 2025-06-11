import React, { useState, useEffect } from "react";
import { Card, CardContent, CardActions, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
import AttendanceChart from "../../components/AttendanceChart";
import ResumenTabla from "../../components/ResumenTabla";
import cursoActivoImg from "../../assets/cursoActivo.jpeg";
import estudianteFondoImg from "../../assets/EstudianteFondo.jpeg";
import asistenciaFondoImg from "../../assets/AsistenciaFondo.jpeg";

const Home = () => {
  const [resumen, setResumen] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("/data/dashboard.json")
      .then((res) => res.json())
      .then((data) => setResumen(data.resumenCursos || []));
  }, []);

  useEffect(() => {
    fetch("/data/students.json")
      .then((res) => res.json())
      .then((data) => setStudents(data || []));
  }, []);

  const totalCursos = resumen.length;
  const totalEstudiantes = students.length;

  const cards = [
    {
      title: "Cursos Activos",
      subtitle: `${totalCursos} cursos asignados`,
      image: cursoActivoImg,
      link: "/cursos",
      buttonText: "Ir a Cursos",
    },
    {
      title: "Estudiantes",
      subtitle: `${totalEstudiantes} alumnos inscritos`,
      image: estudianteFondoImg,
      link: "/estudiantes",
      buttonText: "Ir a Estudiantes",
    },
    {
      title: "Asistencias",
      subtitle: "Última sesión: 10 de mayo",
      image: asistenciaFondoImg,
      link: "/asistencias",
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
