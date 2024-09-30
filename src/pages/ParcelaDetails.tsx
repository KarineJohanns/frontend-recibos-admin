// src/pages/ParcelaDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { getParcelasData, deleteParcela } from "../api"; // Certifique-se de que deleteParcela está importado
import MessageModal from "../components/MessageModal"; // Importando seu MessageModal

const ParcelaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtém o id da URL
  const [parcela, setParcela] = useState<any>(null); // Use 'any' ou crie um tipo específico se necessário
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [messageModalOpen, setMessageModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchParcela = async () => {
      try {
        const response = await getParcelasData(); // Obtenha todas as parcelas
        const parcela = response.find((p: any) => p.parcelaId === Number(id)); // Encontre a parcela pelo ID
        if (parcela) {
          setParcela(parcela);
        } else {
          setError("Parcela não encontrada");
        }
      } catch (err) {
        setError("Erro ao buscar a parcela");
      } finally {
        setLoading(false);
      }
    };

    fetchParcela();
  }, [id]);

  const handleDelete = async () => {
    try {
              const response = await deleteParcela(parcela.parcelaId); // Chama a função de exclusão

        // Verifica e exibe a mensagem retornada do backend
        if (response.dtos && response.dtos.mensagem) {
            setMessage(response.dtos.mensagem);
        } else {
            setMessage("Exclusão bem-sucedida, mas sem mensagem.");
        }
    } catch (err) {
        console.error("Erro ao excluir a parcela:", err); // Log detalhado do erro
        setMessage("Erro ao excluir a parcela: " + (err.response?.data?.message || err.message));
    } finally {
        setMessageModalOpen(true); // Abre o modal de mensagem
        setConfirmDelete(false); // Fecha a confirmação de exclusão
    }
};

  // Modal de Confirmação
  const ConfirmationModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-bold mb-4">Confirmar Exclusão</h2>
          <p>Você tem certeza que deseja excluir esta parcela?</p>
          <div className="flex justify-end mt-4">
            <button className="bg-gray-500 text-white py-2 px-4 rounded mr-2" onClick={onClose}>
              Cancelar
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={onConfirm}>
              Sim, excluir
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!parcela) return <p>Parcela não encontrada.</p>;

  // Formatadores de data e valores
  const formatarValor = (valor: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor / 100);
  };

  const getStatusText = (paga: boolean): string => {
    return paga ? "Paga" : "Pendente";
  };

  const formatarData = (data: string): string => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="ml-12 md:ml-0">
        {" "}
        <h1 className="text-2xl font-bold mb-4 text-right md:text-left">
          {parcela.documento}
        </h1>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Informações do Cliente</h2>
        <p>
          <span className="font-semibold">Nome:</span>{" "}
          {parcela.cliente.clienteNome}
        </p>
        <p>
          <span className="font-semibold">CPF:</span>{" "}
          {parcela.cliente.clienteCpf}
        </p>
        <p>
          <span className="font-semibold">Telefone:</span>{" "}
          {parcela.cliente.clienteTelefone}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Detalhes da Parcela</h2>
        <p>
          <span className="font-semibold">Número de Parcelas:</span>{" "}
          {parcela.numeroParcelas}
        </p>
        <p>
          <span className="font-semibold">Valor da Parcela:</span>{" "}
          {formatarValor(parcela.valorParcela)}
        </p>
        <p>
          <span className="font-semibold">Valor Pago:</span>{" "}
          {formatarValor(parcela.valorPago)}
        </p>
        <p>
          <span className="font-semibold">Desconto Aplicado:</span>{" "}
          {formatarValor(parcela.descontoAplicado)}
        </p>
        <p>
          <span className="font-semibold">Número da Parcela:</span>{" "}
          {parcela.numeroParcela}
        </p>
        <p>
          <span className="font-semibold">Intervalo:</span> {parcela.intervalo}
        </p>
        <p>
          <span className="font-semibold">Data de Vencimento:</span>{" "}
          {formatarData(parcela.dataVencimento)}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          {getStatusText(parcela.paga)}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Produto</h2>
        <p>
          <span className="font-semibold">Nome:</span>{" "}
          {parcela.produto.produtoNome}
        </p>
        <p>
          <span className="font-semibold">Descrição:</span>{" "}
          {parcela.produto.produtoDescricao}
        </p>
        <p>
          <span className="font-semibold">Valor Total:</span>{" "}
          {formatarValor(parcela.produto.produtoValorTotal)}
        </p>
      </div>

      {/* Botões na parte inferior */}
      <div className="flex justify-between mt-4">
        {parcela.paga ? (
          <>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Gerar Recibo
            </button>
            <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Enviar Recibo
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              Estornar
            </button>
          </>
        ) : (
          <>
            <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Receber
            </button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Editar
            </button>
            <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
              Renegociar
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={() => setConfirmDelete(true)}>
              Excluir
            </button>
          </>
        )}
      </div>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />

      {/* Modal de Mensagem */}
      <MessageModal
        isOpen={messageModalOpen}
        message={message}
        onClose={() => {
          setMessageModalOpen(false);
          // Você pode adicionar qualquer lógica após fechar o modal aqui, como redirecionar
        }}
      />
    </div>
  );
};

export default ParcelaDetails;
