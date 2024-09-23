// /app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import Configuration from "openai";
import OpenAIApi from "openai";

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const { prompt } = await request.json();

    // Retrieve the OpenAI API key from environment variables
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);

    // Make a request to OpenAI's Completion API
    const response = await openai.createCompletion({
      model: "o1-mini", // You can use the model of your choice
      prompt: "2+2=?",
      max_tokens: 150, // Adjust as needed
    });
    console.log("AI response", response);

    return NextResponse.json(response.data);

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    // Parse the response from OpenAI
    const data = await response.json();

    // Return the OpenAI response to the client
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in /api/chat route:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
