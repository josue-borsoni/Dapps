import Web3 from "web3";
import ABI from "./abi.json";

const CONTRACT_ADDRESS = "0x8E8D6260b2c310eceE4a6b2ee121A764307f8272";
                         

export async function doLogin() {
    if (!window.ethereum) throw new Error("Sem MetaMask instalada!");

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts(); //obtém as contas conectadas na carteira
    if (!accounts || !accounts.length) throw new Error("Carteira não permitida!");

    localStorage.setItem("wallet", accounts[0].toLowerCase());
    return accounts[0];
}

function getContract() {
    if (!window.ethereum) throw new Error("Sem MetaMask instalada!");

    const from = localStorage.getItem("wallet");
    const web3 = new Web3(window.ethereum);

    console.log(new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from }));

    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function getOpenRequests(lastId = 0) {
    const contract = getContract();
    const requests = await contract.methods.ObterPedidosAbertos(lastId + 1, 10).call();
    return requests.filter(rq => rq.titulo !== ""); //para limpar as requests vazias porque retornamos sempre 10 dentro do array
}

export async function openRequest({ titulo, descricao,contato, metaDesejada }) {
    const contract = getContract();
    return contract.methods.CriarNovoPedido(titulo, descricao, contato, Web3.utils.toWei(metaDesejada, "ether")).send();
}

export async function closeRequest(id) {
    const contract = getContract();
    return contract.methods.EncerrarPedido(id).send();
}

export async function donate(id, donationInBnb) {
    const contract = getContract();
    return contract.methods.Doar(id).send({
        value: Web3.utils.toWei(donationInBnb, "ether")
    });
}