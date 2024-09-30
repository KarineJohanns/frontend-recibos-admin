// src/App.tsx
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Parcelas from "./pages/Parcelas";
import Relatorios from "./pages/Relatorios";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import ParcelaDetails from "./pages/ParcelaDetails";

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const userSession = localStorage.getItem("userSession");
    if (!userSession) {
      navigate("/login"); // Redireciona para a tela de login se não houver sessão
    }
  }, [navigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Parcelas />
            </PrivateRoute>
          }
        />
        <Route
          path="/parcelas/:id"
          element={
            <PrivateRoute>
              <ParcelaDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <Relatorios />
            </PrivateRoute>
          }
        />
        <Route
          path="/parcelas"
          element={
            <PrivateRoute>
              <Parcelas />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
