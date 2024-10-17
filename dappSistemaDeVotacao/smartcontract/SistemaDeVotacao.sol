// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.26;


struct Voto {
    uint256 candidato;
    uint256 timestamp; //quando a aposta foi realizada
}

//Eleição disponível para votação
struct Eleicao {
    string candidato1;
    string candidato2;
    string imagem1;
    string imagem2;
    uint256 total1;
    uint256 total2;
    uint256 vencedor;
}

contract PlataformaDeVotacao {

    Eleicao public eleicao;
    mapping (address => Voto) public todosVotos; //tipo de dado baseado em chave/valor

    address owner;

    constructor() {
        owner = msg.sender;

        eleicao = Eleicao({
            candidato1: "Paulo Vanderley",
            candidato2: "La Porta",
            imagem1: "https://www.cob.org.br/_next/image?url=https%3A%2F%2Fadmin.cob.org.br%2Fuploads%2FRetratos_COB_2024_9072_b1490d2e54.webp&w=1200&q=75",
            imagem2: "s2-oglobo.glbimg.com/9yM-edqDxdIF1ijWvJMP012W2xA=/0x0:399x599/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2024/6/C/vsfz60TrSBMYNuYPXWpA/eleicoes-4280-399x600-cbbb3b1.jpg",
            total1: 0,
            total2: 0,
            vencedor: 0
        });
    }

    //external é para ser chamada de fora do contrato, pelo font-end por exemplo
    //payable é porque receb dinheiro junto
    function Votar(uint256 candidato) external payable {
        require(candidato == 1 || candidato == 2, "Candidato invalido");
        require(eleicao.vencedor == 0, "Eleicao  Encerrada");

        Voto memory novoVoto;
        novoVoto.candidato = candidato;
        novoVoto.timestamp = block.timestamp;

        todosVotos[msg.sender] = novoVoto;

        if (candidato == 1)
            eleicao.total1 ++;
        else 
            eleicao.total2 ++;
    } 


}
