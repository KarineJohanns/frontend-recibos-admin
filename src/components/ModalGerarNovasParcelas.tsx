import React, { useState } from 'react';
import { formatarDataISO } from '../utils';
import MessageModal from './MessageModal';


interface ModalGerarNovasParcelasProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEscolha: () => void; 
  parcela: any; // Receber a parcela atual como prop
  onGerarNovasParcelas: (dados: any) => void; // Função callback para gerar novas parcelas
}

const ModalGerarNovasParcelas: React.FC<ModalGerarNovasParcelasProps> = ({
  isOpen,
  onClose,
  onOpenEscolha,
  parcela,
  onGerarNovasParcelas,
}) => {
  const [numeroParcelas, setNumeroParcelas] = useState(1); // Valor padrão
  const [novoIntervalo, setNovoIntervalo] = useState("MENSAL"); // Valor padrão
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState(formatarDataISO(new Date())); // Armazenar a data

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const dados = {
      gerarNovasParcelas: true,
      numeroParcelasRenegociacao: numeroParcelas,
      novoIntervalo,
      dataPrimeiraParcela,
    };

    console.log("Dados enviados para gerar novas parcelas no pagamento: ", dados)

    try {
        const mensagem = await onGerarNovasParcelas(dados); // Espera a mensagem de retorno
        setMensagemModal(mensagem); // Define a mensagem recebida do backend
        setIsMessageModalOpen(true); // Abre o MessageModal
        onClose(); // Fecha o modal após o envio
      } catch (error) {
        console.error("Erro ao gerar novas parcelas:", error);
        setMensagemModal("Erro ao gerar novas parcelas."); // Mensagem de erro
        setIsMessageModalOpen(true); // Abre o MessageModal com a mensagem de erro
      }
    };
  

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-[90%] md:max-w-[60%] h-auto">
          <h2 className="text-lg font-bold mb-4">Gerar Novas Parcelas</h2>
          <p><strong>Documento:</strong> {parcela.documento}</p>
          <p><strong>Valor da Parcela:</strong> {parcela.valorParcela}</p>
          
          <div className="mt-4">
            <label className="block font-bold">Número de Parcelas:</label>
            <input
              type="number"
              value={numeroParcelas}
              onChange={(e) => setNumeroParcelas(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min={1} // Definindo o valor mínimo
            />
          </div>
          <div className="mt-4">
            <label className="block font-bold">Novo Intervalo:</label>
            <select
              value={novoIntervalo}
              onChange={(e) => setNovoIntervalo(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="MENSAL">Mensal</option>
              <option value="SEMANAL">Semanal</option>
              <option value="ANUAL">Anual</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="block font-bold">Data da Primeira Parcela:</label>
            <input
              type="date"
              value={dataPrimeiraParcela}
              onChange={(e) => setDataPrimeiraParcela(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button className="bg-gray-500 text-white py-2 px-4 rounded mr-2" onClick={() => {
                onClose(); // Fecha o modal atual
                onOpenEscolha(); // Abre o ModalEscolha
              }}>Cancelar</button>
            <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleSubmit}>Gerar Parcelas</button>
          </div>
        </div>
      </div>

      {/* MessageModal para mostrar a mensagem do backend */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)} // Função para fechar o MessageModal
        message={mensagemModal} // Mensagem a ser exibida
      />
    </>
  );
};

export default ModalGerarNovasParcelas;
