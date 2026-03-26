import { TIME_REGEX } from "./regex";

const isValidTime = (time: string) => TIME_REGEX.test(time);

const generateSlots = (start: string, end: string, duration: number = 30) => {
  if (!isValidTime(start) || !isValidTime(end)) {
    throw new Error("Invalid time format (use HH:mm 24hr)");
  }

  const slots: string[] = [];

  let current = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (current < endTime) {
    const next = new Date(current.getTime() + duration * 60000); // minutes

    if (next > endTime) break;

    slots.push(
      `${current.toTimeString().slice(0, 5)} - ${next
        .toTimeString()
        .slice(0, 5)}`,
    );

    current = next;
  }

  return slots;
};

export default generateSlots;
