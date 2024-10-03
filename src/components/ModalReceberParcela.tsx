import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirecionar
import { patchPagarParcelas, patchEscolha } from "../api"; // Funções para fazer PATCH na parcela
import { formatarValor, formatarDataISO } from "../utils"; // Funções de utilidades
import ModalEscolha from "./ModalEscolha"; // Componente ModalEscolha
import MessageModal from "./MessageModal"; // Componente MessageModal
import ModalGerarNovasParcelas from "./ModalGerarNovasParcelas"; // Novo componente

const ModalReceberParcela = ({
  isOpen,
  onClose,
  parcela,
}: {
  isOpen: boolean;
  onClose: () => void;
  parcela: any;
}) => {
  const navigate = useNavigate(); // Hook para redirecionamento
  const [valorRecebido, setValorRecebido] = useState(parcela.valorParcela);
  const [dataRecebimento, setDataRecebimento] = useState(formatarDataISO(new Date()));
  const [mensagemErro, setMensagemErro] = useState("");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [isEscolhaModalOpen, setIsEscolhaModalOpen] = useState(false);
  const [isGerarNovasParcelasOpen, setIsGerarNovasParcelasOpen] = useState(false);
  const [mensagemEscolhaModal, setMensagemEscolhaModal] = useState("");

  const handleReceber = async () => {
    const dadosParaEnviar = { valorPago: valorRecebido, dataPagamento: dataRecebimento };

    console.log("Dados enviados ao backend:", dadosParaEnviar);
    
    try {
      const resposta = await patchPagarParcelas(parcela.parcelaId, dadosParaEnviar);
      console.log("Resposta do backend:", resposta);

      // Se a escolha é necessária
      if (resposta.escolhaNecessaria) {
        setMensagemEscolhaModal(resposta.mensagem);
        setIsEscolhaModalOpen(true); // Abre o ModalEscolha com a mensagem do backend
      } else if (resposta.mensagem) {
        setMensagemModal(resposta.mensagem);
        setIsMessageModalOpen(true); // Abre o MessageModal com a mensagem do backend
      }

    } catch (err) {
      console.error("Erro durante a requisição:", err);
      setMensagemErro("Erro ao processar o pagamento.");
    }
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    navigate("/parcelas"); // Redireciona para /parcelas ao fechar o MessageModal
  };

  const handleCloseEscolhaModal = () => {
    setIsEscolhaModalOpen(false);
  };

  const handleAplicarDesconto = async () => {
    const dadosParaEnviar = { gerarNovasParcelas: false }; // Crie um objeto com os dados a serem enviados
    console.log("Dados enviados ao backend:", dadosParaEnviar); // Log dos dados que serão enviados
  
    try {
      await patchEscolha(parcela.parcelaId, dadosParaEnviar); // Chama a função para aplicar desconto
      handleCloseEscolhaModal(); // Fecha o ModalEscolha
      setMensagemModal("Desconto aplicado com sucesso!"); // Mensagem de sucesso
      setIsMessageModalOpen(true); // Abre o MessageModal para informar ao usuário
    } catch (error) {
      console.error("Erro ao aplicar desconto:", error);
      setMensagemErro("Erro ao aplicar desconto.");
    }
  };

  const handleGerarNovasParcelas = async (dados) => {
    try {
      console.log("Enviando dados para gerar novas parcelas:", dados);
      const resposta = await patchEscolha(parcela.parcelaId, dados); // Chame a função patchEscolha ou o endpoint correspondente
      // Verifique a resposta do backend
    if (resposta.mensagem) {
      setMensagemModal(resposta.mensagem); // Define a mensagem recebida
      setIsMessageModalOpen(true); // Abre o modal com a mensagem
    }
    
    // Fecha o modal de gerar novas parcelas
    setIsGerarNovasParcelasOpen(false);
    
  } catch (error) {
    console.error("Erro ao gerar novas parcelas:", error);
    setMensagemModal("Erro ao gerar novas parcelas."); // Mensagem de erro
    setIsMessageModalOpen(true); // Abre o modal com a mensagem de erro
  }
};

  const handleOpenEscolha = () => {
    setIsEscolhaModalOpen(true); // Abre o ModalEscolha
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal principal de recebimento */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-bold mb-4">Receber Parcela</h2>
          <p><strong>Documento:</strong> {parcela.documento}</p>
          <p><strong>Valor da Parcela:</strong> {formatarValor(parcela.valorParcela)}</p>
          <div className="mt-4">
            <label className="block font-bold">Valor a Receber:</label>
            <input
              type="text"
              value={formatarValor(valorRecebido)}
              onChange={(e) => setValorRecebido(Number(e.target.value.replace(/\D/g, "")))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block font-bold">Data de Recebimento:</label>
            <input
              type="date"
              value={dataRecebimento}
              onChange={(e) => setDataRecebimento(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {mensagemErro && <p className="text-red-500">{mensagemErro}</p>}
          <div className="flex justify-end mt-4">
            <button className="bg-gray-500 text-white py-2 px-4 rounded mr-2" onClick={onClose}>Cancelar</button>
            <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleReceber}>Confirmar Pagamento</button>
          </div>
        </div>
      </div>

      {/* MessageModal para mostrar a mensagem do backend */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={handleCloseMessageModal}
        message={mensagemModal}
      />

      {/* ModalEscolha para opções de desconto */}
      <ModalEscolha
        isOpen={isEscolhaModalOpen}
        onClose={handleCloseEscolhaModal}
        mensagem={mensagemEscolhaModal}
        onAplicarDesconto={handleAplicarDesconto} // Integrar a lógica de aplicar desconto aqui
        onGerarNovasParcelas={() => {
          handleCloseEscolhaModal(); // Fecha o ModalEscolha
          setIsGerarNovasParcelasOpen(true); // Abre o modal de novas parcelas
        }} // Abre o modal de novas parcelas
        parcelaId={parcela.parcelaId}
      />

      {/* Modal para Gerar Novas Parcelas */}
      <ModalGerarNovasParcelas
        isOpen={isGerarNovasParcelasOpen}
        onClose={() => setIsGerarNovasParcelasOpen(false)}
        onOpenEscolha={handleOpenEscolha} 
        parcela={parcela} // Passa a parcela atual para o modal
        onGerarNovasParcelas={handleGerarNovasParcelas} // Função callback para gerar novas parcelas
      />
    </>
  );
};

export default ModalReceberParcela;
