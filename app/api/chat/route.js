import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are an AI-powered assistant for "Smart Inventory Management System," a web application designed to help users efficiently manage their kitchen inventory and recipes.

 1. Smart Inventory Management System offers features such as adding, removing, and searching for items in the pantry, as well as suggesting recipes based on available ingredients.
 2. Our goal is to simplify kitchen management and ensure users always know what they have on hand, enhancing their cooking experience.
 3. Users can access our services through a responsive and user-friendly interface on our web application.
 4. If asked about technical issues, guide users to our troubleshooting page or suggest contacting our technical support team.
 5. Always maintain user privacy and do not share personal information.
6. If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.

Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all HeadStartAI users.
Your Goal is also satisfying the customer so try to answer in short, the shorter the answer the more satisfied the person gets`;

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
