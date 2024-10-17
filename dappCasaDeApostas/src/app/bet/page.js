"use client"

import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDispute } from "@/services/Web3Services";
import { placeBet } from "@/services/Web3Services";
import { claimPrize } from "@/services/Web3Services";
import { Finalizar } from "@/services/Web3Services";
import { ReabrirAposta } from "@/services/Web3Services";

import Web3 from "web3";
import Rodape from "@/componentes/rodape";

export default function Bet() {

    const { push } = useRouter();

    const [message, setMessage] = useState();
    const [dispute, setDispute] = useState({
        candidato1: "Loading...",
        candidato2: "Loading...",
        imagem1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHWFM1IG7wiMV5ef2xI-Yyxq2KCeWsjovfn5G42EwcKG15qAKzkCA2GH_V8xI3MrM0ADI&usqp=CAU",
        imagem2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHWFM1IG7wiMV5ef2xI-Yyxq2KCeWsjovfn5G42EwcKG15qAKzkCA2GH_V8xI3MrM0ADI&usqp=CAU",
        total1: 0,
        total2: 0,
        vencedor: 0
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
    }, [])


    function processBet(candidate) {
        setMessage("Conectando na carteira...");
        const ammount = prompt("Quantia em POL para apostar:", "1")
        placeBet(candidate, ammount)
            .then(() => {
                alert("Aposta recebida com sucesso. Pode demorar até 1 minuto para que apareça no sistema");
                setMessage("");
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
            })
    }

    function btnClaimClick() {

        setMessage("Conectando na carteira...");

        claimPrize()
            .then(() => {
                alert("Preêmio coletado com sucesso. Pode demorar até 1 minuto para que apareça na sua carteira");
                setMessage("");
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
            })
    }

    function btnFinalizarClick() {
        setMessage("Conectando na carteira...");
        const candidate = prompt("Quem foi o vencedor da aposta:", "0")
        //document.getElementById("").value
        Finalizar(candidate)
            .then(() => {
                alert("Aposta finalizada com sucesso.");
                setMessage("");
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
            })
    }


    function btnReabrirClick() {
        setMessage("Conectando na carteira...");
        ReabrirAposta()
            .then(() => {
                alert("Aposta reaberta  com sucesso.");
                setMessage("");
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
            })
    }

    return (
        <>
            <Head>
                <title>BetCandidate | Apostar</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="container px-4 py-5">
                <div className="row align-items-center">
                    <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Plataforma de Apostas</h1>
                    <p>
                        Block Explorer: <a target="_blank" href="https://amoy.polygonscan.com/">https://amoy.polygonscan.com/</a><br />
                        Endereço do smart contract na blockchain de teste (testnet) da Polygon <b>0x330A1459a38cA1e5d7e00193a6AE115e1fe0A451</b>

                    </p>
                    <p className="lead">Apostas on-chain nas eleições americanas.</p>

                    {
                        dispute.vencedor == 0
                            ? <p className="lead">Você tem até o dia da eleição para deixar sua aposta em um dos candidatos abaixo.</p>
                            : <p className="lead">Votação encerrada. Veja o vencedor abaixo e solicite seu prêmio </p>
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
                                <img src={dispute.imagem1} className="d-block mx-auto img-fluid rounded" width={250} />
                                {
                                    dispute.vencedor == 1
                                        ? <button onClick={btnClaimClick} className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}>Pegar meu prêmio</button>
                                        : <button onClick={() => processBet(1)} className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}>Aposte neste candidato</button>
                                }

                                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}> {Web3.utils.fromWei(dispute.total1, "ether")} SOL Apostados</span>
                            </div>
                            : <></>
                    }

                    {
                        dispute.vencedor == 0 || dispute.vencedor == 2
                            ? <div className="col">
                                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                                    {dispute.candidato2}
                                </h3>
                                <img src={dispute.imagem2} className="d-block mx-auto img-fluid rounded" width={250} />

                                {
                                    dispute.vencedor == 2
                                        ? <button onClick={btnClaimClick} className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}>Pegar meu prêmio</button>
                                        : <button onClick={() => processBet(2)} className="btn btn-primary p-3 my-2 d-block mx-auto" style={{ width: 250 }}>Aposte neste candidato</button>
                                }

                                <span className="badge text-bg-secondary d-block mx-auto" style={{ width: 250 }}>{Web3.utils.fromWei(dispute.total2, "ether")} SOL Apostados</span>
                            </div>
                            : <></>
                    }
                </div>
                <div className="row align-items-center">
                    <p className="message">{message}</p>
                </div>

                {
                    dispute.vencedor == 0
                        ? <div className="row align-items-center">
                            <div class="col-md-2">
                                <button onClick={btnFinalizarClick} className="btn btn-primary" >Finalizar</button>
                            </div>
                        </div>
                        :
                        <div class="col-md-2">
                            <button onClick={btnReabrirClick} className="btn btn-primary" >Reabrir Aposta</button>
                        </div>
                }
                <Rodape />

            </div>
        </>
    );
}
