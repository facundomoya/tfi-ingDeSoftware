package org.example.web.controller;

import org.example.app.interfaces.RepositorioObrasSociales;
import org.example.web.dto.ObraSocialDTO;
import org.example.web.mapper.ObraSocialMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/obras-sociales")
public class ObraSocialController {

    private final RepositorioObrasSociales repositorioObrasSociales;

    public ObraSocialController(RepositorioObrasSociales repositorioObrasSociales) {
        this.repositorioObrasSociales = repositorioObrasSociales;
    }

    @GetMapping
    public ResponseEntity<List<ObraSocialDTO>> listarObrasSociales() {
        List<ObraSocialDTO> dtos = repositorioObrasSociales.listarTodas().stream()
                .map(ObraSocialMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
