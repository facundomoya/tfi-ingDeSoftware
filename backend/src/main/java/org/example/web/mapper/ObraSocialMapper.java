package org.example.web.mapper;

import org.example.domain.ObraSocial;
import org.example.web.dto.ObraSocialDTO;

public class ObraSocialMapper {
    public static ObraSocialDTO toDTO(ObraSocial os) {
        return new ObraSocialDTO(os.getCodigo(), os.getNombre());
    }
}

