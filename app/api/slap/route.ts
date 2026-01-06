import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Using a stable model that supports structured output. 
// If specific 'gemini-3' access is available, change this string.
const MODEL_NAME = "gemini-3-flash-preview";

const schema = {
    description: "Response containing raw analysis and philosophical advice",
    type: SchemaType.OBJECT,
    properties: {
        reality_check: {
            type: SchemaType.STRING,
            description: "A brutally honest, 1-2 sentence call out of the user's bias.",
            nullable: false,
        },
        philosophical_slap: {
            type: SchemaType.STRING,
            description: "A quote from a realist philosopher like Nietzsche or Cioran.",
            nullable: false,
        },
        prescription: {
            type: SchemaType.STRING,
            description: "One book recommendation to fix their mindset.",
            nullable: false,
        },
    },
    required: ["reality_check", "philosophical_slap", "prescription"],
};

const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema as any,
    },
});

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        if (text.split(' ').length > 150) { // Enforce rough limit server side too
            return NextResponse.json({ error: 'Text is too long (max ~100 words)' }, { status: 400 });
        }

        const prompt = `
      Analyze the following user input for cognitive biases (e.g., emotional reasoning, catastrophizing).
      Adopt a persona that is brutally honest, clinical, and unsympathetic. Do not hold back.
      
      User Input: "${text}"
      
      Provide the 3 separate fields as requested.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up potential markdown formatting if the model adds it (though json mode shouldn't)
        const cleanerJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const responseData = JSON.parse(cleanerJson);

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Error generating slap:', error);
        return NextResponse.json({ error: 'Failed to generate slap. Please try again.' }, { status: 500 });
    }
}
