import { http } from "./http";
import type { IngresoUrgencia } from "./urgencia";

export interface ReclamarPacienteResponse extends IngresoUrgencia {}

export async function reclamarSiguientePaciente(): Promise<ReclamarPacienteResponse> {
  const { data } = await http.post<ReclamarPacienteResponse>("/reclamo");
  return data;
}

export async function obtenerPacienteEnAtencion(): Promise<IngresoUrgencia | null> {
  const { data } = await http.get<IngresoUrgencia | null>("/reclamo/actual");
  return data;
}

export interface RegistrarAtencionDTO {
  cuilPaciente: string;
  informe: string;
}

export async function registrarAtencion(payload: RegistrarAtencionDTO): Promise<void> {
  await http.post("/atencion", payload);
}

