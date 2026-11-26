import type { ContactMethod, HallId } from "@/content/site";

export type BookingState = {
  hallId: HallId | null;
  date: string | null;
  time: number | null;
  duration: number;
  options: string[];
  name: string;
  phone: string;
  method: ContactMethod;
  comment: string;
  agree: boolean;
};

export type Field = "name" | "phone" | "agree";

export type StepProps = {
  s: BookingState;
  update: (patch: Partial<BookingState>) => void;
};
