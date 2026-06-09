import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('imports times from mixed-case hh mm ss text in order', async () => {
  render(<App />);

  await userEvent.click(screen.getByRole('button', { name: /mostrar importar dados/i }));

  const sampleText = `08H 00M 00S

Clock in/out has been done

12h 16m 00s

Clock in/out has been done

14H 21M 00S`;

  await userEvent.type(screen.getByPlaceholderText(/horários/i), sampleText);
  await userEvent.click(screen.getByRole('button', { name: /importar horários/i }));

  expect(screen.getByDisplayValue('08:00')).toBeInTheDocument();
  expect(screen.getByDisplayValue('12:16')).toBeInTheDocument();
  expect(screen.getByDisplayValue('14:21')).toBeInTheDocument();
  expect(screen.getByText(/foram importados 3 horário/i)).toBeInTheDocument();
});
