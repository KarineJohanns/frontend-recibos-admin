// src/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userSession = localStorage.getItem("userSession");

  if (!userSession) {
    // Se não houver sessão do usuário, redireciona para o login
    return <Navigate to="/login" />;
  }

  return <>{children}</>; // Se estiver autenticado, renderiza os filhos
};

export default PrivateRoute;
