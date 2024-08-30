export const returnPrompt = (measure_type: string) => {
  const measurer = measure_type === "WATER" ? "hidrometer" : "manometer";
  return `
    Tell me the numeric sequence displayed on the screen following the instructions below.

    - DO NOT ADD ANY OTHER CARACTERS TO THE PROMPT;
    - I will send you a photo of a ${measurer}, which can be analog or digital;
    - The numeric sequence probably has a m³ or m³/h identification near it;
    - The m³ or m³/h identification is not a part of the numeric sequence, do not send it to me;
    - The first FIVE digits are black or are covered around with black;
    - The last THREE or TWO digits are red or are covered around with red;
    - If a digit is divided between it and the next digit, NEVER CONSIDER TWO DIGITS AS ONE;
    - If a digit is divided between it and the next digit, consider ONLY the digit that is more visible;
    - YOU SHOULD NOT BREAK ANY OF THESE RULES;
    `;
};
