import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClientes,
  getProdutos,
  getParcelaById,
  patchRenegociarParcelas,
  Cliente,
  Produto,
} from "../api";
import { formatarValor, formatarDataISO } from "../utils";
import Select from "react-select";
import MessageModal from "../components/MessageModal";

const RenegociarParcela: React.FC = () => {
  const { parcelaId } = useParams<{ parcelaId: string }>();
  const [documento, setDocumento] = useState("");
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [valorParcela, setValorParcela] = useState<number | null>(null); // Renomear para valorParcela
  const [numeroParcelas, setNumeroParcelas] = useState(1); // Número de parcelas
  const [intervalo, setIntervalo] = useState("MENSAL"); // Intervalo de pagamento
  const [dataVencimento, setDataVencimento] = useState("");
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [valorPago, setValorPago] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (parcelaId) {
      carregarParcela();
    }
  }, [parcelaId]);

  const carregarParcela = async () => {
    try {
      const parcela = await getParcelaById(parcelaId);

      if (parcela) {
        setDocumento(parcela.documento);
        setClienteId(parcela.cliente.clienteId); // Armazenar ID do cliente
        setProdutoId(parcela.produto.produtoId); // Armazenar ID do produto
        setValorParcela(parcela.valorParcela); // Usar valorParcela retornado do backend
        setIntervalo(parcela.intervalo); // Armazenar intervalo
        setDataVencimento(formatarDataISO(new Date(parcela.dataVencimento))); // Armazenar data de vencimento
      } else {
        console.error("Parcela não encontrada");
      }
    } catch (error) {
      console.error("Erro ao carregar a parcela", error);
    }
  };

  const carregarClientes = async () => {
    setLoadingClientes(true);
    try {
      const response = await getClientes();
      setClientes(response);
    } catch (error) {
      console.error("Erro ao carregar clientes", error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const carregarProdutos = async () => {
    setLoadingProdutos(true);
    try {
      const response = await getProdutos();
      setProdutos(response);
    } catch (error) {
      console.error("Erro ao carregar produtos", error);
    } finally {
      setLoadingProdutos(false);
    }
  };

  useEffect(() => {
    carregarClientes();
    carregarProdutos();
    if (parcelaId) {
      carregarParcela();
    }
  }, [parcelaId]);

  const optionsClientes = clientes.map((cliente) => ({
    value: cliente.clienteId,
    label: cliente.clienteNome,
  }));

  const optionsProdutos = produtos.map((produto) => ({
    value: produto.produtoId,
    label: produto.produtoNome,
  }));

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!documento) errors.documento = "Documento é obrigatório";
    if (!valorParcela || valorParcela <= 0) {
      errors.valorParcela = "Valor da Parcela é obrigatório"; // Essa linha pode ser removida, já que valorParcela é obtido do backend
    }
    if (!dataVencimento)
      errors.dataVencimento = "Data de Vencimento é obrigatória";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    const dadosParcela = {
        gerarNovasParcelas: true,
        valorPago: valorPago,
        numeroParcelasRenegociacao: numeroParcelas, // Mapeando para 'numeroParcelasRenegociacao'
        novoIntervalo: intervalo, // Mapeando para 'novoIntervalo'
        dataPrimeiraParcela: formatarDataISO(new Date(dataVencimento)), // Mapeando para 'dataPrimeiraParcela'
    };
  
    console.log("Dados da parcela a serem enviados:", dadosParcela); // <-- Adicione aqui
  
    try {
      const response = await patchRenegociarParcelas(parcelaId, dadosParcela);
      console.log("Resposta do backend:", response); // <-- E aqui
      setModalMessage(response.mensagem);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erro ao atualizar parcela", error);
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-2 md:mb-0 md:text-left text-right">
        Renegociar Parcela
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Documento:</label>
          <input
            type="text"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            className="border rounded p-2 w-full bg-gray-100 e cursor-not-allowed"
            placeholder="Digite o documento"
            required
            readOnly
          />
          {formErrors.documento && (
            <p className="text-red-500">{formErrors.documento}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Nome do Cliente:</label>
          <Select
            options={optionsClientes}
            value={optionsClientes.find(
              (cliente) => cliente.value === clienteId
            )}
            className="basic-single"
            classNamePrefix="select"
            isDisabled // Campo apenas leitura
          />
        </div>
        <div>
          <label className="block mb-1">Nome do Produto:</label>
          <Select
            options={optionsProdutos}
            value={optionsProdutos.find(
              (produto) => produto.value === produtoId
            )}
            className="basic-single"
            classNamePrefix="select"
            isDisabled // Campo apenas leitura
          />
        </div>
        <div>
          <label className="block mb-1">Valor da Parcela:</label>
          <input
            type="text"
            value={valorParcela !== null ? formatarValor(valorParcela) : ""}
            onChange={(e) =>
              setValorParcela(Number(e.target.value.replace(/\D/g, "")))
            } // Permitir edição
            className="border rounded p-2 w-full bg-gray-100 e cursor-not-allowed"
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1">Número de Parcelas:</label>
          <input
            type="number"
            value={numeroParcelas > 0 ? numeroParcelas : ""} // Mantém vazio se número de parcelas for 0
            onChange={(e) => {
              const value = e.target.value; // Captura o valor do campo
              if (value === "") {
                setNumeroParcelas(0); // Se o campo estiver vazio, setar 0
              } else {
                setNumeroParcelas(Number(value)); // Caso contrário, converter para número
              }
            }}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Intervalo:</label>
          <select
            value={intervalo}
            onChange={(e) => setIntervalo(e.target.value)}
            className="border rounded p-2 w-full"
            required
          >
            <option value="MENSAL">Mensal</option>
            <option value="QUINZENAL">Quinzenal</option>
            <option value="SEMANAL">Semanal</option>
            <option value="ANUAL">Anual</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Data de Vencimento a primeira parcela:</label>
          <input
            type="date"
            value={dataVencimento}
            onChange={(e) => setDataVencimento(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
          {formErrors.dataVencimento && (
            <p className="text-red-500">{formErrors.dataVencimento}</p>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          Salvar Alterações
        </button>
      </form>
      {isModalOpen && (
        <MessageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={modalMessage}
        />
      )}
    </div>
  );
};

export default RenegociarParcela;
