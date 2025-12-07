import { useState, useEffect } from "react";
import { reclamarSiguientePaciente, registrarAtencion, obtenerPacienteEnAtencion, type RegistrarAtencionDTO } from "../api/reclamo";
import { listarIngresosPendientes, type IngresoUrgencia } from "../api/urgencia";
import toast from "react-hot-toast";
import { ListaEsperaTable } from "../components/ListaEsperaTable";
import PacienteModal from "../modal/PacienteModal";
import { ClipboardCheck, UserCheck } from "lucide-react";

type FormAtencionState = {
  informe: string;
};

const initialFormAtencion: FormAtencionState = {
  informe: "",
};

export default function Medico() {
  const [ingresosPendientes, setIngresosPendientes] = useState<IngresoUrgencia[]>([]);
  const [ingresoReclamado, setIngresoReclamado] = useState<IngresoUrgencia | null>(null);
  const [openModalAtencion, setOpenModalAtencion] = useState(false);
  const [formAtencion, setFormAtencion] = useState<FormAtencionState>(initialFormAtencion);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarIngresos();
    cargarPacienteEnAtencion();
  }, []);

  async function cargarIngresos() {
    try {
      const data = await listarIngresosPendientes();
      setIngresosPendientes(data);
    } catch (e) {
      toast.error("No se pudo cargar la lista de espera");
      console.error(e);
    }
  }

  async function cargarPacienteEnAtencion() {
    try {
      const ingreso = await obtenerPacienteEnAtencion();
      if (ingreso) {
        setIngresoReclamado(ingreso);
      }
    } catch (e) {
      // Si no hay paciente en atención, no mostrar error
      console.log("No hay paciente en atención actualmente");
    }
  }

  async function handleReclamar() {
    setLoading(true);
    try {
      const ingreso = await reclamarSiguientePaciente();
      setIngresoReclamado(ingreso);
      toast.success(`Paciente ${ingreso.nombrePaciente} ${ingreso.apellidoPaciente} reclamado exitosamente`);
      await cargarIngresos(); // Recargar lista
    } catch (error: any) {
      const msg = error?.response?.data || "Error al reclamar paciente";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegistrarAtencion(e: React.FormEvent) {
    e.preventDefault();
    if (!ingresoReclamado) {
      toast.error("No hay un paciente reclamado");
      return;
    }

    if (!formAtencion.informe.trim()) {
      toast.error("El informe es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const payload: RegistrarAtencionDTO = {
        cuilPaciente: ingresoReclamado.cuilPaciente,
        informe: formAtencion.informe.trim(),
      };
      await registrarAtencion(payload);
      toast.success("Atención registrada exitosamente");
      setIngresoReclamado(null);
      setFormAtencion(initialFormAtencion);
      setOpenModalAtencion(false);
      await cargarIngresos();
      await cargarPacienteEnAtencion(); // Verificar si hay otro paciente en atención
    } catch (error: any) {
      const msg = error?.response?.data || "Error al registrar atención";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold text-[#37393A] mb-6">Panel Médico</h1>

      {/* SECCIÓN RECLAMAR PACIENTE */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#37393A] flex items-center gap-2">
            <UserCheck size={24} />
            Reclamar Siguiente Paciente
          </h2>
          <button
            onClick={handleReclamar}
            disabled={loading || ingresosPendientes.length === 0}
            className="relative inline-flex items-center gap-2 justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl bg-linear-to-br from-[#4ea5f5] to-[#4fcd89] group shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative px-5 py-2.5 bg-white text-[#2e3440] rounded-[10px] transition-all duration-300 group-hover:bg-transparent group-hover:text-white flex items-center gap-2">
              <ClipboardCheck size={16} />
              {loading ? "Reclamando..." : "Reclamar Siguiente"}
            </span>
          </button>
        </div>
        {ingresosPendientes.length === 0 && (
          <p className="text-gray-500 text-sm">No hay pacientes en espera</p>
        )}
      </div>

      {/* PACIENTE RECLAMADO */}
      {ingresoReclamado && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Paciente en Atención</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Paciente:</span> {ingresoReclamado.nombrePaciente} {ingresoReclamado.apellidoPaciente}
            </div>
            <div>
              <span className="font-medium">CUIL:</span> {ingresoReclamado.cuilPaciente}
            </div>
            <div>
              <span className="font-medium">Nivel:</span> {ingresoReclamado.nivelEmergencia}
            </div>
            <div>
              <span className="font-medium">Informe inicial:</span> {ingresoReclamado.informe}
            </div>
          </div>
          <button
            onClick={() => setOpenModalAtencion(true)}
            className="mt-4 relative inline-flex items-center gap-2 justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl bg-linear-to-br from-[#4ea5f5] to-[#4fcd89] group shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
          >
            <span className="relative px-5 py-2.5 bg-white text-[#2e3440] rounded-[10px] transition-all duration-300 group-hover:bg-transparent group-hover:text-white flex items-center gap-2">
              Registrar Atención
            </span>
          </button>
        </div>
      )}

      {/* LISTA DE ESPERA */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#37393A] mb-4">Lista de Espera</h2>
        {ingresosPendientes.length === 0 ? (
          <p className="text-gray-500">No hay pacientes en espera</p>
        ) : (
          <ListaEsperaTable ingresos={ingresosPendientes} />
        )}
      </div>

      {/* MODAL REGISTRAR ATENCIÓN */}
      <PacienteModal open={openModalAtencion} onClose={() => setOpenModalAtencion(false)}>
        <h2 className="text-xl font-semibold mb-4 text-[#37393A]">Registrar Atención</h2>
        {ingresoReclamado && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Paciente: {ingresoReclamado.nombrePaciente} {ingresoReclamado.apellidoPaciente}
            </p>
            <p className="text-xs text-blue-700">CUIL: {ingresoReclamado.cuilPaciente}</p>
          </div>
        )}
        <form onSubmit={handleRegistrarAtencion} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informe de Atención *
            </label>
            <textarea
              className="w-full rounded-xl border px-4 py-2.5 shadow-sm bg-white focus:ring-2 focus:ring-[#77B6EA]/40 focus:border-[#77B6EA] outline-none transition-all min-h-[150px]"
              value={formAtencion.informe}
              onChange={(e) => setFormAtencion({ ...formAtencion, informe: e.target.value })}
              placeholder="Describa la atención brindada al paciente..."
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setOpenModalAtencion(false)}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-xl group bg-linear-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-pink-200"
            >
              <span className="relative px-4 py-2.5 bg-white text-gray-700 rounded-xl transition-all ease-in duration-150 group-hover:bg-transparent group-hover:text-white">
                Cancelar
              </span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative inline-flex items-center gap-2 justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl bg-linear-to-br from-[#4ea5f5] to-[#4fcd89] group shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              <span className="relative px-5 py-2.5 bg-white text-[#2e3440] rounded-[10px] transition-all duration-300 group-hover:bg-transparent group-hover:text-white flex items-center gap-2">
                {loading ? "Guardando..." : "Registrar Atención"}
              </span>
            </button>
          </div>
        </form>
      </PacienteModal>
    </div>
  );
}

