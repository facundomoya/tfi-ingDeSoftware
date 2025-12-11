package org.example.app;

import org.example.app.interfaces.RepositorioPacientes;
import org.example.app.interfaces.RepositorioObrasSociales;
import org.example.domain.Afiliacion;
import org.example.domain.Domicilio;
import org.example.domain.ObraSocial;
import org.example.domain.Paciente;
import org.example.domain.Exceptions.DomainException;

import java.util.List;

public class ServicioAltaPaciente {

    private final RepositorioPacientes repoPacientes;
    private final RepositorioObrasSociales repoOS;

    public ServicioAltaPaciente(RepositorioPacientes repoPacientes, RepositorioObrasSociales repoOS) {
        this.repoPacientes = repoPacientes;
        this.repoOS = repoOS;
    }

    public Paciente registrarPaciente(
            String cuil, String nombre, String apellido,
            String calle, Integer numero, String localidad,
            String obraSocialCodigo, String numeroAfiliado // ambos opcionales en la API
    ) {
        // Evitar duplicados por CUIL antes de crear
        if (repoPacientes.buscarPacientePorCuil(cuil).isPresent()) {
            throw DomainException.validation("Ya existe un paciente registrado con el CUIL " + cuil);
        }

        // Campos mandatorios del paciente
        Domicilio domicilio = new Domicilio(calle, numero, localidad);

        // Sin obra social: se crea sin afiliación
        if (isBlank(obraSocialCodigo)) {
            Paciente p = new Paciente(cuil, nombre, apellido, domicilio);
            repoPacientes.guardarPaciente(p);
            return p;
        }

        // Con obra social: debe EXISTIR en catálogo
        ObraSocial os = repoOS.buscarPorCodigo(obraSocialCodigo)
                .orElseThrow(() -> DomainException.validation(
                        "No se puede registrar al paciente con una obra social inexistente: " + obraSocialCodigo));

        // Debe estar AFILIADO (numeroAfiliado mandatorio si vino OS)
        if (isBlank(numeroAfiliado)) {
            throw DomainException.validation(
                    "No se puede registrar al paciente dado que no está afiliado a la obra social " + obraSocialCodigo);
        }

        Afiliacion afiliacion = new Afiliacion(os, numeroAfiliado);
        Paciente p = new Paciente(cuil, nombre, apellido, domicilio, afiliacion);
        repoPacientes.guardarPaciente(p);
        return p;
    }

    public List<Paciente> listarPacientes() {
        return repoPacientes.listarTodos();
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
