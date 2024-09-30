import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api'; // Importando a função de login do Axios

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(cpf, senha);
      
      // Armazena a sessão com o token JWT
      localStorage.setItem('userSession', JSON.stringify(response.token));

      // Redireciona com base no primeiro acesso
      if (response.primeiroAcesso) {
        navigate('/alterar-senha'); // Redireciona para a tela de alteração de senha
      } else {
        navigate('/'); // Redireciona para a página principal
      }

      // Lógica para expiração do token (opcional)
      setTimeout(() => {
        localStorage.removeItem('userSession'); // Remove após 1 hora
      }, 3600000); // 1 hora = 3600000 ms
      
    } catch (error) {
      setError('CPF ou senha incorretos');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-center text-2xl mb-4">Login</h2>
        <form onSubmit={handleLogin}> {/* Usando <form> para gerenciamento padrão de submissão */}
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
            autoComplete="username" // Sugestão de preenchimento automático para CPF
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
            autoComplete="current-password" // Sugestão de preenchimento automático para senha
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit" // Alterado para tipo "submit" para utilizar o comportamento padrão
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Entrar
          </button>
        </form>
        <a href="/alterar-senha" className="text-blue-500 text-center block mt-4">Esqueci a senha</a>
      </div>
    </div>
  );
};

export default Login;
