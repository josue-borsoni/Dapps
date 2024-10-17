"use client"

import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDispute } from "@/services/Web3Services";
import { votar } from "@/services/Web3Services";


import Web3 from "web3";

export default function Bet() {

    const { push } = useRouter();

    const [message, setMessage] = useState();
    const [aux, setAux] = useState(0);

    const [dispute, setDispute] = useState({
        candidato1: "Loading...",
        candidato2: "Loading...",
        image1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHWFM1IG7wiMV5ef2xI-Yyxq2KCeWsjovfn5G42EwcKG15qAKzkCA2GH_V8xI3MrM0ADI&usqp=CAU",
        image2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHWFM1IG7wiMV5ef2xI-Yyxq2KCeWsjovfn5G42EwcKG15qAKzkCA2GH_V8xI3MrM0ADI&usqp=CAU",
        total1: 0,
        total2: 0,
        winner: 0
    });

    //dispara uma unica vez quando a pagina for aberta e verifica se esta logado
    useEffect(() => {
        if (!(localStorage.getItem("wallet")))
            return push("/");

        setMessage("Carregando...");

        getDispute()
            .then(dispute => {
                setDispute(dispute);
                setMessage("");
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
            })
    }, [aux])


    function votarClick(candidate) {
        setMessage("Conectando na carteira...");
        votar(candidate)
            .then(() => {
                alert("Seu voto foi computado com sucesso. Pode demorar até 1 minuto para que apareça no sistema");
                setMessage("");
                setAux(!aux); //para poder atualizar a contagem dos votos de forma automatica sem precisar de refresh
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
            })
    }

    return (
        <>
            <Head>
                <title>Eleições COB | Votar</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="container px-4 py-5">
                <div className="row align-items-center">
                    <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Eleições COB</h1>
                    <p className="lead">Eleições on-chain para presidente do COB.</p>

                    {
                        dispute.vencedor == 0
                            ? <p className="lead">Você tem até o dia da eleição para deixar seu voto em um dos candidatos abaixo.</p>
                            : <p className="lead">Votação encerrada. Veja o vencedor abaixo e o totla de votos </p>
                    }
                </div>
     
                <div className="row flex-lg-row-reverse align-items-center g-1 py-5">
                    <div className="col"></div>
                    {
                        dispute.vencedor == 0 || dispute.vencedor == 1
                            ? <div className="col">
                                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                                    {dispute.candidato1}
                                </h3>
                                <img src={dispute.image1} className="d-block mx-auto img-fluid rounded" width={250} />
                                {
                                    dispute.vencedor == 1
                                    ? <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}>Vencedor</button>
                                    : <button onClick={() => votarClick(1)} className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}>VOTAR</button>
                                }
                                
                                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}> { Web3.utils.toNumber(dispute.total1)} Votos </span>
                            </div>
                            : <></>
                    }

                    {
                        dispute.vencedor == 0 || dispute.vencedor == 2
                            ? <div className="col">
                                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                                    {dispute.candidato2}
                                </h3>
                                <img src={dispute.image2} className="d-block mx-auto img-fluid rounded" width={250} />

                                {
                                    dispute.winner == 2
                                    ? <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}>Vencedor</button>
                                    : <button onClick={() => votarClick(2)} className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}>VOTAR </button>
                                }

                                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}> { Web3.utils.toNumber(dispute.total2)} Votos </span>
                            </div>
                            :<></>
                    }
                </div>
                <div className="row align-items-center">
                    <p className="message">{message}</p>
                </div>

                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <p className="col-4 mb-0 text-body-secondary">
                        &copy; 2024 - Comitê Olímpico do Brasil
                    </p>
                    <ul className="nav col-4 justify-content-end">
                        <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">Home</a></li>
                        <li className="nav-item"><a href="/about" className="nav-link px-2 text-body-secondary">About</a></li>
                    </ul>
                </footer>
            </div>
        </>
    );
}
