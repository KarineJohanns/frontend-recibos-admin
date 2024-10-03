import axios, { AxiosRequestConfig } from 'axios';

// Configuração da instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
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
  clienteId: number;         // Correspondente ao campo clienteId (Long)
  clienteNome: string;       // Correspondente ao campo clienteNome (String)
  clienteCpf: string;        // Correspondente ao campo clienteCpf (String)
  clienteEndereco: string;   // Correspondente ao campo clienteEndereco (String)
  clienteTelefone: string;   // Correspondente ao campo clienteTelefone (String)
  senha: string;             // Correspondente ao campo senha (String)
  primeiroAcesso: boolean;   // Correspondente ao campo primeiroAcesso (Boolean)
}

export interface Produto {
  produtoId: number;          // Correspondente ao campo produtoId (Long)
  produtoNome: string;        // Correspondente ao campo produtoNome (String)
  produtoValorTotal: number;  // Correspondente ao campo produtoValorTotal (Integer)
  produtoDescricao: string;   // Correspondente ao campo produtoDescricao (String)
}

export interface Emitente {
  emitenteId: number;         // Correspondente ao campo emitenteId (Long)
  emitenteNome: string;       // Correspondente ao campo emitenteNome (String)
  emitenteCpf: string;        // Correspondente ao campo emitenteCpf (String)
  emitenteEndereco: string;   // Correspondente ao campo emitenteEndereco (String)
  emitenteTelefone: string;   // Correspondente ao campo emitenteTelefone (String)
}

export interface Parcela {
  clienteId: number;           // ID do cliente relacionado à parcela
  produtoId: number;           // ID do produto relacionado à parcela
  valorTotalProduto: number;   // Valor total do produto
  numeroParcelas: number;      // Quantidade de parcelas
  emitenteId: number;          // ID do emitente relacionado à parcela
  intervalo: string;           // Intervalo (e.g., MENSAL, QUINZENAL, SEMANAL)
  dataCriacao: string;         // Data de criação da parcela
  dataVencimento: string;      // Data de vencimento da parcela
  documento: string;           // Documento relacionado à parcela
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
export const getClientesPorNome = async (nome: string) => {
  const response = await axios.get(`/clientes/por-nome?nome=${nome}`); // Chamada para o endpoint
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
  const response = await api.patch(`/emitente/${id}`, emitente);
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
// Obtém uma parcela pelo ID
export const getParcelaById = async (id: number) => {
  const response = await api.get(`/parcelas/${id}`);
  return response.data; // Retorna os dados da parcela encontrada
};

// Adiciona uma nova Parcela
export const postParcela = async (parcela: Parcela) => {
  const response = await api.post('/parcelas', parcela);
  return response.data; // Retorna os dados da parcela criada
};

// Atualiza uma Parcela existente
export const patchParcelas = async (parcelaId: string, dadosParcela: any) => {
  const response = await api.patch(`/parcelas/${parcelaId}`, dadosParcela); // Não encapsule em um objeto 'body'
  console.log(response.data);
  return response.data;
};
 // Pagar parcela
export const patchPagarParcelas = async (parcelaId: string, dadosParcela: any) => {
  const response = await api.patch(`/parcelas/${parcelaId}/pagar`, dadosParcela); // Não encapsule em um objeto 'body'
  console.log("mas que caralho " , response.data);
  return response.data;
  
};

//Escolha
export const patchEscolha = async (parcelaId: string, dadosParcela: any) => {
  const response = await api.patch(`/parcelas/${parcelaId}/escolha`, dadosParcela); // Não encapsule em um objeto 'body'
  console.log("Retorno da requisição api.ts: " , response.data);
  return response.data;
  
};

// Renegociar uma Parcela existente
export const patchRenegociarParcelas = async (parcelaId: string, dadosParcela: any) => {
  const response = await api.patch(`/parcelas/${parcelaId}/renegociar`, dadosParcela); // Não encapsule em um objeto 'body'
  return response.data;
};

//Desfazer pagamento / estornar
export const patchEstornar = async (parcelaId: string) => {
  const response = await api.patch(`/parcelas/${parcelaId}/desfazer`); // Não encapsule em um objeto 'body'
  return response.data;
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
