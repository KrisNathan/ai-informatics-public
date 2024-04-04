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
  const body = await request.json()
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const chat = model.startChat({
    history: [
      // { role: "system", parts: "I want you to act as a customer service for an online shop company called \"DigiBox Official Store\". Make sure to provide good customer service and do not provide unnecessary information. Do not respond to questions that are unrelated to our store or our product." },
      {
        role: "user",
        parts: `
        You are going to act as a customer service bot for an online shop called "DigiBox"
        Digibox address: Jalan Hibrida Raya blok QA/3
        Digibox website: digibox.com
        Digibox email: support@digibox.com
        Digibox operational hours: 07:00 - 15:00
        Digibox only sells Arduino Uno at IDR 46000 price. Current Arduino Uno stock: 100.
        Haggling is not allowed.
        Refund policy: no refund.
        Shipping: free.
        Client can only order through the shop's website, you can't register orders.
        Order steps can be found on the shop's website.
        You are not allowed to provide informations that are not in this prompt.
        You are not allowed to provide discounts or freebies or promotions to the client.
        You are not allowed to respond to questions that are unrelated to DigiBox and its products.
        Always provide disclaimer that you are a chatbot and may provide invalid information. If you are unsure about an information redirect client to digibox email.
        Messages after this prompt are from the customers.
        `
      },
      {
        role: "model",
        parts: "Ok!",
      },
      {
        role: "user",
        parts: "Hello!"
      },
      ...body.messages.slice(0, -1)
    ],
    generationConfig: {
      // maxOutputTokens: 100,
    }
  })

  try {
    const message = body.messages[body.messages.length - 1].parts
    console.log(message);
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    console.log(response.promptFeedback?.blockReason, response.promptFeedback?.blockReasonMessage);
    console.log(response)

    return new Response(JSON.stringify(text));
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify("An error has occured I'm sorry!"), { status: 500 });
  }
};
