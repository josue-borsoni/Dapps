// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.26;

//aposta
struct Aposta {
    uint256 valorAposta;
    uint256 candidato;
    uint256 timestamp; //quando a aposta foi realizada
    uint256 valorResgatado; //indoica quanto a pessoa ja retirou do premio que elea tem direito, caso  ganhado a aposta
}

//Disputa disponivel para apostas
struct Disputa {
    string candidato1;
    string candidato2;
    string imagem1;
    string imagem2;
    uint256 total1;
    uint256 total2;
    uint256 vencedor;
}

contract PlataformaApostas {

    Disputa public dispute;
    mapping (address => Aposta) public todasApostas; //tipo de dado baseado em chave/valor

    address owner;
    uint256 fee = 1000; //escala de 4 zeros, taxa de comissão da casa de aposta, uint é apenas para numeros positivos
    uint public netPrize;

    constructor() {
        owner = msg.sender;

        dispute = Disputa({
            candidato1: "Donald Trump",
            candidato2: "Kamala Harrirs",
            imagem1: "http://bit.ly/3zmSfiA",
            imagem2: "http://bit.ly/4gF4mYO",
            total1: 0,
            total2: 0,
            vencedor: 0
        });
    }

    //external é para ser chamada de fora do contrato, pelo font-end por exemplo
    //payable é porque receb dinheiro junto
    function Apostar(uint256 candidato) external payable {
        require(candidato == 1 || candidato == 2, "Candidato invalido");
        require(msg.value > 0, "Valor de aposta invalido");
        require(dispute.vencedor == 0, "Aposta Encerrada");

        Aposta memory novaAposta;
        novaAposta.valorAposta = msg.value;
        novaAposta.candidato = candidato;
        novaAposta.timestamp = block.timestamp;

        todasApostas[msg.sender] = novaAposta;

        if (candidato == 1)
            dispute.total1 += msg.value;
        else 
            dispute.total2 += msg.value;
    } 

    function Finalizar(uint winner) external{
        require (msg.sender == owner, "Voce nao pode finalizar esta aposta");
        require (winner==1 || winner==2, "Voce nao pode finalizar esta aposta");
        require (dispute.vencedor == 0, "Disputa encerrada");

        dispute.vencedor = winner;

        uint grossPrize = dispute.total1 + dispute.total2; //premio bruto
        uint commission = (grossPrize * fee) /1e4;  //comissao da casa de apostas
        netPrize = grossPrize - commission;

        //transferindo os fundos do contrato para a carteira desejada, neste caso, seria o dono da casa de apostas
        payable(owner).transfer(commission);       
    }


    //utilizada para os apostadores ganhadores sacarem seu premio
    function  ResgatarPremio() external{
        Aposta memory userBet = todasApostas[msg.sender];
        //require (dispute.vencedor > 0 && dispute.vencedor == userBet.candidato && userBet.valorResgatado==0, "Voce nao pode sacar seu premio");
        require (dispute.vencedor > 0 && dispute.vencedor == userBet.candidato , "Voce nao pode sacar seu premio");
        
        uint winnerAmount = dispute.vencedor == 1 ? dispute.total1 : dispute.total2;
        uint ratio = (userBet.valorAposta * 1e4) / winnerAmount;
        uint individualPrize = netPrize * ratio / 1e4;

        todasApostas[msg.sender].valorResgatado = individualPrize;
        payable(msg.sender).transfer(individualPrize);       
    }

    //utilizada para os apostadores ganhadores sacarem seu premio
    function  ReabrirAposta() external{
        require (msg.sender == owner, "Voce nao pode reabrir esta aposta");
        dispute.vencedor = 0;
    }

}
