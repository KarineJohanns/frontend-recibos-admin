// src/components/Loading.tsx

import React from 'react';
import carregando from '../assets/carregando.gif'; // GIF de carregamento
import noData from '../assets/noData.gif'; // Imagem para "sem dados"

interface LoadingProps {
  loading: boolean;
  error?: string;
}

const Loading: React.FC<LoadingProps> = ({ loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src={carregando}
          alt="Carregando..."
          className="max-w-full max-h-64 w-auto h-auto"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <img
          src={noData} // Exibindo o GIF de "sem dados"
          alt="Erro ao carregar"
          className="max-w-full max-h-64 w-auto h-auto mb-4"
        />
        <p className="text-red-500">Erro ao carregar, faça login novamente.</p>
      </div>
    );
  }

  return null; // Retorna null se não estiver carregando e não houver erro
};

export default Loading;
