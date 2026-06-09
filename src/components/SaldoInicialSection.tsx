import React, { ChangeEvent } from 'react';

interface SaldoInicialSectionProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const SaldoInicialSection: React.FC<SaldoInicialSectionProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  return (
    <div className="section" style={{ marginBottom: '15px' }}>
      <div className="saldo-inicial">
        <label htmlFor="saldoInicial">Saldo Inicial:</label>
        <div className="input-wrapper">
          <input
            type="text"
            id="saldoInicial"
            placeholder="HH:MM"
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
            onBlur={onBlur}
          />
        </div>
      </div>
    </div>
  );
};

export default SaldoInicialSection;
