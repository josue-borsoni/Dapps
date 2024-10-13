import { closeRequest, donate } from "../services/Web3Services";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import Web3 from "web3";

export default function Request({ data }) {

    function btnCloseClick() {
        if (!confirm("Tem certeza que deseja fechar este pedido?")) return;

        closeRequest(data.id)
            .then(result => {
                alert("Pedido fechado com sucesso. Em alguns minutos deixará de ser visto no site.");
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
                alert(err.message);
            })
    }

    function btnHelpClick() {
        const donationInBnb = prompt("O quanto deseja doar (em BNB)?", 0);
        donate(data.id, donationInBnb)
            .then(result => {
                alert("Doação efetuada com sucesso. Em alguns minutos será processada.");
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
                alert(err.message);
            })
    }

    return (
        <>
            <div className="list-group-item list-group-item-action d-flex gap-3 py-3">
                <img src={generateAvatarURL(data.autorPedido)} width="32" height="32" className="rounded-circle" />
                <div className="d-flex gap-2 w-100 justify-content-between">
                    <div className="w-100">
                        <div className="row">
                            <div className="col-10">
                                <h6 className="mb-0">{data.titulo} &rsaquo;&rsaquo; Contato: {data.contato}</h6>
                            </div>
                            <div className="col-2">
                                <div className="text-end">
                                    {
                                        localStorage.getItem("wallet") === data.autorPedido.toLowerCase()
                                            ? <button type="button" className="btn btn-danger btn-sm" onClick={btnCloseClick}>Fechar</button>
                                            : <></>
                                    }
                                    &nbsp;
                                    <button type="button" className="btn btn-success btn-sm" onClick={btnHelpClick}>&#36; Ajudar</button>
                                </div>
                            </div>
                        </div>
                        <p className="opacity-75 pe-5 mb-0 me-5">{data.descricao}</p>
                        <div className="row">
                            <div className="col">
                                <span className="me-1 opacity-75">Meta:</span>
                                <span className="opacity-50">
                                    {
                                        data.saldoAtual
                                            ? `${Web3.utils.fromWei(data.metaDesejada, "ether")} BNB. Já foram doados ${Web3.utils.fromWei(data.saldoAtual, "ether")} BNB`
                                            : `BNB ${Web3.utils.fromWei(data.metaDesejada, "ether")}`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}