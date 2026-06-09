import { useEffect, useState } from 'react';
import { parseSaldo } from '../utils/parser';
import { clearStorage, loadStorage, saveStorage } from '../utils/storage';
import { formatHHMM } from '../utils/time';

const SALDO_STORAGE_KEY = 'saldoInicial' as const;

const useSaldoInicial = () => {
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [saldoDisplay, setSaldoDisplay] = useState('');

  useEffect(() => {
    const stored = parseInt(loadStorage(SALDO_STORAGE_KEY), 10) || 0;
    setSaldoInicial(stored);
    setSaldoDisplay(stored === 0 ? '' : formatHHMM(stored));
  }, []);

  useEffect(() => {
    saveStorage(SALDO_STORAGE_KEY, saldoInicial.toString());
  }, [saldoInicial]);

  const handleSaldoBlur = (): void => {
    const parsed = parseSaldo(saldoDisplay);
    setSaldoInicial(parsed);
    setSaldoDisplay(parsed === 0 ? '' : formatHHMM(parsed));
  };

  const resetSaldoInicial = (): void => {
    setSaldoInicial(0);
    setSaldoDisplay('');
    clearStorage([SALDO_STORAGE_KEY]);
  };

  return {
    saldoInicial,
    saldoDisplay,
    setSaldoDisplay,
    handleSaldoBlur,
    resetSaldoInicial,
  };
};

export default useSaldoInicial;
