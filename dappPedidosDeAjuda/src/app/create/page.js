"use client"

import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { openRequest } from "../../services/Web3Services";

export default function Home() {

    //representa os 4 campos da tela
    const [request, setRequest] = useState({
        titulo: "",
        descricao: "",
        contato: "",
        metaDesejada: 0
    })

    //para quando ele digitar no campo alimentar o state correspondende associado!!
    function onInputChange(evt){
        setRequest(prevState => ({ ...prevState, [evt.target.id]: evt.target.value }));
    }


    function btnSaveClick(){
        alert("Iniciando processo de salvamento...");
        openRequest(request)
            .then(result => {
                alert("Pedido enviado com sucesso. Em alguns minutos estará disponível na página inicial.");
                window.location.href = "/";
            })
            .catch(err => {
                console.error(err);
                alert(err.message);
            })
    }

    return (
        <>
            <Header />

            <div className="container">
                <div className="ps-5">
                    <div className="row my-3">
                        <p className="lead">Preencha todos os campos abaixo para nos dizer o que precisa.</p>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-3">
                            <input type="text" id="titulo" className="form-control" maxLength={150} value={request.titulo} onChange={onInputChange} />
                            <label htmlFor="titulo">Resumo do que precisa:</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-3">
                            <textarea id="descricao" className="form-control" style={{ height: 100 }} value={request.descricao} onChange={onInputChange} ></textarea>
                            <label htmlFor="descricao">Descreva em detalhes o que precisa e onde você está (para entregas presenciais):</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-3">
                            <input type="text" id="contato" className="form-control" maxLength={150}  value={request.contato} onChange={onInputChange} />
                            <label htmlFor="contato">Contato (telefone ou e-mail):</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-3">
                            <input type="number" id="metaDesejada" className="form-control" value={request.metaDesejada} onChange={onInputChange} />
                            <label htmlFor="metaDesejada">Meta em BNB (deixe em branco caso não deseje receber doação em cripto):</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-1 mb-3">
                            <a href="/" className="btn btn-outline-dark col-12 p-3">Voltar</a>
                        </div>
                        <div className="col-5 mb-3 p-0">
                            <button type="button" className="btn btn-dark col-12 p-3" onClick={btnSaveClick}>Enviar Pedido</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
