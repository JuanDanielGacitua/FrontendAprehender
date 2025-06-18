import React, { useState, useEffect } from "react";
import materialService from "../../services/materialService";
import { getUserFromStorage } from "../../utils/userUtils";

const typeIcons = {
  VIDEO: "🎬",
  PDF: "📄",
  LINK: "🔗",
  OTRO: "📁"
};

const StudyMaterial = () => {
  const user = getUserFromStorage();
  const subjectId = user?.subject?.id;
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "VIDEO",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // Obtener materiales al cargar
  useEffect(() => {
    if (!subjectId) return;
    console.log('SubjectId usado para GET materiales:', subjectId);
    setLoadingMaterials(true);
    // Prueba directa con fetch
    const token = localStorage.getItem("token");
    const url = `https://aprehender-backendapi.fly.dev/api/subjects/${subjectId}/study-materials`;
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(r => r.json())
      .then(data => {
        console.log('Respuesta directa con fetch:', data);
      })
      .catch(e => console.error('Error fetch directo:', e));
    // Petición normal con Axios
    materialService
      .getMaterialsBySubject(subjectId)
      .then((res) => {
        // Mostrar el JSON completo recibido
        console.log('Respuesta completa GET materiales:', res);
        // Acepta tanto res.data como array directo
        let arr = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
        setMaterials(arr);
      })
      .catch(() => setMaterials([]))
      .finally(() => setLoadingMaterials(false));
  }, [subjectId, success]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await materialService.createMaterial(subjectId, form);
      setSuccess("Material creado con éxito.");
      setForm({ title: "", description: "", type: "VIDEO", url: "" });
    } catch (err) {
      setError("Error al crear material. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '40px 0' }}>
      <div style={{
        maxWidth: 900,
        width: '100%',
        background: '#fff',
        borderRadius: 22,
        boxShadow: '0 8px 32px rgba(37,99,235,0.10)',
        padding: '38px 38px 32px 38px',
        marginBottom: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ color: '#2563eb', fontWeight: 900, marginBottom: 8, fontSize: 30, letterSpacing: 0.5, textAlign: 'center' }}>Subir Material de Apoyo</h2>
        <p style={{ color: '#555', fontSize: 17, marginBottom: 28, textAlign: 'center', maxWidth: 600 }}>Completa el formulario para compartir recursos útiles con tus estudiantes. Puedes subir videos, PDFs, enlaces u otros tipos de material.</p>
        <form onSubmit={handleSubmit} style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: 32,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {/* Columna izquierda */}
          <div style={{ flex: 1, minWidth: 260, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label style={{ fontWeight: 700, color: '#263545', fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>🏷️</span> Título
              <input name="title" value={form.title} onChange={handleChange} required style={{ padding: '14px', borderRadius: 12, border: '1.5px solid #cbd5e1', marginTop: 4, fontSize: 17, background: '#f8fafc', width: '100%' }} />
            </label>
            <label style={{ fontWeight: 700, color: '#263545', fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{typeIcons[form.type]}</span> Tipo
              <select name="type" value={form.type} onChange={handleChange} required style={{ padding: '14px', borderRadius: 12, border: '1.5px solid #cbd5e1', marginTop: 4, fontSize: 17, background: '#f8fafc', width: '100%' }}>
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="LINK">Enlace</option>
                <option value="OTRO">Otro</option>
              </select>
            </label>
          </div>
          {/* Columna derecha */}
          <div style={{ flex: 1, minWidth: 260, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label style={{ fontWeight: 700, color: '#263545', fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>📝</span> Descripción
              <textarea name="description" value={form.description} onChange={handleChange} required style={{ padding: '14px', borderRadius: 12, border: '1.5px solid #cbd5e1', marginTop: 4, fontSize: 17, minHeight: 70, background: '#f8fafc', width: '100%' }} />
            </label>
            <label style={{ fontWeight: 700, color: '#263545', fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>🌐</span> URL
              <input name="url" value={form.url} onChange={handleChange} required placeholder="Ej: https://..." style={{ padding: '14px', borderRadius: 12, border: '1.5px solid #cbd5e1', marginTop: 4, fontSize: 17, background: '#f8fafc', width: '100%' }} />
              <span style={{ fontSize: 13, color: '#888', marginLeft: 4 }}>Ejemplo: https://www.youtube.com/...</span>
            </label>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <button type="submit" disabled={loading} style={{
              background: 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)',
              color: '#fff', border: 'none', borderRadius: 14, padding: '18px 0', fontWeight: 900, fontSize: 22, cursor: 'pointer', minWidth: 260, boxShadow: '0 2px 8px rgba(37,99,235,0.08)', transition: 'background 0.2s, transform 0.1s', letterSpacing: 0.2
            }}>
              {loading ? "Subiendo..." : "Subir Material"}
            </button>
          </div>
          {success && <div style={{ color: 'green', marginTop: 8, fontWeight: 800, fontSize: 17, width: '100%', textAlign: 'center' }}>{success}</div>}
          {error && <div style={{ color: 'red', marginTop: 8, fontWeight: 800, fontSize: 17, width: '100%', textAlign: 'center' }}>{error}</div>}
        </form>
      </div>

      <div style={{ maxWidth: 1000, width: '100%', background: '#fff', borderRadius: 22, boxShadow: '0 8px 32px rgba(37,99,235,0.10)', padding: '32px 32px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ color: '#2563eb', fontWeight: 900, marginBottom: 18, fontSize: 24, textAlign: 'center' }}>Materiales Subidos</h3>
        {loadingMaterials ? (
          <div style={{ color: '#2563eb', fontWeight: 800, fontSize: 18 }}>Cargando materiales...</div>
        ) : materials.length === 0 ? (
          <div style={{ color: '#888', fontWeight: 700, fontSize: 17 }}>No hay materiales registrados para esta asignatura.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32, width: '100%' }}>
            {materials.map((mat) => (
              <div key={mat.id} style={{
                background: '#f8fafc',
                borderRadius: 18,
                boxShadow: '0 2px 10px rgba(37,99,235,0.07)',
                padding: 26,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                borderLeft: mat.type === 'VIDEO' ? '7px solid #2563eb' : mat.type === 'PDF' ? '7px solid #f59e42' : '7px solid #22c55e',
                minHeight: 150,
                justifyContent: 'space-between',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 18, right: 22, fontSize: 32, opacity: 0.18 }}>{typeIcons[mat.type] || typeIcons.OTRO}</div>
                <div style={{ fontWeight: 900, fontSize: 21, color: '#263545', marginBottom: 2 }}>{mat.title}</div>
                <div style={{ color: '#555', fontSize: 17, marginBottom: 2 }}>{mat.description}</div>
                <div style={{ fontSize: 16, color: '#2563eb', fontWeight: 800 }}>Tipo: {mat.type}</div>
                <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>Fecha: {mat.createdAt ? new Date(mat.createdAt).toLocaleString() : '-'}</div>
                <a href={mat.url} target="_blank" rel="noopener noreferrer" style={{
                  marginTop: 6,
                  background: 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '12px 0',
                  textAlign: 'center',
                  fontWeight: 900,
                  textDecoration: 'none',
                  fontSize: 18,
                  boxShadow: '0 1px 4px rgba(37,99,235,0.08)',
                  transition: 'background 0.2s',
                  display: 'block',
                  letterSpacing: 0.2
                }}>
                  Ver recurso
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterial; 