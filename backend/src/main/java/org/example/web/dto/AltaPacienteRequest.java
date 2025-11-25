package org.example.web.dto;

public class AltaPacienteRequest {
    private String cuil;
    private String nombre;
    private String apellido;
    private DomicilioDTO domicilio;
    private String obraSocialCodigo;
    private String numeroAfiliado;

    public AltaPacienteRequest() {}

    public String getCuil() { return cuil; }
    public void setCuil(String cuil) { this.cuil = cuil; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public DomicilioDTO getDomicilio() { return domicilio; }
    public void setDomicilio(DomicilioDTO domicilio) { this.domicilio = domicilio; }

    public String getObraSocialCodigo() { return obraSocialCodigo; }
    public void setObraSocialCodigo(String obraSocialCodigo) { this.obraSocialCodigo = obraSocialCodigo; }

    public String getNumeroAfiliado() { return numeroAfiliado; }
    public void setNumeroAfiliado(String numeroAfiliado) { this.numeroAfiliado = numeroAfiliado; }
}

