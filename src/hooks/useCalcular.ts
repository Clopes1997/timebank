import { useState } from 'react';
import { TimeInputs } from './useTimeInputs';
import { formatHHMM, formatHhMmin, isValidTime, pad, toMinutes } from '../utils/time';

const JORNADA_MINUTOS = 8 * 60;
const TOLERANCIA_MINUTOS = 0;

const useCalcular = (timeInputs: TimeInputs, saldoInicial: number) => {
  const [resultado, setResultado] = useState('');

  const calcular = (): void => {
    const { entrada1, saida1, entrada2, saida2 } = timeInputs;
    const period1Valid = isValidTime(entrada1) && isValidTime(saida1);
    const period2Valid = isValidTime(entrada2) && isValidTime(saida2);
    let message = '';

    if (!isValidTime(entrada1) && !isValidTime(entrada2)) {
      setResultado('<p>Preencha pelo menos os três primeiros campos corretamente.</p>');
      return;
    }

    let workedMinutes = 0;
    if (period1Valid) workedMinutes += toMinutes(saida1) - toMinutes(entrada1);

    if (period2Valid) {
      workedMinutes += toMinutes(saida2) - toMinutes(entrada2);
      const rawBalance = workedMinutes - JORNADA_MINUTOS + saldoInicial;
      const balance = rawBalance < 0 && Math.abs(rawBalance) <= TOLERANCIA_MINUTOS ? 0 : rawBalance;
      const balanceClass = balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'neutral';

      message += `<p><strong>Total trabalhado:</strong> ${formatHhMmin(workedMinutes)}</p>`;

      if (saldoInicial !== 0) {
        const initialClass = saldoInicial > 0 ? 'positive' : 'negative';
        message += `<p><strong>Saldo inicial:</strong> <span class="${initialClass}">${saldoInicial >= 0 ? '+' : '-'}${formatHHMM(Math.abs(saldoInicial))}</span></p>`;
      }

      message += `<p><strong>Saldo final:</strong> <span class="${balanceClass}">${balance >= 0 ? '+' : '-'}${formatHhMmin(Math.abs(balance))}</span></p>`;
    } else if (isValidTime(entrada2) && !saida2) {
      const remainingMinutes = JORNADA_MINUTOS - workedMinutes - saldoInicial;
      const idealExit = toMinutes(entrada2) + remainingMinutes;

      message = `<p><strong>Hora ideal de saída para fechar 8h:</strong> <span class="positive">${pad(Math.floor(idealExit / 60))}:${pad(idealExit % 60)}</span></p>`;

      if (saldoInicial !== 0) {
        message += `<p><small>(Considerando saldo inicial de ${saldoInicial >= 0 ? '+' : '-'}${formatHhMmin(Math.abs(saldoInicial))})</small></p>`;
      }
    } else {
      message = '<p>Preencha pelo menos os três primeiros campos corretamente.</p>';
    }

    setResultado(message);
  };

  const limparResultado = (): void => {
    setResultado('');
  };

  return {
    resultado,
    setResultado,
    calcular,
    limparResultado,
  };
};

export default useCalcular;
