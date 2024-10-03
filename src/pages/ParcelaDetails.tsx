// src/pages/ParcelaDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importar useNavigate para navegação
import { getParcelasData, deleteParcela, patchEstornar, getRecibos } from "../api"; // Importar patchEstornar
import MessageModal from "../components/MessageModal";
import ModalReceberParcela from "../components/ModalReceberParcela"; // Importar o modal de recebimento

const ParcelaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtém o id da URL
  const navigate = useNavigate(); // Adicionar useNavigate para redirecionar
  const [parcela, setParcela] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [messageModalOpen, setMessageModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [receberModalOpen, setReceberModalOpen] = useState<boolean>(false); // Estado para abrir o modal de recebimento
  const [estornoConfirmationOpen, setEstornoConfirmationOpen] = useState<boolean>(false); // Estado para abrir o modal de confirmação de estorno

  useEffect(() => {
    const fetchParcela = async () => {
      try {
        const response = await getParcelasData();
        const parcela = response.find((p: any) => p.parcelaId === Number(id));
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
      const response = await deleteParcela(parcela.parcelaId);
      if (response.dtos && response.dtos.mensagem) {
        setMessage(response.dtos.mensagem);
      } else {
        setMessage("Exclusão bem-sucedida, mas sem mensagem.");
      }
    } catch (err) {
      console.error("Erro ao excluir a parcela:", err);
      setMessage(
        "Erro ao excluir a parcela: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setMessageModalOpen(true);
      setConfirmDelete(false);
    }
  };

  const handleEstornar = async () => {
    console.log("Tentando estornar a parcela:", parcela.parcelaId); // Log da parcela
    try {
      const response = await patchEstornar(parcela.parcelaId);
      console.log("Resposta do estorno:", response); // Log da resposta
        setMessage(response.mensagem);
    } catch (err) {
      console.error("Erro ao estornar a parcela:", err);
      setMessage(
        "Erro ao estornar a parcela: " +
          (err.response?.message || err.message)
      );
    } finally {
      setMessageModalOpen(true);
      setEstornoConfirmationOpen(false);
    }
  };

  const handleGerarRecibo = async (parcelaId: number) => {
    try {
      const response = await getRecibos(parcelaId);
      console.log("Retorno recibo: ", response);
  
      // Cria o blob com o tipo correto
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Cria o link para download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recibo_parcela_${parcelaId}.pdf`); // Nome do arquivo
      document.body.appendChild(link);
      link.click();
      
      // Remove o link após o clique e libera a URL do blob
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar recibo', error);
    }
  };

  // Modal de Confirmação
  const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-bold mb-4">Confirmar Exclusão</h2>
          <p>Você tem certeza que deseja excluir esta parcela?</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={onConfirm}
            >
              Sim, excluir
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal de Confirmação para Estornar
  const EstornoConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-bold mb-4">Confirmar Estorno</h2>
          <p>Você tem certeza que deseja estornar esta parcela?</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={onConfirm}
            >
              Sim, estornar
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
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => handleGerarRecibo(parcela.parcelaId)}>
              Gerar Recibo
            </button>
            <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Enviar Recibo
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={() => setEstornoConfirmationOpen(true)}>
              Estornar
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              onClick={() => setReceberModalOpen(true)} // Abre o modal de recebimento
            >
              Receber
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => navigate(`/editar-parcela/${parcela.parcelaId}`)} // Navegar para a tela de edição
            >
              Editar
            </button>
            <button
              className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
              onClick={() => setReceberModalOpen(true)} // Abre o modal de renegociação
            >
              Renegociar
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => setEstornoConfirmationOpen(true)} // Abre o modal de confirmação para estornar
            >
              Estornar
            </button>
          </>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmationModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />

      {/* Modal de Confirmação de Estorno */}
      <EstornoConfirmationModal
        isOpen={estornoConfirmationOpen}
        onClose={() => setEstornoConfirmationOpen(false)}
        onConfirm={handleEstornar}
      />

      {/* Modal de Mensagem */}
      <MessageModal
        isOpen={messageModalOpen}
        message={message}
        onClose={() => {
          setMessageModalOpen(false);
        }}
      />

      {/* Modal de Recebimento */}
      <ModalReceberParcela
        isOpen={receberModalOpen}
        onClose={() => setReceberModalOpen(false)}
        parcela={parcela} // Passa a parcela atual para o modal
      />
    </div>
  );
};

export default ParcelaDetails;
