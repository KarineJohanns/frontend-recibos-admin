// src/ParcelaContext.tsx
import React, { createContext, useState, useContext } from "react";
import { getParcelasData } from "./api";

interface Parcela {
  parcelaId: number;
  cliente: Cliente;
  produto: Produto;
  numeroParcelas: number;
  valorParcela: number; // Valor da parcela em centavos
  paga: boolean; // true for paid, false for pending
  valorPago: number; // Valor já pago em centavos
  descontoAplicado: number; // Desconto aplicado
  numeroParcela: number; // Número da parcela atual
  intervalo: string; // Intervalo de pagamento (ex: "MENSAL")
  dataVencimento: string; // Data de vencimento (ajuste conforme o formato correto)
  documento: string; // Documento associado à parcela
}

interface Cliente {
  clienteId: number;
  clienteNome: string;
  clienteCpf: string;
  clienteEndereco: string;
  clienteTelefone: string;
}

interface Produto {
  produtoId: number;
  produtoNome: string;
  produtoValorTotal: number;
  produtoDescricao: string;
}

interface ParcelaContextData {
  parcelas: Parcela[];
  loading: boolean;
  error: string | null;
  fetchParcelas: () => Promise<void>;
  marcarAtualizacao: () => void;
}

const ParcelaContext = createContext<ParcelaContextData>(
  {} as ParcelaContextData
);

export const useParcelas = () => useContext(ParcelaContext);

// Atualize a definição do ParcelaProvider para aceitar children
export const ParcelaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [atualizar, setAtualizar] = useState<boolean>(true);

  const marcarAtualizacao = () => setAtualizar(true);

  const fetchParcelas = async () => {
    setLoading(true);
    try {
      if (atualizar) {
        const response = await getParcelasData();
        if (Array.isArray(response)) {
          setParcelas(response);
          setAtualizar(false);
        } else {
          console.error("Resposta do servidor não é um array:", response);
          setParcelas([]);
        }
      }
    } catch (error) {
      setError("Erro ao carregar as parcelas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParcelaContext.Provider
      value={{ parcelas, loading, error, fetchParcelas, marcarAtualizacao }}
    >
      {children}
    </ParcelaContext.Provider>
  );
};
