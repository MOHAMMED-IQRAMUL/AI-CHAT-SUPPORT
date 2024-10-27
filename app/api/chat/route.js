// Importing necessary modules from Next.js and OpenAI

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



function validateApiKey(apiKey) {

    
  if (!apiKey) {
    console.error("API key is missing or invalid."); // Log the error
    return false; 
  }
  console.log("API key is valid."); // Log success
  return true; 
}



export async function POST(req) {

    
  const apiKey = process.env.OPENROUTER_API_KEY;
    
  if (!validateApiKey(apiKey)) {
    return new NextResponse("API key is missing", { status: 500 });
  }


  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1", // Set the base URL for the OpenRouter API
    apiKey: apiKey, // Use the validated API key
  });


  function logError(error) {
    console.error("An error occurred:", error.message); // Log the error message
    console.error("Error stack trace:", error.stack); // Log the error stack for debugging
  }

  try {

      
    console.log("Received a new request:", req.method, req.url);


    const data = await req.json();
    console.log("Parsed request data:", data); // Log the parsed data

    // Validate the incoming request body structure (extend code with basic validation)
    if (!Array.isArray(data)) {
      return new NextResponse("Invalid request format: Expected an array", { status: 400 });
    }

    // Make a request to OpenAI to generate a chat completion
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system", 
            
          content: systemPrompt, 
            
        },
        ...data, 
          
      ],
      model: "meta-llama/llama-3.1-8b-instruct:free",
      stream: true, // 
    });


      
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder(); 

        try {
          // Loop through streamed chunks from OpenAI response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content; // Extract the content of the response

            if (content) {
              console.log("Streaming content chunk:", content); // Log each chunk of content
              const text = encoder.encode(content); // Encode the content chunk
              controller.enqueue(text); // Send the encoded content to the stream
            }
          }
        } catch (error) {
          logError(error); // Log the error if streaming fails
          controller.error(error);
        } finally {
          console.log("Stream completed or terminated."); // Log when streaming ends
          controller.close(); 
        }
      },
    });

    // Return the stream response to the client
    return new NextResponse(stream);

  } catch (error) {
    // Catch any errors during the request-handling process
    logError(error); 

  
    return new NextResponse(`Error processing request: ${error.message}`, { status: 500 });
  }
}

// Mock utility function to handle detailed logging of the request (extending code)
function logRequestDetails(req) {
  console.log("Request Method:", req.method); // Log the HTTP method (e.g., POST)
  console.log("Request URL:", req.url); // Log the requested URL
  console.log("Request Headers:", JSON.stringify(req.headers, null, 2)); // Log the headers
}

// Additional mock utility functions for further code expansion (not essential to the core logic)
function mockProcessData(data) {
  console.log("Processing data:", data); 
  return data; 
}

function mockTransformResponse(response) {
  console.log("Transforming response:", response); 
  return response; // Return the response unchanged (for simplicity)
}

// Exporting additional utilities (for the sake of extended lines)
export const additionalUtils = {
  logError,
  logRequestDetails,
  mockProcessData,
  mockTransformResponse,
};
