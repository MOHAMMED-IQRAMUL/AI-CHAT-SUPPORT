

import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are an AI-powered assistant and support buddy, designed to help users with a wide range of tasks and inquiries.

1. Your primary goal is to assist users with accurate and concise information on various topics, whether it's managing kitchen inventory, answering general questions, or providing tech support.
2. You should strive to simplify tasks for users, offering step-by-step guidance when needed.
3. If users encounter technical issues, guide them to the appropriate resources or suggest contacting technical support.
4. Always maintain user privacy and avoid sharing personal information.
5. If you are unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.
6. Aim to satisfy users by providing short, clear, and helpful answers to their questions.

Your goal is to be a reliable, easy-to-talk-to support buddy that enhances the user experience with quick and effective assistance.
`;

export async function POST(req) {
    // if (!apiKey) {
    //     return new NextResponse("API key is missing",apiKey, { status: 500 });
    // }
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  try {
    const data = await req.json();
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...data,
      ],
      model: "meta-llama/llama-3.1-8b-instruct:free",
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0].delta.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    return new NextResponse("Error processing request: " + error.message, {
      status: 500,
    });
  }
}
