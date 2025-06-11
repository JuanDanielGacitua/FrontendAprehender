export function getUserFromStorage() {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
  
      const user = JSON.parse(raw);
  
      if (!user.id || !user.role || !user.schoolId) {
        console.warn("Usuario incompleto en localStorage:", user);
        return null;
      }
  
      return user;
    } catch (err) {
      console.error("Error al obtener el usuario del localStorage:", err);
      return null;
    }
  }
  
  export function getToken() {
    try {
      return localStorage.getItem("token") || "";
    } catch (err) {
      console.error("Error al obtener el token del localStorage:", err);
      return "";
    }
  }