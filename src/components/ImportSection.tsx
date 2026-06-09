import React from 'react';
import { extractTimes } from '../utils/parser';

interface ImportSectionProps {
    importarTexto: string;
    setImportarTexto: (v: string) => void;
    setEntrada1: (v: string) => void;
    setSaida1:   (v: string) => void;
    setEntrada2: (v: string) => void;
    setSaida2:   (v: string) => void;
    setResultado: (v: string) => void;
}

const btnStyle = (bg: string): React.CSSProperties => ({
    padding: '10px 15px',
    fontSize: '14px',
    backgroundColor: bg,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    marginBottom: '10px',
});

const ImportSection: React.FC<ImportSectionProps> = ({
    importarTexto,
    setImportarTexto,
    setEntrada1,
    setSaida1,
    setEntrada2,
    setSaida2,
    setResultado,
}) => {
    const handleImport = () => {
        const [e1, s1, e2, s2] = extractTimes(importarTexto);

        if (e1) setEntrada1(e1);
        if (s1) setSaida1(s1);
        if (e2) setEntrada2(e2);
        if (s2) setSaida2(s2);

        const count = [e1, s1, e2, s2].filter(Boolean).length;
        setResultado(
            count > 0
                ? `<p>Foram importados ${count} horário(s).</p>`
                : `<p>Nenhum horário encontrado no texto.</p>`
        );
    };

    return (
        <div className="section">
            <div className="form-group">
                <textarea
                    id="importarTexto"
                    placeholder="Cole aqui o texto bruto com horários (HH:MM ou 08h 00m 00s)..."
                    value={importarTexto}
                    onChange={e => setImportarTexto(e.target.value)}
                />
            </div>
            <div className="button-group">
                <button onClick={handleImport} style={btnStyle('var(--button-bg)')}>
                    Importar Horários
                </button>
                <button onClick={() => setImportarTexto('')} style={btnStyle('var(--secondary)')}>
                    Limpar Dados Exportados
                </button>
            </div>
        </div>
    );
};

export default ImportSection;
