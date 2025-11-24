package org.example.web.mapper;

import org.example.domain.*;
import org.example.web.dto.*;

public class PacienteMapper {
    public static PacienteDTO toDTO(Paciente paciente) {
        DomicilioDTO domicilioDTO = new DomicilioDTO(
            paciente.getDomicilio().getCalle(),
            paciente.getDomicilio().getNumero(),
            paciente.getDomicilio().getLocalidad()
        );

        ObraSocialDTO obraSocialDTO = null;
        if (paciente.tieneAfiliacion()) {
            Afiliacion afil = paciente.getAfiliacion();
            obraSocialDTO = new ObraSocialDTO(
                afil.getObraSocial().getCodigo(),
                afil.getObraSocial().getNombre(),
                afil.getNumeroAfiliado()
            );
        }

        return new PacienteDTO(
            paciente.getCuil(),
            paciente.getNombre(),
            paciente.getApellido(),
            domicilioDTO,
            obraSocialDTO
        );
    }
}

