import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userSession = localStorage.getItem("userSession");

  if (!userSession || !isValidJWT(userSession)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Função para verificar a validade do JWT
const isValidJWT = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime; // Verifica se o token expirou
  } catch (error) {
    return false;
  }
};

export default PrivateRoute;
