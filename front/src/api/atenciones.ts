import { http } from "./http";

export interface Atencion {
  cuilPaciente: string;
  nombrePaciente: string;
  apellidoPaciente: string;
  cuilMedico: string;
  nombreMedico: string;
  apellidoMedico: string;
  informe: string;
  fechaAtencion: string; // ISO string
  nivelEmergencia: string;
}

export async function listarAtenciones(): Promise<Atencion[]> {
  const { data } = await http.get<Atencion[]>("/atenciones");
  return data;
}

