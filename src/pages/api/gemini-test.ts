/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"prompt":"help"}' \
  http://localhost:4321/api/testbot
*/

// Google AI Studio

import type { APIRoute } from "astro";

import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'

const genAI = new GoogleGenerativeAI(process.env['GOOGLE_GENERATIVE_AI_KEY'] || '');

export const POST: APIRoute = async ({ params, request }) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: "Hello, I have 2 dogs in my house.",
      },
      {
        role: "model",
        parts: "Great to meet you. What would you like to know?",
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  try {
    const message = 'How many paws are in my house?';
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify(text));
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify(e), { status: 500 });
  }
};
