// import { useAuthStore } from "../store/auth";
import { Link, Outlet } from "react-router-dom";

export default function Sidebar() {
  // const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 bg-white shadow p-4">
        <h2 className="font-bold text-lg">Panel Admin</h2>

        <nav className="mt-4 flex flex-col gap-2 text-sm">
          <Link to="/paciente" className="hover:text-black text-gray-600">
            Paciente
          </Link>
          <Link to="/admin/turnos" className="hover:text-black text-gray-600">
            Enfermero
          </Link>
          <Link to="/admin/clientes" className="hover:text-black text-gray-600">
            Clientes
          </Link>
        </nav>

        <button
          // onClick={logout}
          className="mt-10 text-red-600 font-semibold text-sm"
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-6">
        {/* Acá se renderiza Paciente u otras rutas hijas */}
        <Outlet />
      </main>
    </div>
  );
}
