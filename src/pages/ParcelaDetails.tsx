// src/pages/ParcelaDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importar useNavigate para navegação
import {
  getParcelasData,
  deleteParcela,
  patchEstornar,
  getRecibos,
  uploadFile,
} from "../api"; // Importar patchEstornar
import MessageModal from "../components/MessageModal";
import ModalReceberParcela from "../components/ModalReceberParcela";
import Loading from "../components/Loading";
import { formatarValor, formatarData } from "../utils";


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
  const [estornoConfirmationOpen, setEstornoConfirmationOpen] =
    useState<boolean>(false); // Estado para abrir o modal de confirmação de estorno
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        "Erro ao estornar a parcela: " + (err.response?.message || err.message)
      );
    } finally {
      setMessageModalOpen(true);
      setEstornoConfirmationOpen(false);
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleGerarRecibo = async (parcelaId: number) => {
    try {
      const response = await getRecibos(parcelaId);
       // Verifica se a resposta é um blob
       if (response.data instanceof Blob) {
        const blob = response.data; 
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Aguarde até que o cabeçalho esteja disponível
        let attempts = 0;
        const maxAttempts = 20; // máximo de 20 tentativas (10 segundos)
        const interval = setInterval(() => {
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const filename = contentDisposition.split('filename=')[1].replace(/"/g, '').trim();
                link.setAttribute("download", filename);
                
                // Para o intervalo e faz o download
                clearInterval(interval);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.error("O cabeçalho 'Content-Disposition' não foi encontrado após várias tentativas.");
                link.setAttribute("download", `recibo_${parcelaId}.pdf`); // Fallback
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
            attempts++;
        }, 500); // verifica a cada 500 ms (0,5 segundos)

    } else {
        console.error("A resposta não é um Blob.");
    }
} catch (error) {
    console.error("Erro ao gerar recibo", error);
}
};

  // Função para capturar o arquivo escolhido pelo usuário
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file); // Define o arquivo selecionado
      setLoading(true); // Inicia o carregamento

      try {
        const parcelaId = parcela.parcelaId;

        console.log("ID da parcela:", parcelaId);

        // Envia o arquivo usando a função uploadFile
        const uploadResponse = await uploadFile(file, parcelaId); // Passa o ID da parcela

        // Exibe a mensagem de sucesso
        console.log("Upload bem-sucedido:", uploadResponse);
        setMessage("Recibo enviado com sucesso!");
      } catch (error) {
        console.error("Erro ao enviar recibo:", error);
        setMessage(
          "Erro ao enviar recibo: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false); // Termina o carregamento
        setMessageModalOpen(true); // Exibe o modal com a mensagem
      }
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

  if (loading || error || !parcela) {
    return <Loading loading={loading} error={error} notFound={!parcela} />;
  }

  const getStatusText = (paga: boolean): string => {
    return paga ? "Paga" : "Pendente";
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
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => handleGerarRecibo(parcela.parcelaId)}
            >
              Gerar Recibo
            </button>
            <div>
              <button
                className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  !loading && document.getElementById("fileInput")?.click()
                }
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Recibo"}
              </button>

              <input
                id="fileInput"
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange} // Chama a função de upload ao selecionar o arquivo
              />
            </div>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => setEstornoConfirmationOpen(true)}
            >
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
              onClick={() => setConfirmDelete (true)} // Abre o modal de confirmação para estornar
            >
              Excluir
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
