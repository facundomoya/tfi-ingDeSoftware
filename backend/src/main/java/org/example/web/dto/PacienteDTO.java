package org.example.web.dto;

public class PacienteDTO {
    private String cuil;
    private String nombre;
    private String apellido;
    private DomicilioDTO domicilio;
    private ObraSocialDTO obraSocial;

    public PacienteDTO() {}

    public PacienteDTO(String cuil, String nombre, String apellido, DomicilioDTO domicilio, ObraSocialDTO obraSocial) {
        this.cuil = cuil;
        this.nombre = nombre;
        this.apellido = apellido;
        this.domicilio = domicilio;
        this.obraSocial = obraSocial;
    }

    public String getCuil() {
        return cuil;
    }

    public void setCuil(String cuil) {
        this.cuil = cuil;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public DomicilioDTO getDomicilio() {
        return domicilio;
    }

    public void setDomicilio(DomicilioDTO domicilio) {
        this.domicilio = domicilio;
    }

    public ObraSocialDTO getObraSocial() {
        return obraSocial;
    }

    public void setObraSocial(ObraSocialDTO obraSocial) {
        this.obraSocial = obraSocial;
    }
}
