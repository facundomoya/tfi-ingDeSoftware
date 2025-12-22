
package org.example.app.interfaces;

import org.example.domain.ObraSocial;

import java.util.List;
import java.util.Optional;

public interface RepositorioObrasSociales {

<<<<<<< HEAD
    Optional<ObraSocial> buscarPorCodigo(String codigo);

    List<ObraSocial> listarTodas();

=======

    Optional<ObraSocial> buscarPorCodigo(String codigo);

    
    List<ObraSocial> listarTodas();


>>>>>>> eeaad0681ae00bbf4f2726ef8f77950b02add568
    void guardar(ObraSocial obraSocial);
}
