import React, { Component } from "react";
import axios from 'axios';


class FormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
    };
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const url = 'https://us17.api.mailchimp.com/3.0/lists/909141cea0/members';
    const apiKey = process.env.MAILCHIMP_API_KEY;
    console.log(apiKey)
    const data = {
      email_address: this.state.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: this.state.name,
        PHONE: this.state.phone
      }
    };
    console.log(data)
    axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `apikey ${apiKey}`
      }
    })
    .then(response => {
      console.log('se guardo en mailchimp',response);
      // Aquí puedes agregar lógica adicional después de enviar el formulario
    })
    .catch(error => {
      console.log('no se guardo en mailchimp',error);
      // Aquí puedes manejar los errores que puedan ocurrir durante el envío del formulario
    });
  }

  render() {
    return (
      <div>
        <h1>Formulario</h1>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <form onSubmit={this.handleSubmit}>
                <div class="mb-3">
                  <label htmlFor="name" class="form-label">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    class="form-control"
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label htmlFor="email" class="form-label">
                    Correo electrónico:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    class="form-control"
                    placeholder="Ingresa tu correo electrónico"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label htmlFor="phone" class="form-label">
                    Teléfono:
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.handleChange}
                    class="form-control"
                    placeholder="Ingresa tu número de teléfono"
                    required
                  />
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-primary">
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FormPage;
