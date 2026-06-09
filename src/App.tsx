import React, { useState } from 'react';
import './App.css';
import ImportSection from './components/ImportSection';
import SaldoInicialSection from './components/SaldoInicialSection';
import TimeInputsSection from './components/TimeInputsSection';
import useCalcular from './hooks/useCalcular';
import useSaldoInicial from './hooks/useSaldoInicial';
import useTimeInputs from './hooks/useTimeInputs';

function App(): React.JSX.Element {
  const [mostrarImportacao, setMostrarImportacao] = useState(false);
  const [textoImportacao, setTextoImportacao] = useState('');

  const { timeInputs, setTimeInput, handleTimeBlur, resetTimeInputs } = useTimeInputs();
  const { saldoDisplay, setSaldoDisplay, handleSaldoBlur, resetSaldoInicial, saldoInicial } = useSaldoInicial();
  const { resultado, calcular, limparResultado, setResultado } = useCalcular(timeInputs, saldoInicial);

  const limparTudo = (): void => {
    resetTimeInputs();
    resetSaldoInicial();
    limparResultado();
    setTextoImportacao('');
  };

  return (
    <div className="container">
      <h2>Controle de Banco de Horas</h2>

      <SaldoInicialSection
        value={saldoDisplay}
        onChange={setSaldoDisplay}
        onBlur={handleSaldoBlur}
      />

      <TimeInputsSection
        timeInputs={timeInputs}
        onTimeChange={setTimeInput}
        onTimeBlur={handleTimeBlur}
        onCalcular={calcular}
        onLimpar={limparTudo}
      />

      <button
        className="button-secondary"
        onClick={() => setMostrarImportacao((visivel) => !visivel)}
        style={{ display: 'block', maxWidth: '400px', margin: '0 auto 25px auto', padding: '14px 20px', fontSize: '16px' }}
      >
        {mostrarImportacao ? 'Esconder Importar Dados' : 'Mostrar Importar Dados'}
      </button>

      {mostrarImportacao && (
        <ImportSection
          importarTexto={textoImportacao}
          setImportarTexto={setTextoImportacao}
          setEntrada1={(valor) => setTimeInput('entrada1', valor)}
          setSaida1={(valor) => setTimeInput('saida1', valor)}
          setEntrada2={(valor) => setTimeInput('entrada2', valor)}
          setSaida2={(valor) => setTimeInput('saida2', valor)}
          setResultado={setResultado}
        />
      )}

      <div id="resultado" dangerouslySetInnerHTML={{ __html: resultado }} />
    </div>
  );
}

export default App;
