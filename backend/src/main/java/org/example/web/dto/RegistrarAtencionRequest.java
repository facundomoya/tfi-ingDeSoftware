package org.example.web.dto;

public class RegistrarAtencionRequest {
    private String cuilPaciente;
    private String informe;

    public RegistrarAtencionRequest() {}

    public String getCuilPaciente() {
        return cuilPaciente;
    }

    public void setCuilPaciente(String cuilPaciente) {
        this.cuilPaciente = cuilPaciente;
    }

    public String getInforme() {
        return informe;
    }

    public void setInforme(String informe) {
        this.informe = informe;
    }
}

