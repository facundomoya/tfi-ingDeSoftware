package org.example.web.dto;

public class ObraSocialDTO {
    private String codigo;
    private String nombre;
    private String numeroAfiliado;

    public ObraSocialDTO() {}

    public ObraSocialDTO(String codigo, String nombre) {
        this.codigo = codigo;
        this.nombre = nombre;
    }

    public ObraSocialDTO(String codigo, String nombre, String numeroAfiliado) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.numeroAfiliado = numeroAfiliado;
    }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getNumeroAfiliado() { return numeroAfiliado; }
    public void setNumeroAfiliado(String numeroAfiliado) { this.numeroAfiliado = numeroAfiliado; }
}

