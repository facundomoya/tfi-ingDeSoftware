// src/main/java/org/example/app/interfaces/RepositorioObrasSociales.java
package org.example.app.interfaces;

import org.example.domain.ObraSocial;

import java.util.List;
import java.util.Optional;

public interface RepositorioObrasSociales {

    // buscar por código (si ya lo usás en el dominio)
    Optional<ObraSocial> buscarPorCodigo(String codigo);

    // listar todas (para el controller)
    List<ObraSocial> listarTodas();

    // si querés, también un método para guardar/registrar
    void guardar(ObraSocial obraSocial);
}
