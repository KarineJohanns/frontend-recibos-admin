import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Parcelas from "./pages/Parcelas";
import Relatorios from "./pages/Relatorios";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import ParcelaDetails from "./pages/ParcelaDetails";
import CriarParcela from "./pages/CriarParcela";
import EditarParcela from "./pages/EditarParcela";
import RenegociarParcela from "./pages/RenegociarParcela";
import { ParcelaProvider } from "./ParcelaContext"; // Importando o ParcelaProvider

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const userSession = localStorage.getItem("userSession");

    // Redireciona para o login se não houver sessão ativa e a rota não for uma das permitidas
    if (!userSession && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate, location.pathname]);


  return (
    <ParcelaProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas com PrivateRoute */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Parcelas />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/parcelas"
          element={
            <PrivateRoute>
              <Layout>
                <Parcelas />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/parcelas/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ParcelaDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <Layout>
                <Relatorios />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/criar-parcela"
          element={
            <PrivateRoute>
              <Layout>
                <CriarParcela />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/editar-parcela/:parcelaId"
          element={
            <PrivateRoute>
              <Layout>
                <EditarParcela />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/renegociar-parcela/:parcelaId"
          element={
            <PrivateRoute>
              <Layout>
                <RenegociarParcela />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </ParcelaProvider>
  );
};

export default App;
