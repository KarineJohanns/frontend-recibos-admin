import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getClientes,
  getProdutos,
  postParcela,
  Cliente,
  Produto,
} from "../api";
import { formatarValor, formatarDataISO } from "../utils";
import Select from "react-select";
import MessageModal from "../components/MessageModal"; // Certifique-se de importar o modal

const CriarParcela: React.FC = () => {
  const [documento, setDocumento] = useState("");
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [valorProduto, setValorProduto] = useState<number | null>(null);
  const [numeroParcelas, setNumeroParcelas] = useState(1);
  const [intervalo, setIntervalo] = useState("MENSAL");
  const [dataVencimento, setDataVencimento] = useState("");
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal
  const [modalMessage, setModalMessage] = useState(""); // Mensagem do modal
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const formattedDate = formatarDataISO(today);
    setDataVencimento(formattedDate);
  }, []);

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
  }, []);

  const optionsClientes = clientes.map((cliente) => ({
    value: cliente.clienteId,
    label: cliente.clienteNome,
  }));

  const optionsProdutos = produtos.map((produto) => ({
    value: produto.produtoId,
    label: produto.produtoNome,
  }));

  const handleClienteChange = (selectedOption: any) => {
    setClienteId(selectedOption ? selectedOption.value : null);
  };

  const handleProdutoChange = (selectedOption: any) => {
    const produtoSelecionado = produtos.find(
      (produto) => produto.produtoId === selectedOption?.value
    );
    setProdutoId(produtoSelecionado?.produtoId || null);
    setValorProduto(produtoSelecionado?.produtoValorTotal || null);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!clienteId) errors.cliente = "Cliente é obrigatório";
    if (!produtoId) errors.produto = "Produto é obrigatório";
    if (!valorProduto || valorProduto <= 0)
      errors.valorProduto = "Valor Total do Produto é obrigatório";
    if (!dataVencimento)
      errors.dataVencimento = "Data de Vencimento é obrigatória";
    if (!documento) errors.documento = "Documento é obrigatório";
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
      documento,
      clienteId,
      produtoId,
      valorTotalProduto: valorProduto,
      numeroParcelas,
      emitenteId: 1,
      intervalo,
      dataVencimento: formatarDataISO(new Date(dataVencimento)),
      dataCriacao: formatarDataISO(new Date()),
    };

    try {
      const response = await postParcela(dadosParcela);

      // Abrindo o modal com a mensagem de sucesso
      setModalMessage(response.mensagem);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erro ao criar parcela", error);
      // Exibir mensagem de erro para o usuário
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-2 md:mb-0 md:text-left text-right">Criar Nova Parcela</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Documento:</label>
          <input
            type="text"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Digite o documento"
            required
          />
          {formErrors.documento && (
            <p className="text-red-500">{formErrors.documento}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Nome do Cliente:</label>
          <Select
            options={optionsClientes}
            onChange={handleClienteChange}
            isLoading={loadingClientes}
            placeholder="Digite o nome do cliente"
            className="basic-single"
            classNamePrefix="select"
            isClearable
            isSearchable
          />
          {formErrors.cliente && (
            <p className="text-red-500">{formErrors.cliente}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Nome do Produto:</label>
          <Select
            options={optionsProdutos}
            onChange={handleProdutoChange}
            isLoading={loadingProdutos}
            placeholder="Digite o nome do produto"
            className="basic-single"
            classNamePrefix="select"
            isClearable
            isSearchable
          />
          {formErrors.produto && (
            <p className="text-red-500">{formErrors.produto}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Valor do Produto:</label>
          <input
            type="text"
            value={valorProduto !== null ? formatarValor(valorProduto) : ""}
            onChange={(e) =>
              setValorProduto(Number(e.target.value.replace(/\D/g, "")))
            }
            className="border rounded p-2 w-full"
            placeholder="Digite o valor do produto"
            required
          />
          {formErrors.valorProduto && (
            <p className="text-red-500">{formErrors.valorProduto}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Número de Parcelas:</label>
          <input
            type="number"
            value={numeroParcelas > 0 ? numeroParcelas : ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setNumeroParcelas(0);
              } else {
                setNumeroParcelas(Number(value));
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
          <label className="block mb-1">Data de Vencimento:</label>
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
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Criar Parcela
        </button>
      </form>

      {/* Adicionar o MessageModal aqui */}
      <MessageModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)} // Função para fechar o modal
      />
    </div>
  );
};

export default CriarParcela;
