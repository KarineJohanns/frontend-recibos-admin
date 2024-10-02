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