import Web3 from "web3"
import ABI from "./abi.json"

const CONTRACT_ADDRESS = "0x330A1459a38cA1e5d7e00193a6AE115e1fe0A451"

export async function doLogin (){
    
    //Verificar se o navegador do usuario possui uma MetaMask instalada
    //quando a meta mask esta no navegado ela injeta um objeteto chamado "ethereum" no navegador
    if (!window.ethereum) throw new Error(`MetaMask não está instalada!`);

    const web3 = new Web3(window.ethereum); // window.ethereum é onde está minha carteira
    const accounts = await web3.eth.requestAccounts(); //faz a conexão com a carteira, exibe a tela de login da metamask

    if (!accounts || !accounts.length) throw new Error(`MetaMask não foi autorizada!`);

    localStorage.setItem("wallet", accounts[0]);
    return accounts[0];
}


function getContract(){
    
    if (!window.ethereum) throw new Error(`MetaMask não está instalada!`);
    
    const from = localStorage.getItem("wallet");
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {from});
}


export async function getDispute(){
    const contract = getContract();
    
    return contract.methods.dispute().call({});
}


export async function placeBet(candidate, amountInEth){
    const contract = getContract();

    return contract.methods.Apostar(candidate).send({
        value: Web3.utils.toWei(amountInEth, "ether")
    });
}


export async function claimPrize(){
    const contract = getContract();
    return contract.methods.ResgatarPremio().send();
}


export async function Finalizar(candidato){
    const contract = getContract();
    return contract.methods.Finalizar(candidato).send();
}


export async function ReabrirAposta(){
    const contract = getContract();
    return contract.methods.ReabrirAposta().send();
}
