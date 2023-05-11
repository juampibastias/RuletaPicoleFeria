import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function FormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Por favor complete todos los campos.");
      return;
    }
    const data = { name, email, phone };
    axios
      .get(
        `https://sheet2api.com/v1/o9EZiCzTliju/leads-feria?phone=${phone}&email=${email}`
      )
      .then((response) => {
        if (response.data.length > 0) {
          alert(
            "Este número de teléfono o correo electrónico ya está registrado."
          );
        } else {
          axios
            .post("https://sheet2api.com/v1/o9EZiCzTliju/leads-feria", data)
            .then(() => {
              alert("Sus datos han sido enviados correctamente.");
              setName("");
              setEmail("");
              setPhone("");
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      <h1>Formulario FERIA</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default FormPage;
