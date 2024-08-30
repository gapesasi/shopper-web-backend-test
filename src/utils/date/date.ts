import {
  endOfMonth,
  format,
  parseISO,
  startOfMonth
} from "date-fns";

export const parseStringToDateTime = (date: string): Date => {
  return new Date(format(parseISO(date), "yyyy-MM-dd'T'HH:mm:ss"));
};

export type MonthRange = {
  start: Date;
  end: Date;
};

export const returnMonthRange = (date: Date): MonthRange => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return {
    start,
    end,
  };
};