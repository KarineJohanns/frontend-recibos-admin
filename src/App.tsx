// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Parcelas from "./pages/Parcelas";
import Relatorios from "./pages/Relatorios";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import ParcelaDetails from "./pages/ParcelaDetails";
import CriarParcela from "./pages/CriarParcela";
import EditarParcela from "./pages/EditarParcela";
import RenegociarParcela from "./pages/RenegociarParcela";

const App: React.FC = () => {
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
        <Route
          path="/criar-parcela"
          element={
            <PrivateRoute>
              <CriarParcela />
            </PrivateRoute>
          }
        />
        <Route
          path="/editar-parcela/:parcelaId"
          element={
            <PrivateRoute>
              <EditarParcela />
            </PrivateRoute>
          }
        />
        <Route
          path="/renegociar-parcela/:parcelaId"
          element={
            <PrivateRoute>
              <RenegociarParcela />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
