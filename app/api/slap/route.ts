import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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

// Create a new ratelimiter, that allows 5 requests per 24 hours
const ratelimit = new Ratelimit({
    redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL || 'https://mock-url-for-build',
        token: process.env.UPSTASH_REDIS_REST_TOKEN || 'mock-token',
    }),
    limiter: Ratelimit.slidingWindow(5, "1d"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { success } = await ratelimit.limit(userId);

        if (!success) {
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

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
