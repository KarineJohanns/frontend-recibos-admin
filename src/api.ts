import axios, { AxiosRequestConfig } from 'axios';

// Configuração da instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Altere para a URL base da sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todos os pedidos
api.interceptors.request.use(
  (config: AxiosRequestConfig<any>) => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const token = JSON.parse(userSession); // Extraia o token armazenado
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tipagem para o relatório
export interface ReportData {
  tipoRelatorio: string;
  clienteId: number | null;
  dataInicio: string;
  dataFim: string;
}

// Tipagens para Clientes, Produtos, Emitente e Parcelas (exemplo)
export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  // Adicione outros campos conforme necessário
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  // Adicione outros campos conforme necessário
}

export interface Emitente {
  id: number;
  nome: string;
  cnpj: string;
  // Adicione outros campos conforme necessário
}

export interface Parcela {
  id: number;
  valor: number;
  dataVencimento: string;
  clienteId: number;
  // Adicione outros campos conforme necessário
}

// Funções de API

// Obtém os dados das parcelas
export const getParcelasData = async () => {
  const response = await api.get('/parcelas');
  return response.data; // Retorna os dados recebidos
};

// Obtém a lista de relatórios
export const getRelatoriosLista = async () => {
  const response = await api.get('/relatorios/lista');
  return response.data; // Retorna os dados recebidos
};

// Envia dados de relatórios
export const postRelatoriosData = async (reportData: ReportData) => {
  const response = await api.post('/relatorios/parcelas', reportData, {
    responseType: 'blob', // Altera para arraybuffer para manipulação correta do PDF
  });
  return response.data; // Retorna os dados recebidos
};

// Requisição de Login
export const login = async (cpf: string, senha: string) => {
  const response = await api.post('/login', { cpf, senha });
  return response.data; // Retorna os dados recebidos (incluindo primeiroAcesso)
};

// Requisição de Alteração de Senha
export const alterarSenha = async (
  cpf: string,
  senhaAtual: string,
  novaSenha: string
) => {
  const response = await api.put('/alterar-senha', {
    cpf,
    senhaAtual,
    novaSenha,
  });
  return response.status; // Retorna o status da resposta (200 se sucesso)
};

// Clientes
// Obtém a lista de Clientes
export const getClientes = async () => {
  const response = await api.get('/clientes');
  return response.data; // Retorna a lista de clientes
};

// Obtém a Cliente por nome
export const getClientesPorNome = async () => {
  const response = await api.get('/clientes/por-nome');
  return response.data; // Retorna a lista de clientes
};
// Adiciona um novo Cliente
export const postCliente = async (cliente: Cliente) => {
  const response = await api.post('/clientes', cliente);
  return response.data; // Retorna os dados do cliente criado
};

// Atualiza um Cliente existente
export const patchCliente = async (id: number, cliente: Partial<Cliente>) => {
  const response = await api.patch(`/clientes/${id}`, cliente);
  return response.data; // Retorna os dados do cliente atualizado
};

// Deleta um Cliente existente
export const deleteCliente = async (id: number) => {
  const response = await api.delete(`/clientes/${id}`);
  return response.data; // Retorna os dados ou status da resposta (200 se sucesso)
};

// Produtos
// Obtém a lista de Produtos
export const getProdutos = async () => {
  const response = await api.get('/produtos');
  return response.data; // Retorna a lista de produtos
};

// Adiciona um novo Produto
export const postProduto = async (produto: Produto) => {
  const response = await api.post('/produtos', produto);
  return response.data; // Retorna os dados do produto criado
};

// Atualiza um Produto existente
export const patchProduto = async (id: number, produto: Partial<Produto>) => {
  const response = await api.patch(`/produtos/${id}`, produto);
  return response.data; // Retorna os dados do produto atualizado
};

// Deleta um Produto existente
export const deleteProduto = async (id: number) => {
  const response = await api.delete(`/produtos/${id}`);
  return response.data; // Retorna os dados ou status da resposta (200 se sucesso)
};

// Emitente
// Obtém a lista de Emitentes
export const getEmitentes = async () => {
  const response = await api.get('/pmitente');
  return response.data; // Retorna a lista de emitentes
};

// Adiciona um novo Emitente
export const postEmitente = async (emitente: Emitente) => {
  const response = await api.post('/emitente', emitente);
  return response.data; // Retorna os dados do emitente criado
};

// Atualiza um Emitente existente
export const patchEmitente = async (id: number, emitente: Partial<Emitente>) => {
  const response = await api.patch(`/Emitente/${id}`, emitente);
  return response.data; // Retorna os dados do emitente atualizado
};

// Deleta um Emitente existente
export const deleteEmitente = async (id: number) => {
  const response = await api.delete(`/emitente/${id}`);
  return response.data; // Retorna os dados ou status da resposta (200 se sucesso)
};

// Parcelas
// Obtém a lista de Parcelas
export const getParcelas = async () => {
  const response = await api.get('/parcelas');
  return response.data; // Retorna a lista de parcelas
};

// Adiciona uma nova Parcela
export const postParcela = async (parcela: Parcela) => {
  const response = await api.post('/parcelas', parcela);
  return response.data; // Retorna os dados da parcela criada
};

// Atualiza uma Parcela existente
export const patchParcela = async (id: number, parcela: Partial<Parcela>) => {
  const response = await api.patch(`/parcelas/${id}`, parcela);
  return response.data; // Retorna os dados da parcela atualizada
};

// Deleta uma Parcela existente
export const deleteParcela = async (id: number) => {
  const response = await api.delete(`/parcelas/${id}`);
  return response.data; // Retorna os dados ou status da resposta (200 se sucesso)
};

// Recibos
// Obtém a lista de Recibos
export const getRecibos = async () => {
  const response = await api.get('/recibos');
  return response.data; // Retorna a lista de recibos
};

// Adiciona um novo Recibo
export const postRecibo = async (reciboData: any) => {
  const response = await api.post('/recibos', reciboData);
  return response.data; // Retorna os dados do recibo criado
};

// Deleta um Recibo existente
export const deleteRecibo = async (id: number) => {
  const response = await api.delete(`/recibos/${id}`);
  return response.data; // Retorna os dados ou status da resposta (200 se sucesso)
};

export default api;
