import { useState, useEffect } from "react";
import { listarAtenciones, type Atencion } from "../api/atenciones";
import toast from "react-hot-toast";
import { FileText, Calendar, User, Stethoscope } from "lucide-react";
import { formatearFecha } from "../utils/fecha";

export default function Atenciones() {
  const [atenciones, setAtenciones] = useState<Atencion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarAtenciones();
  }, []);

  async function cargarAtenciones() {
    setLoading(true);
    try {
      const data = await listarAtenciones();
      setAtenciones(data);
    } catch (e) {
      toast.error("No se pudieron cargar las atenciones");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  

  function colorNivel(nivel: string) {
    switch (nivel.toUpperCase()) {
      case "CRITICA":
        return "bg-red-100 text-red-700";
      case "EMERGENCIA":
        return "bg-orange-100 text-orange-700";
      case "URGENCIA":
        return "bg-yellow-100 text-yellow-700";
      case "URGENCIA MENOR":
        return "bg-green-100 text-green-700";
      case "SIN URGENCIA":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#37393A] flex items-center gap-2">
          <FileText size={28} />
          Atenciones Realizadas
        </h1>
        <button
          onClick={cargarAtenciones}
          disabled={loading}
          className="relative inline-flex items-center gap-2 justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl bg-linear-to-br from-[#4ea5f5] to-[#4fcd89] group shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
        >
          <span className="relative px-5 py-2.5 bg-white text-[#2e3440] rounded-[10px] transition-all duration-300 group-hover:bg-transparent group-hover:text-white flex items-center gap-2">
            {loading ? "Cargando..." : "Actualizar"}
          </span>
        </button>
      </div>

      {loading && atenciones.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando atenciones...</p>
        </div>
      ) : atenciones.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No hay atenciones registradas</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#C7D3DD]/40 text-[#37393A]">
                <tr>
                  <th className="p-4 text-left text-[#77B6EA] font-semibold">Fecha</th>
                  <th className="p-4 text-left text-[#77B6EA] font-semibold">Paciente</th>
                  <th className="p-4 text-left text-[#77B6EA] font-semibold">CUIL Paciente</th>
                  <th className="p-4 text-left text-[#77B6EA] font-semibold">Nivel</th>
                  <th className="p-4 text-left text-[#77B6EA] font-semibold">Médico</th>
                  <th className="p-4 text-left text-[#77B6EA] font-semibold">Informe</th>
                </tr>
              </thead>
              <tbody>
                {atenciones.map((atencion, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium">
                          {formatearFecha(atencion.fechaAtencion)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium">
                          {atencion.nombrePaciente} {atencion.apellidoPaciente}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{atencion.cuilPaciente}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${colorNivel(
                          atencion.nivelEmergencia
                        )}`}
                      >
                        {atencion.nivelEmergencia}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope size={16} className="text-gray-400" />
                        <span className="text-gray-700">
                          {atencion.nombreMedico} {atencion.apellidoMedico}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-md">
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {atencion.informe}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {atenciones.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Total de atenciones: <span className="font-semibold">{atenciones.length}</span>
        </div>
      )}
    </div>
  );
}

