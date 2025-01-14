import React, { Component } from 'react';
import axios from 'axios';
import Constants from '../js/Constans.jsx';
import '../styles/SelectDataClient.css';
import Warning from "./Warning";

class SelectDataClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client: {
                codigo: "",
                nombre: "",
            },
            dataClient: {},
            clientList: [],
            searchQuery: "",
            selectedOption: "",
            loading: false
        };
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.setState({ loading: true });

            const url = `${Constants.apiUrl()}get_clients/${this.state.searchQuery}/`;
            axios.get(url)
                .then(response => {
                    if (response.status === 200) {
                        const clientList = response.data.data;
 
                        if (clientList.length > 0) {
                            const firstClient = clientList[0];
                            this.setState({
                                clientList: clientList,
                                client: {
                                    nombre: firstClient.nombre.trim(),
                                    codigo: firstClient.codigo.trim()
                                },
                                loading: false
                            });
                            
                             
                            this.getClientInfo(firstClient.codigo);
                        } else {
                            this.setState({ clientList: [], loading: false });
                            alert('No se encontraron coincidencias');
                        }
                    } else {
                        this.setState({ loading: false });
                        alert('Error: No se encontraron coincidencias');
                    }
                })
                .catch(error => {
                    if (error.response ) {
                        const errorData = error.response.data;
                        this.setState({
                            errorMessage: errorData.error ? errorData.error : 'Error al hacer la petición',
                            warningIsOpen: true,
                        });
                         
                    } 
                });
        }
    }

    handleInputChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    }

    handleSelectChange = (event) => {
        const selectedCodigo = event.target.value;
        const selectedClient = this.state.clientList.find(client => client.codigo === selectedCodigo);
        if (selectedClient) {
            this.setState({
                client: {
                    nombre: selectedClient.nombre.trim(),
                    codigo: selectedClient.codigo.trim(),
                },
                selectedOption: selectedCodigo
            }, () => {
                this.getClientInfo(selectedCodigo);
            });
        }
    }

    getClientInfo = (codigo) => {
        this.setState({ loading: true });

        const url = `${Constants.apiUrl()}client_info`;

 
        axios.post(url, {
            'historyId': codigo
        })
        .then(response => {
            if (response.status === 200) {
                
                if (response.data && response.data.data && response.data.data.length > 0) {
                    const clientData = response.data.data[0];
                    console.log(clientData)
                    this.setState({ dataClient: clientData });
                    this.handleClientSelection(clientData);  
                } else {
                    alert('Error: No se encontraron los datos del cliente');
                }
            } else {
                alert('Error: No se encontraron los datos del cliente');
            }
        })
        .catch(error => {
            if (error.response ) {
                const errorData = error.response.data;
                this.setState({
                    errorMessage: errorData.error ? errorData.error : 'Error al hacer la petición',
                    warningIsOpen: true,
                });
                 
            } 
        })
        .finally(() => {
            this.setState({ loading: false });
        });
    }

    handleClientSelection = (selectedClient) => {
        this.props.getClienInfo(selectedClient);
    }
    render() {
        return (
            <div className="secet-data-client">
                <div className='input-name-client'>
                    <div className="input-name-profesional">
                        <label>Buscar Cliente</label>
                        <input 
                            type="text"
                            placeholder="Buscar por nombre"
                            value={this.state.searchQuery} 
                            onChange={this.handleInputChange} 
                            onKeyDown={this.handleKeyDown} 
                        />
                    </div>
                    <div className="select-profesional">
                        <label>Seleccionar Cliente</label>
                        <select 
                            name="select-profesional" 
                            value={this.state.selectedOption}
                            onChange={this.handleSelectChange}
                        >
                            {this.state.clientList.map((client, index) => (
                                <option key={index} value={client.codigo}>
                                    {client.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='show-data-client-3'>
                    <div className="read-info-p">
                            <label>Nombre</label>
                            <input 
                                type="text"
                                placeholder={this.state.loading ? 'Buscando...' : this.state.dataClient.nombre}
                                readOnly
                            />
                    </div>
                    <div className="read-info-p">
                        <label>Numero de hístoria</label>
                        <input
                            type="text"
                            placeholder={this.state.loading ? 'Buscando...' : this.state.dataClient.codigo}
                            readOnly
                        />
                    </div>
                    <div className="read-info-p">
                        <label>Direccion</label>
                        <input 
                            type="text"
                            placeholder={this.state.loading ? 'Buscando...' :this.state.dataClient.direcc }
                                readOnly
                        />
                    </div>


                </div>

                <div className='show-data-client-3'>
                    <div className="read-info-p">
                        <label>Número de cedula</label>
                        <input
                            type="text"
                            placeholder={this.state.loading ? 'Buscando...' : this.state.dataClient.nit_cli}
                            readOnly
                        />
                    </div>
                    <div className="read-info-p">
                        <label>Entidad</label>
                        <input 
                            type="text"
                            placeholder={this.state.loading ? 'Buscando...' : this.state.dataClient.entidad}
                                readOnly
                        />
                    </div>
                    <div className="read-info-p">
                        <label>Contacto</label>
                        <input
                            type="text"
                            placeholder={this.state.loading ? 'Buscando...' : this.state.dataClient.cel}
                            readOnly
                        />
                    </div>


                </div>

                <div className='show-data-client-4' >
                    <div className="read-info-p">
                        <label>Barrio</label>
                        <input
                            type="text"
                            placeholder={this.state.loading ? 'Buscando...' : this.state.dataClient.barrio}
                            readOnly
                        />
                    </div>
                    <div className="read-info-p">
                        <label>Municipio</label>
                        <input
                            type="text"
                            placeholder={this.state.loading ? 'Buscando...' : this.state.dataClient.municipio}
                            readOnly
                        />
                    </div>
                    <div className='sex-and-age'>
                        <div className="read-info-p">
                            <label>Sexo</label>
                            <input
                                type="text"
                                placeholder={this.state.loading ? 'Buscando...' : this.state.dataClient.sexo}
                                readOnly
                            />
                        </div>
                        <div className="read-info-p">
                            <label>edad</label>
                            <input
                                type="text"
                                placeholder={this.state.loading ? 'Buscando...' : this.state.dataClient.f_nacio}
                                readOnly
                            />
                        </div>
                    </div>

                </div>

                <div>
                    <Warning
                        isOpen={this.state.warningIsOpen}
                        onClose={() => this.setState({ warningIsOpen: false })}
                        errorMessage={this.state.errorMessage}
                    />
                </div>
 
            </div>
             
        );
    }
}

export default SelectDataClient;
