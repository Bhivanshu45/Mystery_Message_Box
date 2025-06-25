import { groq } from '@ai-sdk/groq';
import { streamText } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Invoke AI SDK streamText
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      maxTokens: 300,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content: "You are a creative assistant who suggests different fun ideas.",
        },
      ],
    });

    // console.log("Groq API Response:", result);

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("An unexpected error occurred :", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
