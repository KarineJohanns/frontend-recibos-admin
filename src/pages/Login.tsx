import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api'; // Importando a função de login do Axios
import { formatarCPF } from '../utils';

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpa o erro a cada tentativa de login
    try {
      const response = await login(cpf, senha);
      
      // Armazena a sessão com o token JWT
      localStorage.setItem('userSession', JSON.stringify(response.token));

      // Redireciona com base no primeiro acesso
      if (response.primeiroAcesso) {
        navigate('/alterar-senha'); // Redireciona para a tela de alteração de senha
      } else {
        navigate('/parcelas'); // Redireciona para a página principal
      }

      // Lógica para expiração do token (opcional)
      setTimeout(() => {
        localStorage.removeItem('userSession'); // Remove após 1 hora
      }, 3600000); // 1 hora = 3600000 ms
      
    } catch (error: any) {
      // Verifica se o erro contém a resposta e exibe a mensagem apropriada
      if (error.response && error.response.data) {
        setError(error.response.data.mensagem || 'CPF ou senha incorretos');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cpfFormatado = formatarCPF(e.target.value); // Formata o CPF
    setCpf(cpfFormatado); // Atualiza o estado com o CPF formatado
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-center text-2xl mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={handleCpfChange}
            className="block w-full mb-4 p-2 border rounded"
            autoComplete="username" // Sugestão de preenchimento automático para CPF
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
            autoComplete="current-password" // Sugestão de preenchimento automático para senha
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
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
