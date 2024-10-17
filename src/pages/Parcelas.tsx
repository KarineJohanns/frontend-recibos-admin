import React, { useEffect, useState } from "react";
import { useParcelas } from "../ParcelaContext";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import positivo from "../assets/positivo.gif";
import { formatarValor, formatarData } from "../utils"; // Certifique-se de que estas funções estejam implementadas

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
  dataVencimento: string; // Data de vencimento
  documento: string; // Documento associado à parcela
}

const Parcelas: React.FC = () => {
  const { parcelas, loading, error, fetchParcelas } = useParcelas(); // Usando o Contexto
  const [filter, setFilter] = useState<string>("todas");

  useEffect(() => {
    fetchParcelas(); // Busca as parcelas ao montar o componente
  }, [fetchParcelas]);

  // Obter data atual e zerar horas
  const dataAtual = new Date();
  dataAtual.setHours(0, 0, 0, 0); // Zera horas, minutos e segundos

  // Lógica para definir a cor e o texto do badge
  const getBadgeDetails = (parcela: Parcela): { color: string; text: string } => {
    const dataVencimento = new Date(parcela.dataVencimento);
    dataVencimento.setHours(0, 0, 0, 0); // Zera horas da data de vencimento para comparação

    // Verifica se a parcela já foi paga
    if (parcela.paga) {
      return { color: "bg-green-500", text: "Paga" };
    }

    // Verifica se a parcela vence hoje
    if (dataVencimento.getTime() === dataAtual.getTime()) {
      return { color: "bg-blue-500", text: "Vence hoje" };
    }

    // Verifica se a parcela está atrasada
    if (dataVencimento < dataAtual) {
      return { color: "bg-red-500", text: "Atrasada" };
    }

    // Caso contrário, a parcela está pendente
    return { color: "bg-yellow-500", text: "Pendente" };
  };

  const filteredParcelas = parcelas
    .filter((parcela) => {
      const dataVencimento = new Date(parcela.dataVencimento);
      dataVencimento.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas as datas

      // Filtros
      if (filter === "pagas") return parcela.paga; // Apenas parcelas pagas
      if (filter === "pendentes")
        return !parcela.paga && dataVencimento >= dataAtual; // Apenas pendentes que não estão atrasadas
      if (filter === "atrasadas")
        return !parcela.paga && dataVencimento < dataAtual; // Apenas atrasadas
      if (filter === "venceHoje")
        return (
          !parcela.paga && dataVencimento.getTime() === dataAtual.getTime()
        ); // Apenas as que vencem hoje

      return true; // Todas
    })
    .sort(
      (a, b) =>
        new Date(a.dataVencimento).getTime() -
        new Date(b.dataVencimento).getTime()
    );

  return (
    <div>
      {/* Componente de loading */}
      <Loading loading={loading} error={error} />
      {/* Cabeçalho fixo */}
      <div className="sticky top-0 bg-white p-4" style={{ marginTop: 0 }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-start">
          <h1 className="text-2xl mb-2 md:mb-0 md:text-left text-right">
            Lista de Parcelas
          </h1>
          <div className="flex flex-col items-end md:flex-row md:items-center md:ml-auto">
            {/* Filtro */}
            <div className="mb-2 md:mb-0 md:mr-4">
              <label htmlFor="filter" className="mr-2">
                Filtrar:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded p-1"
              >
                <option value="todas">Todas</option>
                <option value="pagas">Pagas</option>
                <option value="pendentes">Pendentes</option>
                <option value="atrasadas">Atrasadas</option>
                <option value="venceHoje">Vence hoje</option>
              </select>
            </div>
            {/* Botão para criar nova parcela */}
            <Link to="/criar-parcela">
              <button className="bg-gray-500 text-white py-2 px-4 rounded">
                Nova Parcela
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Verifica se não há parcelas após o carregamento */}
      {filteredParcelas.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center p-4">
          <img
            src={positivo}
            alt="Sem dados"
            className="max-w-full max-h-64 w-auto h-auto mb-4"
          />
          <p className="text-gray-500">Não há parcelas para mostrar.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredParcelas.map((parcela) => {
            const badgeDetails = getBadgeDetails(parcela); // Obter a cor e o texto do badge
            return (
              <li
                key={parcela.parcelaId}
                className="flex justify-between items-center p-4 mx-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              >
                <Link to={`/parcelas/${parcela.parcelaId}`} className="flex-1">
                  <h2 className="font-semibold">{parcela.documento}</h2>
                  <p>{parcela.cliente.clienteNome}</p>
                  <p>
                    {parcela.paga
                      ? formatarValor(parcela.valorPago)
                      : formatarValor(parcela.valorParcela)}
                  </p>
                  <p>Vencimento: {formatarData(parcela.dataVencimento)}</p>{" "}
                  {/* Formatar data de vencimento */}
                </Link>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-white px-2 py-1 rounded ${badgeDetails.color} w-24 text-center`}
                  >
                    {badgeDetails.text}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Parcelas;
