export const pad = (value: number): string => value.toString().padStart(2, '0');

export const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const isValidTime = (time: string): boolean => /^\d{1,2}:\d{2}$/.test(time);

export const formatHHMM = (minutes: number): string => {
  const sign = minutes < 0 ? '-' : '';
  const absolute = Math.abs(minutes);
  return `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
};

export const formatHhMmin = (minutes: number): string => {
  const sign = minutes < 0 ? '-' : '';
  const absolute = Math.abs(minutes);
  return `${sign}${Math.floor(absolute / 60)}h${pad(absolute % 60)}min`;
};
