import OpenAI from 'openai';

export interface ExtractedMedicineInfo {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  confidence: number;
}

export interface PrescriptionAnalysisResult {
  medicines: ExtractedMedicineInfo[];
  doctorName?: string;
  clinicName?: string;
  prescriptionDate?: string;
  notes?: string;
  rawAnalysis: string;
}

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

const PRESCRIPTION_ANALYSIS_PROMPT = `You are a pharmaceutical AI assistant. Analyze the prescription image and extract medication information.

Extract the following for EACH medication listed:
1. Medicine name (generic and/or brand name)
2. Dosage (e.g., 500mg, 2ml)
3. Frequency (e.g., twice daily, once at night)
4. Duration (if mentioned, e.g., 7 days, 1 month)
5. Special instructions (if any, e.g., with food, before bed)

Also extract:
- Doctor's name (if visible)
- Clinic/hospital name (if visible)
- Prescription date (if visible)
- Any special notes or allergies mentioned

Return ONLY valid JSON with this structure (no markdown):
{
  "medicines": [
    {
      "medicineName": "string",
      "dosage": "string",
      "frequency": "string",
      "duration": "string or null",
      "instructions": "string or null",
      "confidence": 0.95
    }
  ],
  "doctorName": "string or null",
  "clinicName": "string or null",
  "prescriptionDate": "string or null",
  "notes": "string or null",
  "rawAnalysis": "Brief summary of analysis"
}

If you cannot read the prescription clearly, indicate low confidence scores. Always be conservative with confidence levels.`;

export async function analyzePrescriptionImage(
  imageBase64: string,
  imageMediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'
): Promise<PrescriptionAnalysisResult> {
  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: PRESCRIPTION_ANALYSIS_PROMPT,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${imageMediaType};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content || '';

    // Parse the JSON response
    let analysisResult: PrescriptionAnalysisResult;
    try {
      analysisResult = JSON.parse(responseText);
    } catch (e) {
      // If JSON parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[1]);
      } else {
        // If still can't parse, create a fallback response
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    return analysisResult;
  } catch (error: any) {
    console.error('AI Analyzer Error:', error);
    throw new Error(
      `Failed to analyze prescription: ${error.message || 'Unknown error'}`
    );
  }
}

export async function matchMedicinesWithDatabase(
  extractedMedicines: ExtractedMedicineInfo[],
  availableMedicines: Array<{
    id: string;
    nameBn: string;
    nameEn: string;
    strength?: string;
    dosageForm?: string;
  }>
): Promise<
  Array<{
    extracted: ExtractedMedicineInfo;
    matchedMedicineId?: string;
    matchedMedicineName?: string;
    confidence: number;
  }>
> {
  return extractedMedicines.map((extracted) => {
    const normalizedExtracted = extracted.medicineName.toLowerCase().trim();

    let bestMatch = {
      id: undefined as string | undefined,
      name: undefined as string | undefined,
      score: 0,
    };

    for (const medicine of availableMedicines) {
      const normalizedBn = medicine.nameBn.toLowerCase().trim();
      const normalizedEn = medicine.nameEn.toLowerCase().trim();

      // Simple similarity check - look for substring matches or exact matches
      let score = 0;

      if (normalizedExtracted === normalizedBn || normalizedExtracted === normalizedEn) {
        score = 1;
      } else if (
        normalizedBn.includes(normalizedExtracted) ||
        normalizedEn.includes(normalizedExtracted) ||
        normalizedExtracted.includes(normalizedBn) ||
        normalizedExtracted.includes(normalizedEn)
      ) {
        score = 0.8;
      } else if (
        normalizedBn.split(' ')[0] === normalizedExtracted.split(' ')[0] ||
        normalizedEn.split(' ')[0] === normalizedExtracted.split(' ')[0]
      ) {
        score = 0.6;
      }

      if (score > bestMatch.score) {
        bestMatch = {
          id: medicine.id,
          name: medicine.nameEn,
          score,
        };
      }
    }

    return {
      extracted,
      matchedMedicineId: bestMatch.id,
      matchedMedicineName: bestMatch.name,
      confidence: bestMatch.score * extracted.confidence,
    };
  });
}
