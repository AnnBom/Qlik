import { GoogleGenAI, Type } from "@google/genai";
import { Dataset, FieldMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDataset = async (topic: string): Promise<{ data: Dataset; fields: FieldMetadata[] }> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `Generate a realistic dataset for business intelligence prototyping about: "${topic}".
  The dataset should have at least 20 rows.
  Include at least:
  - 1 Date field (ISO string YYYY-MM-DD)
  - 2 Categorical fields (Dimensions, e.g., Region, Product, Category)
  - 2 Numerical fields (Measures, e.g., Sales, Cost, Quantity)
  
  Return ONLY the JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fields: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['string', 'number', 'date'] }
                },
                required: ['name', 'type']
              }
            },
            data: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                // We leave properties open-ended as we don't know the exact schema upfront
                nullable: false
              }
            }
          },
          required: ['fields', 'data']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    
    const result = JSON.parse(text);
    return result;

  } catch (error) {
    console.error("Error generating dataset:", error);
    // Fallback data if API fails or user has no key (though key is required)
    return {
      fields: [
        { name: "Region", type: "string" },
        { name: "Product", type: "string" },
        { name: "Sales", type: "number" }
      ],
      data: [
        { Region: "North", Product: "A", Sales: 100 },
        { Region: "South", Product: "B", Sales: 200 },
        { Region: "North", Product: "B", Sales: 150 },
      ]
    };
  }
};