import React, { useState, ChangeEvent, useEffect } from 'react';
import ImportSection from './components/ImportSection';
import './App.css';

interface TimeInputs {
  entrada1: string;
  saida1: string;
  entrada2: string;
  saida2: string;
}

const JORNADA_MINUTOS = 8 * 60;
const TOLERANCIA_MINUTOS = 10;
const STORAGE_KEYS = {
  entrada1: 'entrada1',
  saida1: 'saida1',
  entrada2: 'entrada2',
  saida2: 'saida2',
  saldoInicial: 'saldoInicial',
} as const;

function App(): React.JSX.Element {
  const [timeInputs, setTimeInputs] = useState<TimeInputs>({
    entrada1: '',
    saida1: '',
    entrada2: '',
    saida2: '',
  });
  const [saldoInicial, setSaldoInicial] = useState<number>(0);
  const [saldoInicialDisplay, setSaldoInicialDisplay] = useState<string>('');
  const [importarTexto, setImportarTexto] = useState<string>('');
  const [resultado, setResultado] = useState<string>('');
  const [showImportSection, setShowImportSection] = useState<boolean>(false);

  const parseTimeInputToMinutes = (input: string): number => {
    const trimmedInput = input.trim().toLowerCase();

    const timeMatch = trimmedInput.match(/^(\d{1,2}):(\d{2})$/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      return hours * 60 + minutes;
    }

    const hhMminMatch = trimmedInput.match(/^(?:(\d+)h)?(?:\s*(\d+)min)?$/);
    if (hhMminMatch) {
      const hours = hhMminMatch[1] ? parseInt(hhMminMatch[1]) : 0;
      const minutes = hhMminMatch[2] ? parseInt(hhMminMatch[2]) : 0;
      return hours * 60 + minutes;
    }

    const rawMinutes = parseInt(trimmedInput);
    if (!isNaN(rawMinutes)) {
      return rawMinutes;
    }

    return 0;
  };

  const formatMinutesToHhMmin = (mins: number): string => {
    const sign = mins < 0 ? '-' : '';
    const absMins = Math.abs(mins);
    const h = Math.floor(absMins / 60);
    const m = absMins % 60;
    return `${sign}${h}h${m.toString().padStart(2, '0')}min`;
  };

  const timeToMinutes = (t: string): number => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const isValidTime = (t: string): boolean => {
    return /^\d{1,2}:\d{2}$/.test(t);
  };

  useEffect(() => {
    const loadFromStorage = (key: keyof typeof STORAGE_KEYS): string | null => {
      return localStorage.getItem(STORAGE_KEYS[key]);
    };

    setTimeInputs({
      entrada1: loadFromStorage('entrada1') || '',
      saida1: loadFromStorage('saida1') || '',
      entrada2: loadFromStorage('entrada2') || '',
      saida2: loadFromStorage('saida2') || '',
    });

    const savedSaldoInicial = loadFromStorage('saldoInicial');
    if (savedSaldoInicial) {
      const minutes = parseInt(savedSaldoInicial) || 0;
      setSaldoInicial(minutes);
      setSaldoInicialDisplay(minutes === 0 ? '' : formatMinutesToHhMmin(minutes));
    }
  }, []);

  useEffect(() => {
    Object.entries(timeInputs).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }, [timeInputs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.saldoInicial, saldoInicial.toString());
  }, [saldoInicial]);

  const updateTimeInput = (field: keyof TimeInputs, value: string): void => {
    setTimeInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatTimeInputOnBlur = (value: string, field: keyof TimeInputs): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 23 && value.length <= 2) {
      updateTimeInput(field, numValue.toString().padStart(2, '0') + ':00');
    }
  };

  const calcular = (): void => {
    const { entrada1, saida1, entrada2, saida2 } = timeInputs;
    let minutosTrabalhados = 0;
    let msg = '';

    if (isValidTime(entrada1) && isValidTime(saida1)) {
      minutosTrabalhados += timeToMinutes(saida1) - timeToMinutes(entrada1);
    }

    if (isValidTime(entrada2) && isValidTime(saida2)) {
      minutosTrabalhados += timeToMinutes(saida2) - timeToMinutes(entrada2);
      let saldoCalculado = minutosTrabalhados - JORNADA_MINUTOS + saldoInicial;

      const saldo = saldoCalculado < 0 && Math.abs(saldoCalculado) <= TOLERANCIA_MINUTOS ? 0 : saldoCalculado;
      const saldoClass = saldo > 0 ? 'positive' : saldo < 0 ? 'negative' : 'neutral';
      const saldoSymbol = saldo >= 0 ? '+' : '-';

      msg += `<p><strong>Total trabalhado:</strong> ${formatMinutesToHhMmin(minutosTrabalhados)}</p>`;

      if (saldoInicial !== 0) {
        const saldoInicialClass = saldoInicial > 0 ? 'positive' : saldoInicial < 0 ? 'negative' : 'neutral';
        msg += `<p><strong>Saldo inicial:</strong> <span class="${saldoInicialClass}">${saldoInicial >= 0 ? '+' : '-'}${formatMinutesToHhMmin(Math.abs(saldoInicial))}</span></p>`;
      }

      msg += `<p><strong>Saldo final:</strong> <span class="${saldoClass}">${saldoSymbol}${formatMinutesToHhMmin(Math.abs(saldo))}</span></p>`;
    } else if (isValidTime(entrada2) && !saida2) {
      const minutosRestantes = JORNADA_MINUTOS - minutosTrabalhados - saldoInicial;
      const horaSaidaIdeal = timeToMinutes(entrada2) + minutosRestantes;
      const hora = Math.floor(horaSaidaIdeal / 60);
      const minuto = horaSaidaIdeal % 60;

      msg = `<p><strong>Hora ideal de saída para fechar 8h:</strong> <span class="positive">${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}</span></p>`;

      if (saldoInicial !== 0) {
        msg += `<p><small>(Considerando saldo inicial de ${saldoInicial >= 0 ? '+' : '-'}${formatMinutesToHhMmin(Math.abs(saldoInicial))})</small></p>`;
      }
    } else {
      msg = '<p>Preencha pelo menos os três primeiros campos corretamente.</p>';
    }

    setResultado(msg);
  };

  const limparCampos = (): void => {
    setTimeInputs({
      entrada1: '',
      saida1: '',
      entrada2: '',
      saida2: '',
    });
    setImportarTexto('');
    setResultado('');
    setSaldoInicial(0);
    setSaldoInicialDisplay('');

    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  };

  return (
    <div className="container">

      <h2>Controle de Banco de Horas</h2>

      <div className="section" style={{ marginBottom: '15px' }}>
        <div className="saldo-inicial">
          <label htmlFor="saldoInicial">Saldo Inicial:</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="saldoInicial"
              placeholder="HH:MM ou MM"
              value={saldoInicialDisplay}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSaldoInicialDisplay(e.target.value)}
              onBlur={() => {
                const minutes = parseTimeInputToMinutes(saldoInicialDisplay);
                setSaldoInicial(minutes);
                setSaldoInicialDisplay(minutes === 0 ? '' : formatMinutesToHhMmin(minutes));
              }}
            />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Registrar Horários</div>
        <div className="time-inputs">
          <div className="form-group">
            <label htmlFor="entrada1">1ª Entrada:</label>
            <input
              type="text"
              id="entrada1"
              placeholder="HH:MM"
              value={timeInputs.entrada1}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateTimeInput('entrada1', e.target.value)}
              onBlur={() => formatTimeInputOnBlur(timeInputs.entrada1, 'entrada1')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="saida1">1ª Saída:</label>
            <input
              type="text"
              id="saida1"
              placeholder="HH:MM"
              value={timeInputs.saida1}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateTimeInput('saida1', e.target.value)}
              onBlur={() => formatTimeInputOnBlur(timeInputs.saida1, 'saida1')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="entrada2">2ª Entrada:</label>
            <input
              type="text"
              id="entrada2"
              placeholder="HH:MM"
              value={timeInputs.entrada2}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateTimeInput('entrada2', e.target.value)}
              onBlur={() => formatTimeInputOnBlur(timeInputs.entrada2, 'entrada2')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="saida2">2ª Saída:</label>
            <input
              type="text"
              id="saida2"
              placeholder="HH:MM (opcional)"
              value={timeInputs.saida2}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateTimeInput('saida2', e.target.value)}
              onBlur={() => formatTimeInputOnBlur(timeInputs.saida2, 'saida2')}
              title="Deixe vazio para calcular a hora de saída ideal."
            />
          </div>
        </div>

        <div className="button-group">
          <button type="button" className="button-primary" onClick={calcular}>Calcular</button>
          <button type="button" className="button-secondary" onClick={limparCampos}>Limpar</button>
        </div>
      </div>

      <button 
        type="button" 
        className="button-secondary" 
        onClick={() => setShowImportSection(!showImportSection)} 
        style={{ display: 'block', maxWidth: '400px', margin: '0 auto 25px auto', padding: '14px 20px', fontSize: '16px' }}
      >
        {showImportSection ? 'Esconder Importar Dados' : 'Mostrar Importar Dados'}
      </button>

      {showImportSection && (
        <ImportSection
          importarTexto={importarTexto}
          setImportarTexto={setImportarTexto}
          setEntrada1={(value) => {
            if (typeof value === 'function') {
              setTimeInputs(prev => ({ ...prev, entrada1: value(prev.entrada1) }));
            } else {
              updateTimeInput('entrada1', value);
            }
          }}
          setSaida1={(value) => {
            if (typeof value === 'function') {
              setTimeInputs(prev => ({ ...prev, saida1: value(prev.saida1) }));
            } else {
              updateTimeInput('saida1', value);
            }
          }}
          setEntrada2={(value) => {
            if (typeof value === 'function') {
              setTimeInputs(prev => ({ ...prev, entrada2: value(prev.entrada2) }));
            } else {
              updateTimeInput('entrada2', value);
            }
          }}
          setSaida2={(value) => {
            if (typeof value === 'function') {
              setTimeInputs(prev => ({ ...prev, saida2: value(prev.saida2) }));
            } else {
              updateTimeInput('saida2', value);
            }
          }}
          setResultado={setResultado}
        />
      )}

      <div id="resultado" dangerouslySetInnerHTML={{ __html: resultado }}></div>
    </div>
  );
}

export default App;