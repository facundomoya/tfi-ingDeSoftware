// routes.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import IngresoPaciente from "../components/ingresoPaciente";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pantalla de ingreso de pacientes */}
        <Route path="/ingreso-paciente" element={<IngresoPaciente/>}/>

        {/* Ruta raíz redirige a login */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
