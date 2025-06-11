import React, { useState } from 'react';

const CoursesSubjects = () => {
  const [courseName, setCourseName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (courseName.trim() === '') return;

    setCourses([...courses, courseName]);
    setCourseName('');
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (subjectName.trim() === '') return;

    setSubjects([...subjects, subjectName]);
    setSubjectName('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Cursos y Asignaturas</h1>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        {/* Formulario de Course */}
        <div style={{ flex: 1 }}>
          <h2>Crear Curso</h2>
          <form onSubmit={handleAddCourse}>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Nombre del Curso"
              style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
            />
            <button type="submit" style={{ padding: '8px 16px' }}>
              Agregar Curso
            </button>
          </form>

          {/* Lista de Courses */}
          <ul style={{ marginTop: '20px' }}>
            {courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        </div>

        {/* Formulario de Subject */}
        <div style={{ flex: 1 }}>
          <h2>Crear Asignatura</h2>
          <form onSubmit={handleAddSubject}>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Nombre de la Asignatura"
              style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
            />
            <button type="submit" style={{ padding: '8px 16px' }}>
              Agregar Asignatura
            </button>
          </form>

          {/* Lista de Subjects */}
          <ul style={{ marginTop: '20px' }}>
            {subjects.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoursesSubjects;
