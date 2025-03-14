export function formatMoney(value: number | string, currency: string = 'BRL'): string {
  const numericValue = typeof value === 'string' 
    ? Number(value) // Não usa parseMoney aqui para preservar os decimais
    : value;
    
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function formatDecimal(value: number | string): string {
  const numericValue = typeof value === 'string'
    ? Number(value) // Não usa parseMoney aqui para preservar os decimais
    : value;

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function parseMoney(value: string): number {
  // Remove apenas R$ e espaços, mantém pontos e vírgulas
  const cleanValue = value.replace(/[R$\s]/g, '');
  // Converte vírgula para ponto para o Number() interpretar corretamente
  const normalized = cleanValue.replace(',', '.');
  return Number(normalized);
}

export function formatInputMoney(value: string): string {
  // Remove tudo que não for número
  const numericValue = value.replace(/\D/g, '');
  
  // Se não tiver valor, retorna zero formatado
  if (!numericValue) {
    return '0,00';
  }
  
  const decimalValue = Number(numericValue) / 100;
  return formatDecimal(decimalValue);
}
