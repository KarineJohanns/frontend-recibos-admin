// src/components/MessageModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MessageModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, message, onClose }) => {
  const navigate = useNavigate(); // Hook para navegação

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();  // Chama a função de fechamento fornecida por props
    navigate('/parcelas');  // Redireciona para a página de listagem de parcelas
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
