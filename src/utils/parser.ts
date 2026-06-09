import { isValidTime, pad } from './time';

export const parseSaldo = (input: string): number => {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return 0;

  const sign = normalized.startsWith('-') ? -1 : 1;
  const clean = normalized.replace(/^-/, '');

  const hhMM = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (hhMM) {
    return sign * (parseInt(hhMM[1], 10) * 60 + parseInt(hhMM[2], 10));
  }

  const hoursAndMinutes = clean.match(/^(?:(\d+)h)?\s*(?:(\d+)min)?$/);
  if (hoursAndMinutes?.[1] || hoursAndMinutes?.[2]) {
    return sign * ((parseInt(hoursAndMinutes[1] ?? '0', 10) * 60) + parseInt(hoursAndMinutes[2] ?? '0', 10));
  }

  const numeric = parseInt(clean, 10);
  if (!Number.isNaN(numeric)) {
    return sign * (numeric <= 23 && clean.length <= 2 ? numeric * 60 : numeric);
  }

  return 0;
};

export const normalizeTimeInput = (value: string): string => {
  const trimmed = value.trim();
  const numeric = parseInt(trimmed, 10);

  if (Number.isNaN(numeric) || isValidTime(trimmed)) return trimmed;
  if (numeric <= 23 && trimmed.length <= 2) return `${pad(numeric)}:00`;
  if (numeric > 23) return `${pad(Math.floor(numeric / 60))}:${pad(numeric % 60)}`;

  return trimmed;
};

const TIME_REGEX = /\b([01]?\d|2[0-3])[:h]\s*:?\s*([0-5]\d)m?\b/gi;

export const extractTimes = (text: string): string[] =>
  Array.from(text.matchAll(TIME_REGEX), ([, hours, minutes]) =>
    `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
  );
