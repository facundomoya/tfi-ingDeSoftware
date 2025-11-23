import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Paciente from "../pages/Paciente";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sidebar />}>
          <Route path="paciente" element={<Paciente />} />
          <Route index element={<Navigate to="paciente" />} />
        </Route>

        <Route path="*" element={<Navigate to="/paciente" />} />
      </Routes>
    </BrowserRouter>
  );
}
