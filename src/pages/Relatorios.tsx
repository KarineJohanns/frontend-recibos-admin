// src/pages/Relatorios.tsx
import React, { useEffect, useState } from "react";
import { postRelatoriosData, getRelatoriosLista } from "../api";

interface Relatorio {
  nome: string;
  descricao: string;
}

const Relatorios: React.FC = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Relatorio | null>(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [statusParcela, setStatusParcela] = useState<boolean | null>(null);

  const setDefaultDates = () => {
    const today = new Date();
    const formattedDate = (date: Date) => date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    setDataInicio(formattedDate(today));
    setDataFim(formattedDate(today));
  };

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const response = await getRelatoriosLista();
        setRelatorios(response); // Agora a resposta é diretamente a lista de relatórios
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        setError("Não foi possível carregar os relatórios.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
    setDefaultDates(); // Define as datas padrão na inicialização
  }, []);

  const handleOpenModal = (report: Relatorio) => {
    setSelectedReport(report);
    setShowModal(true);
    setDefaultDates(); // Redefine as datas ao abrir o modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setStatusParcela(null);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.id === "overlay") {
      handleCloseModal();
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedReport) return;

    const reportData: any = {
      tipoRelatorio: selectedReport.nome,
      clienteId: 1,
    };

    if (selectedReport.nome === "parcelas") {
      if (statusParcela !== null) {
        reportData.statusParcela = statusParcela;
      }
    }

    if (selectedReport.nome === "parcelas_por_data") {
      if (dataInicio) {
        reportData.dataInicio = dataInicio;
      }

      if (dataFim) {
        reportData.dataFim = dataFim;
      }
    }

    console.log("JSON enviado:", reportData);

    try {
      const response = await postRelatoriosData(reportData);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      handleCloseModal();
    }
  };

  if (loading) return <p className="text-lg">Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {/* Cabeçalho fixo */}
      <div
        className="sticky top-0 bg-white text-right md:text-left" // Adicionando text-right para telas menores e md:text-left para telas maiores
        style={{ padding: "1rem 1rem 1rem" }}
      >
        <h1 className="text-2xl font-bold">Relatórios</h1>
      </div>
      {/* Renderizando a lista de relatórios */}
      <ul className="space-y-4">
        {relatorios.map((relatorio) => (
          <li
            key={relatorio.nome}
            className="w-full flex justify-between items-center p-4 mx-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => handleOpenModal(relatorio)}
          >
            {relatorio.descricao}
          </li>
        ))}
      </ul>

      {showModal && selectedReport && (
        <div
        id="overlay"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleOverlayClick}
      >
          <div className="bg-white rounded-lg p-4 w-96">
            <h2 className="text-lg font-bold">{selectedReport.descricao}</h2>
            {selectedReport.nome === "parcelas" && (
              <>
                <div className="mt-4">
                  <label className="block mb-1">Status da Parcela</label>
                  <select
                    value={
                      statusParcela === null
                        ? ""
                        : statusParcela
                        ? "PAGA"
                        : "PENDENTE"
                    }
                    onChange={(e) =>
                      setStatusParcela(
                        e.target.value === "PAGA"
                          ? true
                          : e.target.value === "PENDENTE"
                          ? false
                          : null
                      )
                    }
                    className="border rounded p-2 w-full"
                  >
                    <option value="">Selecione</option>
                    <option value="PAGA">PAGA</option>
                    <option value="PENDENTE">PENDENTE</option>
                  </select>
                </div>
              </>
            )}
            {selectedReport.nome === "parcelas_por_data" && (
              <>
                <div className="mt-4">
                  <label className="block mb-1">Data Início</label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-1">Status da Parcela</label>
                  <select
                    value={
                      statusParcela === null
                        ? ""
                        : statusParcela
                        ? "PAGA"
                        : "PENDENTE"
                    }
                    onChange={(e) =>
                      setStatusParcela(
                        e.target.value === "PAGA"
                          ? true
                          : e.target.value === "PENDENTE"
                          ? false
                          : null
                      )
                    }
                    className="border rounded p-2 w-full"
                  >
                    <option value="">Selecione</option>
                    <option value="PAGA">PAGA</option>
                    <option value="PENDENTE">PENDENTE</option>
                  </select>
                </div>
              </>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-black rounded px-4 py-2 mr-2"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white rounded px-4 py-2"
                onClick={handleGenerateReport}
              >
                Gerar Relatório
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Relatorios;
