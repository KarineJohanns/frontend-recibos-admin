// utils.ts
export const formatarValor = (valor: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor / 100); // Divide por 100 se o valor estiver em centavos
  };
  
  export const formatarData = (data: string): string => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
  };
  
  export const formatarDataISO = (data: Date): string => {
    return data.toISOString().split('T')[0];
  };

    // Função para formatar CPF (ex: 123.456.789-09)
    export const formatarCPF = (cpf: string): string => {
      // Remove todos os caracteres que não sejam números
      cpf = cpf.replace(/\D/g, '');
    
      // Aplica a máscara de CPF progressivamente
      if (cpf.length <= 3) {
        return cpf;
      } else if (cpf.length <= 6) {
        return cpf.replace(/(\d{3})(\d+)/, '$1.$2');
      } else if (cpf.length <= 9) {
        return cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
      } else {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      }
    };