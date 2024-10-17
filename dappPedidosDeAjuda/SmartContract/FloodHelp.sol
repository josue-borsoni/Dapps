// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.24;

struct Pedido{
  uint id;
  address autorPedido;
  string titulo;
  string descricao;
  string contato;
  uint metaDesejada; //goal em wei a menor fração do padrão ethereum
  uint saldoAtual; //balance
  bool aberto; //open
  uint timestamp;
}

contract PedidoDoacao {

  uint public ultimoId = 0;
  mapping(uint => Pedido) public listaPedidos;   //estrutura de dados baseado em chave e valor

  //as funções sao quem leem e escrevem na blockchain
  function CriarNovoPedido(string memory p_titulo, string memory p_descricao, string memory p_contato, uint p_meta) public{

      ultimoId++;

      listaPedidos[ultimoId] = Pedido({id: ultimoId,
                                       titulo: p_titulo,
                                       descricao: p_descricao,
                                       contato: p_contato,
                                       metaDesejada: p_meta,
                                       saldoAtual: 0,
                                       aberto: true,
                                       timestamp: block.timestamp,
                                       autorPedido: msg.sender //retorna o endereço de carteira cripto de quem chamou o método
                                     });
  }

  function EncerrarPedido(uint p_id_pedido) public {
    address autor   = listaPedidos[p_id_pedido].autorPedido; //obter o endereço de quem é o dono da informação
    uint saldoAtual = listaPedidos[p_id_pedido].saldoAtual;
    uint meta       = listaPedidos[p_id_pedido].metaDesejada;
    bool aberto     = listaPedidos[p_id_pedido].aberto;

    require(aberto && (msg.sender == autor || saldoAtual >= meta), unicode"Você não pode fechar este pedido");

    uint saldo = listaPedidos[p_id_pedido].saldoAtual; 
    listaPedidos[p_id_pedido].aberto = false;

    if (saldo > 0){
      listaPedidos[p_id_pedido].saldoAtual = 0;
      payable(autor).transfer(saldo); //faz a transferencia de forma nativa
    }
  }

  function Doar(uint p_IdPedido) public payable {

      listaPedidos[p_IdPedido].saldoAtual += msg.value;
      if(listaPedidos[p_IdPedido].saldoAtual >= listaPedidos[p_IdPedido].metaDesejada)
        EncerrarPedido(p_IdPedido);
  }


  function ObterPedidosAbertos(uint starId, uint quantidadeExibir) public view returns (Pedido[] memory) {
    
    Pedido[] memory pedidosAbertos = new Pedido[](quantidadeExibir);
    uint idPedido = starId;
    uint cont = 0;

    do{
        if (listaPedidos[idPedido].aberto){
          pedidosAbertos[cont] = listaPedidos[idPedido];
          cont++;
        }

        idPedido++;
    }
    while(cont < quantidadeExibir && idPedido <= ultimoId);

    return pedidosAbertos;

  }

  //function Adicionar() public payable {
  //  payable (msg.sender).transfer(msg.value);
  //}

}
