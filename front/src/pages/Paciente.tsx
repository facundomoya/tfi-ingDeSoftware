import { useEffect, useMemo, useState } from "react";
import { createPaciente, listObrasSociales, listPacientes } from "../api/pacientes";
import type { AltaPacienteDTO, Domicilio, ObraSocial, Paciente } from "../api/pacientes";
import { extractErrorMessage } from "../api/http";

type FormState = {
  cuil: string;
  apellido: string;
  nombre: string;
  calle: string;
  numero: string; // lo parséamos
  localidad: string;
  obraSocialCodigo: string; // "" si no eligió
  numeroAfiliado: string;   // requerido sólo si eligió OS
};

const initialForm: FormState = {
  cuil: "",
  apellido: "",
  nombre: "",
  calle: "",
  numero: "",
  localidad: "San Miguel de Tucumán", // default opcional
  obraSocialCodigo: "",
  numeroAfiliado: "",
};

export default function Paciente() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [obras, setObras] = useState<ObraSocial[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const obraElegida = useMemo(
    () => obras.find(o => o.codigo === form.obraSocialCodigo),
    [obras, form.obraSocialCodigo]
  );

  // Cargar obras sociales y pacientes
  useEffect(() => {
    (async () => {
      try {
        const items = await listObrasSociales();
        setObras(items);
      } catch {
        // Si falla, podrías dejar el select vacío y permitir alta sin OS
        setObras([]);
      }
    })();

    cargarPacientes();
  }, []);

  async function cargarPacientes() {
    setLoadingPacientes(true);
    try {
      const lista = await listPacientes();
      setPacientes(lista);
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
    } finally {
      setLoadingPacientes(false);
    }
  }

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function validarFront(): string | null {
    // Reglas mínimas que ya valida tu back (evitamos viajes innecesarios):
    if (!form.cuil.trim()) return "El CUIL es obligatorio";
    if (!form.apellido.trim()) return "El apellido es obligatorio";
    if (!form.nombre.trim()) return "El nombre es obligatorio";
    if (!form.calle.trim()) return "La calle es obligatoria";
    if (!form.numero.trim() || isNaN(Number(form.numero))) return "El número de domicilio es obligatorio y debe ser numérico";
    if (!form.localidad.trim()) return "La localidad es obligatoria";

    if (form.obraSocialCodigo.trim()) {
      if (!form.numeroAfiliado.trim()) return "El número de afiliado es obligatorio cuando elegís obra social";
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    setOkMsg(null);

    const err = validarFront();
    if (err) {
      setErrMsg(err);
      return;
    }

    const domicilio: Domicilio = {
      calle: form.calle.trim(),
      numero: Number(form.numero),
      localidad: form.localidad.trim(),
    };

    const payload: AltaPacienteDTO = {
      cuil: form.cuil.trim(),
      apellido: form.apellido.trim(),
      nombre: form.nombre.trim(),
      domicilio,
    };

    if (form.obraSocialCodigo.trim()) {
      payload.obraSocialCodigo = form.obraSocialCodigo.trim();
      payload.numeroAfiliado = form.numeroAfiliado.trim();
    }

    setLoading(true);
    try {
      const creado = await createPaciente(payload);
      setOkMsg(`Paciente ${creado.apellido}, ${creado.nombre} (${creado.cuil}) creado correctamente`);
      setForm(initialForm);
      // Recargar la lista de pacientes
      await cargarPacientes();
    } catch (err) {
      setErrMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Alta de Paciente</h1>

      <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4">
        {/* Mensajes */}
        {okMsg && (
          <div className="rounded-lg border border-green-600 bg-green-50 px-4 py-3 text-green-800">
            {okMsg}
          </div>
        )}
        {errMsg && (
          <div className="rounded-lg border border-red-600 bg-red-50 px-4 py-3 text-red-800">
            {errMsg}
          </div>
        )}

        {/* Datos personales */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm text-slate-600">CUIL *</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              placeholder="20-40902338-0"
              value={form.cuil}
              onChange={(e) => onChange("cuil", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Apellido *</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              value={form.apellido}
              onChange={(e) => onChange("apellido", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Nombre *</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
            />
          </div>
        </div>

        {/* Domicilio */}
        <div className="rounded-2xl border p-4">
          <div className="mb-2 text-sm font-medium text-slate-700">Domicilio *</div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm text-slate-600">Calle *</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                value={form.calle}
                onChange={(e) => onChange("calle", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Número *</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                inputMode="numeric"
                value={form.numero}
                onChange={(e) => onChange("numero", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Localidad *</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                value={form.localidad}
                onChange={(e) => onChange("localidad", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Obra social (opcional) */}
        <div className="rounded-2xl border p-4">
          <div className="mb-2 text-sm font-medium text-slate-700">Obra Social (opcional)</div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-slate-600">Obra social</label>
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring bg-white"
                value={form.obraSocialCodigo}
                onChange={(e) => onChange("obraSocialCodigo", e.target.value)}
              >
                <option value="">— Sin obra social —</option>
                {obras.map(os => (
                  <option key={os.codigo} value={os.codigo}>
                    {os.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600">Número de afiliado {form.obraSocialCodigo ? "*" : "(opcional)"}</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                disabled={!form.obraSocialCodigo}
                value={form.numeroAfiliado}
                onChange={(e) => onChange("numeroAfiliado", e.target.value)}
              />
            </div>
          </div>

          {form.obraSocialCodigo && (
            <p className="mt-2 text-xs text-slate-500">
              * Requerido: tu backend valida que si se selecciona obra social, el paciente debe estar afiliado.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-5 py-2.5 text-white shadow hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creando..." : "Crear paciente"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => { setForm(initialForm); setOkMsg(null); setErrMsg(null); }}
            className="rounded-2xl border px-4 py-2 hover:bg-slate-50"
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Lista de Pacientes */}
      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Lista de Pacientes</h2>
          <button
            onClick={cargarPacientes}
            disabled={loadingPacientes}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-60"
          >
            {loadingPacientes ? "Cargando..." : "Actualizar"}
          </button>
        </div>

        {loadingPacientes && pacientes.length === 0 ? (
          <div className="rounded-xl border p-8 text-center text-slate-500">
            Cargando pacientes...
          </div>
        ) : pacientes.length === 0 ? (
          <div className="rounded-xl border p-8 text-center text-slate-500">
            No hay pacientes registrados
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pacientes.map((paciente) => (
              <div
                key={paciente.cuil}
                className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-2">
                  <h3 className="font-semibold text-slate-900">
                    {paciente.apellido}, {paciente.nombre}
                  </h3>
                  <p className="text-sm text-slate-600">CUIL: {paciente.cuil}</p>
                </div>
                
                <div className="mb-2 text-sm text-slate-700">
                  <p className="font-medium">Domicilio:</p>
                  <p className="text-slate-600">
                    {paciente.domicilio.calle} {paciente.domicilio.numero}, {paciente.domicilio.localidad}
                  </p>
                </div>

                {paciente.obraSocial ? (
                  <div className="rounded-lg bg-blue-50 p-2 text-sm">
                    <p className="font-medium text-blue-900">Obra Social:</p>
                    <p className="text-blue-700">{paciente.obraSocial.nombre}</p>
                    <p className="text-xs text-blue-600">N° Afiliado: {paciente.obraSocial.numeroAfiliado}</p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-slate-50 p-2 text-sm text-slate-600">
                    Sin obra social
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
