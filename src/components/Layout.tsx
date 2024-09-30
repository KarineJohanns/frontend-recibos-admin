import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Obtém a localização atual
  const navigate = useNavigate(); // Hook para navegação

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Fecha o menu ao clicar em um link
  };

  const handleLogout = () => {
    localStorage.removeItem("userSession"); // Remove a sessão do localStorage
    navigate("/login"); // Redireciona para a tela de login
    setIsMenuOpen(false);
  };

  // Condição para verificar se deve esconder o menu
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Botão do Menu Hamburguer só aparece se não estiver na página de login */}
      {!isAuthPage && (
        <button
          className="fixed top-4 left-4 p-2 z-30 bg-gray-800 text-white rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ height: '40px', width: '40px' }} // Definindo altura e largura
        >
          ☰
        </button>
      )}

      {/* Menu Lateral só aparece se não estiver na página de login */}
      {!isAuthPage && (
        <div
          className={`fixed inset-y-0 left-0 bg-gray-800 text-white z-50 transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0 w-[70%]' : '-translate-x-full'
          } md:translate-x-0 md:flex md:flex-col md:w-[30%]`}
        >
          <nav className="h-screen overflow-auto">
            <Link
              to="/parcelas"
              className={`block py-6 px-4 text-xl ${location.pathname === '/parcelas' ? 'bg-gray-700' : ''}`}
              onClick={handleLinkClick}
            >
              Parcelas
            </Link>
            <Link
              to="/relatorios"
              className={`block py-6 px-4 text-xl ${location.pathname === '/relatorios' ? 'bg-gray-700' : ''}`}
              onClick={handleLinkClick}
            >
              Relatórios
            </Link>
            {/* Link de Logout */}
            <button
              onClick={handleLogout}
              className="block py-6 px-4 text-xl text-left w-full bg-gray-800 hover:bg-gray-700"
            >
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Overlay quando o menu está aberto */}
      {isMenuOpen && !isAuthPage && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Conteúdo Principal que pode rolar */}
      <div className="flex-1 overflow-y-auto p-0 ml-0 md:ml-[30%]">
        {children}
      </div>
    </div>
  );
};

export default Layout;
