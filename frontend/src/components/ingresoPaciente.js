import React, { useState } from "react";

export default function IngresoPaciente() {
  const [form, setForm] = useState({
    cuil: "",
    nombre: "",
    apellido: "",
    calle: "",
    numero: "",
    localidad: "",
    obraSocial: "",
    numeroAfiliado: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const obrasSociales = [
    "PAMI",
    "OSDE",
    "SWISS MEDICAL",
    "GALENO",
    "MEDIFE",
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validarFront = () => {
    if (!form.cuil.trim()) return "El CUIL es obligatorio";
    if (!form.nombre.trim()) return "El nombre es obligatorio";
    if (!form.apellido.trim()) return "El apellido es obligatorio";
    if (!form.calle.trim()) return "La calle es obligatoria";
    if (!form.numero.trim()) return "El número es obligatorio";
    if (!form.localidad.trim()) return "La localidad es obligatoria";

    if (form.obraSocial && !form.numeroAfiliado.trim())
      return "Debe ingresar número de afiliado";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    const err = validarFront();
    if (err) {
      setError(err);
      return;
    }

    try {
      const resp = await fetch("http://localhost:8080/pacientes/alta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cuil: form.cuil,
          nombre: form.nombre,
          apellido: form.apellido,
          domicilio: {
            calle: form.calle,
            numero: Number(form.numero),
            localidad: form.localidad,
          },
          obraSocial: form.obraSocial || null,
          numeroAfiliado: form.obraSocial ? form.numeroAfiliado : null,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.message || "Error desconocido");
      } else {
        setMensaje("Paciente registrado correctamente");
        setForm({
          cuil: "",
          nombre: "",
          apellido: "",
          calle: "",
          numero: "",
          localidad: "",
          obraSocial: "",
          numeroAfiliado: "",
        });
      }
    } catch (ex) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div style={{ width: "450px", margin: "auto", padding: "20px" }}>
      <h2>Ingreso de Paciente</h2>

      {mensaje && <div style={{ color: "green" }}>{mensaje}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>CUIL:</label>
        <input name="cuil" value={form.cuil} onChange={handleChange} />

        <label>Nombre:</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} />

        <label>Apellido:</label>
        <input name="apellido" value={form.apellido} onChange={handleChange} />

        <label>Calle:</label>
        <input name="calle" value={form.calle} onChange={handleChange} />

        <label>Número:</label>
        <input name="numero" value={form.numero} onChange={handleChange} />

        <label>Localidad:</label>
        <input name="localidad" value={form.localidad} onChange={handleChange} />

        <label>Obra Social:</label>
        <select name="obraSocial" value={form.obraSocial} onChange={handleChange}>
          <option value="">Sin obra social</option>
          {obrasSociales.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>

        {form.obraSocial && (
          <>
            <label>Número de Afiliado:</label>
            <input
              name="numeroAfiliado"
              value={form.numeroAfiliado}
              onChange={handleChange}
            />
          </>
        )}

        <button type="submit">Guardar</button>
        <button type="button" onClick={() => window.location.reload()}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
