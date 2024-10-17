"use client"

import Head from "next/head";
import { useRouter } from "next/navigation";
import  {useState} from "react";
import { doLogin } from "@/services/Web3Services";

export default function Home() {

  const { push } = useRouter();

  const [message, setMessage] = useState();
  
  function btnLoginClick() {
    //push("/bet");
    setMessage("Conectando na carteira, aguarde ...");

    doLogin()
    .then(account => {
      console.log(account);
      push("/votar");
    })
    .catch(err => {
      console.error(err);
      setMessage(err.message)
    })
  }


  return (
    <>
      <Head>
        <title>Eleições COB | Login</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-6">
            <img src="https://admin.cob.org.br/uploads/Eleicoes_4272_18598988f6.jpg" className="d-block mx-lg-auto img-fluid" width="700" height="500" />
          </div>
          <div className="col-6">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Eleições COB</h1>
            <p>
                    Block Explorer: <a target="_blank" href="https://amoy.polygonscan.com/">https://amoy.polygonscan.com/</a><br/>
                    Endereço do smart contract na blockchain de teste (testnet) da Polygon <b>0x60547CEB0bE2a0082a7f7F4c98a59538b667d5D5</b>
            </p>

            <p className="lead">Eleições on-chain para presidente do COB.</p>
            <p className="lead">Autentique-se com sua carteira e deixe seu voto para presidente do COB no próximo ciclo olímpico.</p>
            <div className="d-flex justify-content-start">
              <button type="button" className="btn btn-primary btn-lg px-4" onClick={btnLoginClick}>
                <img src="/metamask.svg" width={64} className="me-3" />
                Conectar MetaMask
              </button>
            </div>
            <p className="message">{message}</p>
          </div>
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
