// src/components/MessageModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MessageModalProps {
  isOpen: boolean; // Indica se o modal está aberto
  message: string; // Mensagem a ser exibida no modal
  onClose: () => void; // Função para fechar o modal
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, message, onClose }) => {
  const navigate = useNavigate(); // Hook para navegação entre páginas

  // Se o modal não estiver aberto, retorna null para não renderizar nada
  if (!isOpen) return null;

  // Função para fechar o modal e redirecionar para a página de parcelas
  const handleClose = () => {
    onClose();  // Chama a função de fechamento fornecida por props
    navigate('/');  // Redireciona para a página de listagem de parcelas
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Mensagem</h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
