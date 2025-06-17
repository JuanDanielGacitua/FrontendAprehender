// ... imports
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import "../../styles/SuperAdmin/registerUTP.css";
import logo from "../../assets/logo.png";
import { getToken } from "../../utils/userUtils";
import toggleIcon from "../../assets/toggledown.png";

const RegisterUTP = () => {
  const [utpData, setUtpData] = useState({
    schoolName: "",
    name: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [schools, setSchools] = useState([]);
  const [utpUsers, setUtpUsers] = useState([]);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [utpSearch, setUtpSearch] = useState("");

  const [showForm, setShowForm] = useState(true);
  const [showSchools, setShowSchools] = useState(true);
  const [showUsers, setShowUsers] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const fetchWithAuth = (url, options = {}) => {
    const token = getToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUtpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateEmailFromName = (name) => {
    const cleanName = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `${cleanName}${randomNumber}@zorrecursos.cl`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    Swal.fire({
      title: "Registrando UTP y Colegio...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const schoolResponse = await fetchWithAuth("https://aprehender-backendapi.fly.dev/api/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: utpData.schoolName }),
      });

      const schoolData = await schoolResponse.json();
      const schoolId = schoolData?.school?.id;
      if (!schoolId) throw new Error("Error al crear el Colegio");

      const generatedEmail = generateEmailFromName(utpData.name);
      const userBody = {
        username: utpData.username,
        email: generatedEmail,
        password: utpData.password,
        schoolId,
        role: "UTP",
      };

      const userResponse = await fetchWithAuth("https://aprehender-backendapi.fly.dev/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userBody),
      });

      const userData = await userResponse.json();
      const user = userData.user;
      if (!user?.id) throw new Error("Error al crear el User");

      const teacherBody = {
        name: utpData.name,
        subjectId: "1",
        schoolId,
        profileType: "UTP",
      };

      const teacherResponse = await fetchWithAuth("https://aprehender-backendapi.fly.dev/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherBody),
      });

      const teacherData = await teacherResponse.json();
      const teacher = teacherData?.teacher || teacherData;
      if (!teacher?.id) throw new Error("Error al crear el Teacher");

      await fetchWithAuth(`https://aprehender-backendapi.fly.dev/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: teacher.id }),
      });

      Swal.fire({
        icon: "success",
        title: "¡UTP y Colegio creados exitosamente!",
        html: `Email generado: <strong>${generatedEmail}</strong>`,
        confirmButtonText: "Aceptar",
      });

      setUtpData({ schoolName: "", name: "", username: "", password: "" });
      fetchSchools();
      fetchUTPUsers();
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      setError(err.message);
      Swal.close();
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  const fetchSchools = useCallback(async () => {
    try {
      const response = await fetchWithAuth("https://aprehender-backendapi.fly.dev/api/schools");
      const data = await response.json();
      setSchools(data);
    } catch (err) {
      console.error("Error al obtener schools:", err);
    }
  }, []);

  const fetchUTPUsers = useCallback(async () => {
    try {
      const response = await fetchWithAuth("https://aprehender-backendapi.fly.dev/api/users");
      const data = await response.json();
      const utpOnly = data.filter((user) => user.role === "UTP");
      setUtpUsers(utpOnly);
    } catch (err) {
      console.error("Error al obtener users:", err);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
    fetchUTPUsers();
  }, [fetchSchools, fetchUTPUsers]);

  return (
    <div className="register-utp-page">
      <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
  
      <div className="form-container">
        <div className="register-utp">
          <div className="toggle-header">
            <h2>Registrar UTP y Colegio</h2>
            <img
              src={toggleIcon}
              alt="toggle"
              className={`toggle-icon ${showForm ? "rotated" : ""}`}
              onClick={() => setShowForm(!showForm)}
            />
          </div>
  
          {showForm && (
            <form onSubmit={handleSubmit}>
              <label>Nombre del Colegio:
                <input type="text" name="schoolName" value={utpData.schoolName} onChange={handleChange} required />
              </label>
              <label>Nombre del UTP:
                <input type="text" name="name" value={utpData.name} onChange={handleChange} required />
              </label>
              <label>Nickname (usuario):
                <input type="text" name="username" value={utpData.username} onChange={handleChange} required />
              </label>
              <label>Contraseña:
                <input type="password" name="password" value={utpData.password} onChange={handleChange} required />
              </label>
              <button type="submit">Registrar UTP y Colegio</button>
              {error && <p className="error">{error}</p>}
            </form>
          )}
        </div>
      </div>
  
      <div className="logo-container">
        <img src={logo} alt="Zorrecursos Logo" className="middle-logo" />
      </div>
  
      <div className="list-container">
        <div className="lists-section">
          <div className="sidebar-section">
            <div className="toggle-header">
              <h3>Colegios registrados</h3>
              <img
                src={toggleIcon}
                alt="toggle"
                className={`toggle-icon ${showSchools ? "rotated" : ""}`}
                onClick={() => setShowSchools(!showSchools)}
              />
            </div>
            {showSchools && (
              <>
                <input
                  type="text"
                  placeholder="Buscar colegio..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="search-input"
                />
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre del Colegio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools
                      .filter((school) =>
                        school.name.toLowerCase().includes(schoolSearch.toLowerCase())
                      )
                      .map((school, index) => (
                        <tr key={school.id}>
                          <td>{index + 1}</td>
                          <td>{school.name}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
  
          <div className="sidebar-section">
            <div className="toggle-header">
              <h3>Usuarios UTP registrados</h3>
              <img
                src={toggleIcon}
                alt="toggle"
                className={`toggle-icon ${showUsers ? "rotated" : ""}`}
                onClick={() => setShowUsers(!showUsers)}
              />
            </div>
            {showUsers && (
              <>
                <input
                  type="text"
                  placeholder="Buscar UTP..."
                  value={utpSearch}
                  onChange={(e) => setUtpSearch(e.target.value)}
                  className="search-input"
                />
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Usuario</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utpUsers
                      .filter((user) =>
                        user.username.toLowerCase().includes(utpSearch.toLowerCase())
                      )
                      .map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );  
};

export default RegisterUTP;
