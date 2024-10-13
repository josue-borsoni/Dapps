"use client"

import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getOpenRequests } from "../services/Web3Services"
import Request from "@/components/Request";

export default function Home() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests(0);
  }, [])

  async function loadRequests(lastId) {
    try {
      const result = await getOpenRequests(lastId);

      if (lastId === 0) //significa que é a primeira vez que entra na tela
        setRequests(result);
      else {
        requests.push(...result);
        setRequests(requests);
      }
    }
    catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (

    <>
      <Header />

      <div className="container">
        <div className="row ps-5">
          <p className="lead m-4">
            <b>Ajude as vítimas de enchentes e demais desastres naturais do Brasil.</b><br/>
            Block Explorer: <a target="_blank" href="https://testnet.bscscan.com/">https://testnet.bscscan.com</a><br/>
            Endereço do smart contract na blockchain de teste (testnet) da Binance <b>0x34e669E480Aded8301419Aba145f769c9b5164b3</b>
          </p>
        </div>

        <div className="p-4 mx-5">
          <div className="list-group">

            {
              requests && requests.length
                ? requests.map(rq => <Request key={rq.id} data={rq} />)
                : <>Conect sua carteira MetaMask no botão "Entrar" para ajudar ou pedir ajuda.</>
            }

          </div>
        </div>

        <Footer />

      </div>


    </>

  );
}
