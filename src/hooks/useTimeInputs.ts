import { useEffect, useState } from 'react';
import { normalizeTimeInput } from '../utils/parser';
import { clearStorage, loadStorage, saveStorage } from '../utils/storage';

export type TimeField = 'entrada1' | 'saida1' | 'entrada2' | 'saida2';

export type TimeInputs = Record<TimeField, string>;

const TIME_STORAGE_KEYS = ['entrada1', 'saida1', 'entrada2', 'saida2'] as const;

const INITIAL_TIME_INPUTS: TimeInputs = {
  entrada1: '',
  saida1: '',
  entrada2: '',
  saida2: '',
};

const useTimeInputs = () => {
  const [timeInputs, setTimeInputs] = useState<TimeInputs>(INITIAL_TIME_INPUTS);

  useEffect(() => {
    setTimeInputs({
      entrada1: loadStorage('entrada1'),
      saida1: loadStorage('saida1'),
      entrada2: loadStorage('entrada2'),
      saida2: loadStorage('saida2'),
    });
  }, []);

  useEffect(() => {
    (Object.entries(timeInputs) as [TimeField, string][]).forEach(([key, value]) => {
      saveStorage(key, value);
    });
  }, [timeInputs]);

  const setTimeInput = (field: TimeField, value: string): void => {
    setTimeInputs((current) => ({ ...current, [field]: value }));
  };

  const handleTimeBlur = (field: TimeField): void => {
    setTimeInput(field, normalizeTimeInput(timeInputs[field]));
  };

  const resetTimeInputs = (): void => {
    setTimeInputs(INITIAL_TIME_INPUTS);
    clearStorage(TIME_STORAGE_KEYS);
  };

  return {
    timeInputs,
    setTimeInput,
    handleTimeBlur,
    resetTimeInputs,
  };
};

export default useTimeInputs;
