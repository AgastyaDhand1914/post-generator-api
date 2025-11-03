export function validateTextFields(obj: Record<string, any>, fields: string[]) {
  const gibberishPattern = /^[a-zA-Z0-9\s.,'’"-]+$/; //allows readable characters
  const vowels = /[aeiou]/i;

  const invalid: string[] = [];

  for (const field of fields) {
    const val = (obj[field] || "").trim();

    if (!val) continue;

    const tooShort = val.length < 2;
    const tooLong = val.length > 150;
    const hasFewVowels = (val.match(vowels) || []).length < val.length / 10;  
    const looksGibberish = !gibberishPattern.test(val);

    //mark invalid only if multiple red flags trigger
    if ((tooShort || tooLong || hasFewVowels) && looksGibberish) {
      invalid.push(field);
    }
  }

  if (invalid.length > 0) {
    const err = new Error(`Invalid or nonsensical input in fields: ${invalid.join(", ")}`);
    throw err;
  }
}