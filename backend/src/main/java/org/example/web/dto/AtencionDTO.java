package org.example.web.dto;

import java.time.LocalDateTime;

public class AtencionDTO {
    private String cuilPaciente;
    private String nombrePaciente;
    private String apellidoPaciente;
    private String cuilMedico;
    private String nombreMedico;
    private String apellidoMedico;
    private String informe;
    private LocalDateTime fechaAtencion;
    private String nivelEmergencia;

    public AtencionDTO() {}

    public String getCuilPaciente() {
        return cuilPaciente;
    }

    public void setCuilPaciente(String cuilPaciente) {
        this.cuilPaciente = cuilPaciente;
    }

    public String getNombrePaciente() {
        return nombrePaciente;
    }

    public void setNombrePaciente(String nombrePaciente) {
        this.nombrePaciente = nombrePaciente;
    }

    public String getApellidoPaciente() {
        return apellidoPaciente;
    }

    public void setApellidoPaciente(String apellidoPaciente) {
        this.apellidoPaciente = apellidoPaciente;
    }

    public String getCuilMedico() {
        return cuilMedico;
    }

    public void setCuilMedico(String cuilMedico) {
        this.cuilMedico = cuilMedico;
    }

    public String getNombreMedico() {
        return nombreMedico;
    }

    public void setNombreMedico(String nombreMedico) {
        this.nombreMedico = nombreMedico;
    }

    public String getApellidoMedico() {
        return apellidoMedico;
    }

    public void setApellidoMedico(String apellidoMedico) {
        this.apellidoMedico = apellidoMedico;
    }

    public String getInforme() {
        return informe;
    }

    public void setInforme(String informe) {
        this.informe = informe;
    }

    public LocalDateTime getFechaAtencion() {
        return fechaAtencion;
    }

    public void setFechaAtencion(LocalDateTime fechaAtencion) {
        this.fechaAtencion = fechaAtencion;
    }

    public String getNivelEmergencia() {
        return nivelEmergencia;
    }

    public void setNivelEmergencia(String nivelEmergencia) {
        this.nivelEmergencia = nivelEmergencia;
    }
}

