import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import packageJson from '../../package.json'

// Importe a versão diretamente do package.json ou use a variável de ambiente
const appVersion = packageJson.version;
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar a abertura do menu
  const location = useLocation(); // Obtém a localização atual da aplicação
  const navigate = useNavigate(); // Hook para navegação entre as páginas

  // Fecha o menu ao clicar em um link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Remove a sessão do localStorage e redireciona para a tela de login
  const handleLogout = () => {
    localStorage.removeItem("userSession");
    navigate("/login");
    setIsMenuOpen(false); // Fecha o menu ao deslogar
  };

  // Verifica se a página atual é a de login para condicionalmente esconder o menu
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Botão do Menu Hamburguer só aparece se não estiver na página de login */}
      {!isAuthPage && (
        <button
          className="fixed top-4 left-4 p-2 z-30 bg-gray-800 text-white rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna o estado do menu
          style={{ height: '40px', width: '40px' }} // Definindo altura e largura do botão
        >
          ☰
        </button>
      )}

      {/* Menu Lateral aparece quando não está na página de login */}
      {!isAuthPage && (
        <div
          className={`fixed inset-y-0 left-0 bg-gray-800 text-white z-50 transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0 w-[70%]' : '-translate-x-full'
          } md:translate-x-0 md:flex md:flex-col md:w-[30%]`} // Define o estilo do menu com transição
        >
          <nav className="h-screen overflow-auto flex flex-col">
            <Link
              to="/"
              className={`block py-6 px-4 text-xl ${location.pathname === '/parcelas' ? 'bg-gray-700' : ''}`} // Estilo para o link ativo
              onClick={handleLinkClick}
            >
              Parcelas
            </Link>
            <Link
              to="/relatorios"
              className={`block py-6 px-4 text-xl ${location.pathname === '/relatorios' ? 'bg-gray-700' : ''}`} // Estilo para o link ativo
              onClick={handleLinkClick}
            >
              Relatórios
            </Link>
            {/* Botão de Logout */}
            <button
              onClick={handleLogout}
              className="block py-6 px-4 text-xl text-left w-full bg-gray-800 hover:bg-gray-700"
            >
              Logout
            </button>

            {/* Rodapé com a versão */}
            <div className="mt-auto py-2 px-4 text-xs text-gray-400 text-center sticky bottom-0">
              Versão {appVersion}
            </div>
          </nav>
        </div>
      )}

      {/* Overlay escuro aparece quando o menu está aberto */}
      {isMenuOpen && !isAuthPage && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)} // Fecha o menu ao clicar no overlay
        />
      )}

      {/* Conteúdo Principal que pode rolar */}
      <div className="flex-1 overflow-y-auto p-0 ml-0 md:ml-[30%]">
        {children} {/* Renderiza os componentes filhos */}
      </div>
    </div>
  );
};

export default Layout;
