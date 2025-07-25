// src/routes/Routes.js

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import NotFoundPage from "../pages/Teacher/NotFoundPage";

// Import de layouts
import Layout from "../components/Layout";
import UTPLayout from "../components/UtpLayout/UTPLayout";

// Import de páginas docentes
import Home from "../pages/Teacher/Home";
import Dashboard from "../pages/Teacher/Dashboard";
import StudentsDocente from "../pages/Teacher/Students";
import Attendance from "../pages/Teacher/Attendance";
import Reports from "../pages/Teacher/Reports";
import Settings from "../pages/Teacher/Settings";
import Courses from "../pages/Teacher/Courses";
import PreviewStudent from "../pages/PreviewStudent/PreviewStudent";
import StudyMaterial from "../pages/Teacher/StudyMaterial";

// Import de páginas UTP
import UTPHome from "../pages/UTP/Home";
import UTPTeachers from "../pages/UTP/Teachers";
import UTPStudents from "../pages/UTP/Students";
import UTPCoursesSubjects from "../pages/UTP/CoursesSubjects";

// Import de páginas SuperAdmin
import RegisterUTP from "../pages/SuperAdmin/RegisterUTP";

// Autorización
import PrivateRoute from "../components/RoutesComponent/PrivateRoute";
import PrivateRouteByRole from "../components/RoutesComponent/PrivateRouteByRole";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirección por defecto al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rutas protegidas (cualquier usuario autenticado) */}
      <Route element={<PrivateRoute />}>
        {/* Rutas para docentes */}
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cursos" element={<Courses />} />
          <Route path="preview-student" element={<PreviewStudent />} />
          <Route path="estudiantes" element={<StudentsDocente />} />
          <Route path="asistencias" element={<Attendance />} />
          <Route path="reportes" element={<Reports />} />
          <Route path="configuracion" element={<Settings />} />
          <Route path="materiales" element={<StudyMaterial />} />
        </Route>

        {/* Rutas únicamente para UTP */}
        <Route path="/utp" element={<UTPLayout />}>
          <Route element={<PrivateRouteByRole allowedRoles={["UTP"]} />} >
            <Route path="home" element={<UTPHome />} />
            <Route path="courses-subjects" element={<UTPCoursesSubjects />} />
            <Route path="teachers" element={<UTPTeachers />} />
            <Route path="students" element={<UTPStudents />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/superadmin/register-utp" element={<RegisterUTP />} />
      </Route>

      {/* Ruta de error */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
