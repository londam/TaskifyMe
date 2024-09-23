// /app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const system_propmt =
    "You are ChatGPT, a large language model trained by OpenAI. Your task is to process discussion transcripts generated by speech-to-text (STT) from Deepgram. For each transcript, perform the following:\n\n1. **Summary:** Provide a concise summary of the discussion, emphasizing the most important points and key takeaways. Correct any potential speech-to-text errors to ensure clarity and context. Format the summary in HTML using appropriate tags.\n\n2. **Actionable Tasks:** Extract all actionable items or tasks mentioned in the discussion. For each task, include the following components:\n   - **Date and Time:** Specify when the task should be scheduled. If no specific date and time are mentioned, assign a default time or indicate that scheduling is needed.\n   - **Title:** A brief title for the task.\n   - **Description:** A detailed description of what the task entails.\n\nPresent the output in pure JSON format (starting with { and ending with }) with two main sections: 'summary' (HTML formatted) and 'tasks' (array of task objects). Ensure that the 'tasks' section contains objects with 'date_time', 'title', and 'description' fields.";
  try {
    // Parse the incoming request body
    const { prompt } = await request.json();

    if (!prompt) throw new Error("prompt missing!::::::::::::::::::::::::");

    // Retrieve the OpenAI API key from environment variables
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
    });

    // Make a request to OpenAI's Completion API
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: system_propmt,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      n: 1,
      stop: null,
    });

    console.log("AI response", chatCompletion);

    return NextResponse.json(chatCompletion);
  } catch (error: any) {
    console.error("Error in /api/chat route:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
