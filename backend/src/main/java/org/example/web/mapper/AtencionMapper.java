package org.example.web.mapper;

import org.example.domain.Atencion;
import org.example.web.dto.AtencionDTO;

public class AtencionMapper {
    public static AtencionDTO toDTO(Atencion atencion) {
        AtencionDTO dto = new AtencionDTO();
        
        // Datos del paciente desde el ingreso
        dto.setCuilPaciente(atencion.getIngreso().getCuilPaciente());
        dto.setNombrePaciente(atencion.getIngreso().getPaciente().getNombre());
        dto.setApellidoPaciente(atencion.getIngreso().getPaciente().getApellido());
        
        // Datos del médico
        dto.setCuilMedico(atencion.getMedico().getCuil());
        dto.setNombreMedico(atencion.getMedico().getNombre());
        dto.setApellidoMedico(atencion.getMedico().getApellido());
        
        // Informe y fecha
        dto.setInforme(atencion.getInforme());
        dto.setFechaAtencion(atencion.getFechaAtencion());
        
        // Nivel de emergencia del ingreso
        dto.setNivelEmergencia(atencion.getIngreso().getNivelEmergencia().name());
        
        return dto;
    }
}

