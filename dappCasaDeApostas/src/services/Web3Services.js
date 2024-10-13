import Web3 from "web3"
import ABI from "./abi.json"

const CONTRACT_ADDRESS = "0x7b97DCa87EA38614D8282c21B36a395116f52d6c"

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

    return contract.methods.bet(candidate).send({
        value: Web3.utils.toWei(amountInEth, "ether")

        //gas: 64552 ,  //estas 2 configurações sap necessárias porque a meta meask nao consegue clacular as taxas corretamente e da internal rpc error
        //gasPrice: "28227000015"
    });
}


export async function finishDispute(winner){
    const contract = getContract();
    return contract.methods.finish(winner).send();
}


export async function claimPrize(){
    const contract = getContract();
    return contract.methods.claim().send();
}
