import ai from "../config/gemini.js";
import { allowedDansalTypes } from "../constants/allowedDansal.js";
import ApiError from "../utils/api-error.js";

export const analyzeDansalName = async (dansalName) => {
  try {
    const prompt = `
Classify this Dansal type into exactly one allowed value.

Allowed values: ${allowedDansalTypes.join(", ")}

Input: "${dansalName}"

Rules:
- Return only one allowed value.
- Understand Sinhala, English, variations, and common spelling mistakes.
- If no clear match, return "other".
- input can include extra words ,so predict most suitable allowed value i given
`;
    const response = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });
    console.log("gemini result", response);
    const result = response.output_text.trim();
    if (!allowedDansalTypes.includes(result)) {
      return "other";
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to classify Dansal type", "GEMINI_ERROR");
  }
};
