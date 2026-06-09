import React, { ChangeEvent } from 'react';
import { TimeField, TimeInputs } from '../hooks/useTimeInputs';

interface TimeInputsSectionProps {
  timeInputs: TimeInputs;
  onTimeChange: (field: TimeField, value: string) => void;
  onTimeBlur: (field: TimeField) => void;
  onCalcular: () => void;
  onLimpar: () => void;
}

const renderTimeField = (
  id: TimeField,
  label: string,
  value: string,
  onChange: (field: TimeField, value: string) => void,
  onBlur: (field: TimeField) => void,
  placeholder = 'HH:MM'
) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(id, event.target.value)}
      onBlur={() => onBlur(id)}
    />
  </div>
);

const TimeInputsSection: React.FC<TimeInputsSectionProps> = ({
  timeInputs,
  onTimeChange,
  onTimeBlur,
  onCalcular,
  onLimpar,
}) => {
  return (
    <div className="section">
      <div className="section-title">Registrar Horários</div>
      <div className="time-inputs">
        {renderTimeField('entrada1', '1ª Entrada:', timeInputs.entrada1, onTimeChange, onTimeBlur)}
        {renderTimeField('saida1', '1ª Saída:', timeInputs.saida1, onTimeChange, onTimeBlur)}
        {renderTimeField('entrada2', '2ª Entrada:', timeInputs.entrada2, onTimeChange, onTimeBlur)}
        {renderTimeField('saida2', '2ª Saída:', timeInputs.saida2, onTimeChange, onTimeBlur, 'HH:MM (opcional)')}
      </div>
      <div className="button-group">
        <button className="button-primary" onClick={onCalcular}>
          Calcular
        </button>
        <button className="button-secondary" onClick={onLimpar}>
          Limpar
        </button>
      </div>
    </div>
  );
};

export default TimeInputsSection;
