package org.example.web.dto;

public class DomicilioDTO {
    private String calle;
    private Integer numero;
    private String localidad;

    public DomicilioDTO() {}

    public DomicilioDTO(String calle, Integer numero, String localidad) {
        this.calle = calle;
        this.numero = numero;
        this.localidad = localidad;
    }

    public String getCalle() { return calle; }
    public void setCalle(String calle) { this.calle = calle; }

    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }

    public String getLocalidad() { return localidad; }
    public void setLocalidad(String localidad) { this.localidad = localidad; }
}

