import { http } from "./http";

// ---- Tipos de dominio (adaptalos 1:1 con tu backend) ----
export type Cuil = string;

export interface Domicilio {
  calle: string;
  numero: number;
  localidad: string; // por ahora string, como definiste
}

export interface ObraSocial {
  codigo: string;      // o id: string | number
  nombre: string;
}

export interface AltaPacienteDTO {
  cuil: Cuil;
  apellido: string;
  nombre: string;
  domicilio: Domicilio;

  // OS opcional (pero si viene, numeroAfiliado es mandatorio)
  obraSocialCodigo?: string;
  numeroAfiliado?: string;
}

export interface Paciente {
  cuil: Cuil;
  apellido: string;
  nombre: string;
  domicilio: Domicilio;
  obraSocial?: {
    codigo: string;
    nombre: string;
    numeroAfiliado: string;
  } | null;
  // otros campos que devuelva tu back...
}

// ---- API ----

// Alta paciente
export async function createPaciente(payload: AltaPacienteDTO): Promise<Paciente> {
  const { data } = await http.post<Paciente>("/pacientes", payload);
  return data;
}

// (Opcional) listar obras sociales para el select
export async function listObrasSociales(): Promise<ObraSocial[]> {
  const { data } = await http.get<ObraSocial[]>("/obras-sociales");
  return data;
}

// Listar todos los pacientes
export async function listPacientes(): Promise<Paciente[]> {
  const { data } = await http.get<Paciente[]>("/pacientes");
  return data;
}