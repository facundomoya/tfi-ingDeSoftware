
package org.example.web.mapper;

import org.example.domain.Ingreso;
import org.example.web.dto.IngresoDTO;

public class IngresoMapper {

    public static IngresoDTO toDTO(Ingreso ingreso) {
        IngresoDTO dto = new IngresoDTO();
<<<<<<< HEAD

=======
>>>>>>> eeaad0681ae00bbf4f2726ef8f77950b02add568
        dto.setCuilPaciente(ingreso.getCuilPaciente());

        dto.setNombrePaciente(ingreso.getPaciente().getNombre());
        dto.setApellidoPaciente(ingreso.getPaciente().getApellido());

        dto.setNivelEmergencia(ingreso.getNivelEmergencia().name());
        dto.setInforme(ingreso.getInforme());
        dto.setTemperatura(ingreso.getTemperatura());
        dto.setFrecuenciaCardiaca(ingreso.getFrecuenciaCardiaca());
        dto.setFrecuenciaRespiratoria(ingreso.getFrecuenciaRespiratoria());
        dto.setTensionSistolica(ingreso.getTensionSistolica());
        dto.setTensionDiastolica(ingreso.getTensionDiastolica());
        dto.setEstado(ingreso.getEstado().name());

        if (ingreso.getEnfermera() != null) {
            dto.setEnfermeroCuil(ingreso.getEnfermera().getCuil());
        }
<<<<<<< HEAD

=======
>>>>>>> eeaad0681ae00bbf4f2726ef8f77950b02add568
        dto.setFechaIngreso(ingreso.getFechaIngreso().toString());

        return dto;
    }
}
