import React, { ChangeEvent } from 'react';

interface ImportSectionProps {
    importarTexto: string;
    setImportarTexto: React.Dispatch<React.SetStateAction<string>>;
    setEntrada1: React.Dispatch<React.SetStateAction<string>>;
    setSaida1: React.Dispatch<React.SetStateAction<string>>;
    setEntrada2: React.Dispatch<React.SetStateAction<string>>;
    setSaida2: React.Dispatch<React.SetStateAction<string>>;
    setResultado: React.Dispatch<React.SetStateAction<string>>;
}

const ImportSection: React.FC<ImportSectionProps> = ({
    importarTexto,
    setImportarTexto,
    setEntrada1,
    setSaida1,
    setEntrada2,
    setSaida2,
    setResultado,
}) => {
    const importarHorarios = (): void => {
        const regexHoras: RegExp = /\b([01]?\d|2[0-3]):[0-5]\d\b/g;
        const horas: string[] = importarTexto.match(regexHoras) || [];

        if (horas.length >= 1) setEntrada1(horas[0]);
        if (horas.length >= 2) setSaida1(horas[1]);
        if (horas.length >= 3) setEntrada2(horas[2]);
        if (horas.length >= 4) setSaida2(horas[3]);

        const msg: string = horas.length > 0
            ? `<p>Foram importados ${horas.length} horário(s).</p>`
            : `<p>Nenhum horário encontrado no texto.</p>`;

        setResultado(msg);
    };

    return (
        <div className="section">
            <div className="form-group">
                <textarea
                    id="importarTexto"
                    placeholder="Cole aqui o texto bruto com horários no formato HH:MM..."
                    value={importarTexto}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setImportarTexto(e.target.value)}
                ></textarea>
            </div>
            <div className="button-group">
                <button type="button" onClick={importarHorarios} style={{ padding: '10px 15px', fontSize: '14px', backgroundColor: 'var(--button-bg)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s ease, transform 0.1s ease', marginBottom: '10px' }}>Importar Horários</button>
                <button type="button" onClick={() => setImportarTexto('')} style={{ padding: '10px 15px', fontSize: '14px', backgroundColor: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s ease, transform 0.1s ease', marginBottom: '10px' }}>Limpar Dados Exportados</button>
            </div>
        </div>
    );
};

export default ImportSection;
