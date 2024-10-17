import Web3 from "web3"
import ABI from "./abi.json"

const CONTRACT_ADDRESS = "0x60547CEB0bE2a0082a7f7F4c98a59538b667d5D5"

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
    
    return contract.methods.eleicao().call({});
}


export async function votar(candidate){
    const contract = getContract();
    return contract.methods.Votar(candidate).send();
}



