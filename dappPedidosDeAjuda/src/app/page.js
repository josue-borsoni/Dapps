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
            Block Explorer: <a target="_blank" href="https://amoy.polygonscan.com/">https://amoy.polygonscan.com/</a><br/>
            Endereço do smart contract na blockchain de teste (testnet) da Polygon <b>0x8E8D6260b2c310eceE4a6b2ee121A764307f8272</b>
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
