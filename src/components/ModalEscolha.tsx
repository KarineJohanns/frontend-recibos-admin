import React from 'react';
import { patchEstornar } from '../api'; // Importar a função patchEstornar

interface ModalEscolhaProps {
  isOpen: boolean; // Indica se o modal está aberto
  onClose: () => void; // Função para fechar o modal
  mensagem: string; // Mensagem a ser exibida no modal
  onAplicarDesconto: () => void; // Função para aplicar desconto
  parcelaId: string; // ID da parcela a ser estornada
  onGerarNovasParcelas: () => void; // Função para abrir o modal de novas parcelas
}

const ModalEscolha: React.FC<ModalEscolhaProps> = ({
  isOpen,
  onClose,
  mensagem,
  onAplicarDesconto,
  parcelaId,
  onGerarNovasParcelas, // Função para abrir novo modal de gerar parcelas
}) => {
  // Retorna null se o modal não estiver aberto
  if (!isOpen) return null;

  // Função para estornar a parcela
  const handleCloseWithEstorno = async () => {
    try {
      await patchEstornar(parcelaId); // Chama a API para estornar a parcela
      onClose(); // Fecha o modal após estornar
    } catch (error) {
      console.error("Erro ao estornar a parcela:", error); // Log de erro em caso de falha
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative bg-white rounded-lg shadow">
          {/* Botão de fechar o modal */}
          <button 
            type="button" 
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" 
            onClick={handleCloseWithEstorno}
          >
            {/* Ícone de fechar */}
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900">Escolha uma Opção</h3>
            <p className="mb-4 text-sm text-gray-500">{mensagem}</p>

            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
                onClick={onAplicarDesconto} // Chama a função para aplicar desconto
              >
                Aplicar Desconto
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:ring-4 focus:ring-green-300"
                onClick={onGerarNovasParcelas} // Chama a função para abrir o modal de gerar novas parcelas
              >
                Gerar Novas Parcelas
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalEscolha;
