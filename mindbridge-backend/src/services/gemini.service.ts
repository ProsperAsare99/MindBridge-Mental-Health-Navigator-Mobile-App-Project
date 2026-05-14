import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiRepository } from "../repositories/ai.repository.js";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "");

const SYSTEM_PROMPT = `
You are the MindBridge Oracle, a wise, empathetic, and non-judgmental AI companion for university students, specifically optimized for the diverse Ghanaian context. 
Your goal is to provide emotional support, reflection, and guidance through the "Soft Luxury" aesthetic of the MindBridge app.

PERSONA & STYLE:
- Tone: Warm, sophisticated, and professional yet personal.
- Method: Use Motivational Interviewing. Reflect back feelings and ask open-ended questions.
- COMMUNICATION STYLE: Adapt your tone based on the user's preference (Gentle, Direct, Analytical).

GHANAIAN MULTILINGUAL & CULTURAL CONTEXT:
- LANGUAGES: Prioritize user preference (Twi, Ewe, Ga, or English).
- FAITH & SPIRITUALITY: Respectfully include spiritual encouragement if requested or relevant.
- INTERESTS: Use user interests (Music, Sports, Art) as "glimmers" or coping tools.

CORE CAPABILITY:
- You can fetch the user's mood history, journal entries, and ritual status using your tools.
- DO NOT hallucinate data. If you need information, use your tools.
`;

const tools = [
  {
    functionDeclarations: [
      {
        name: "get_mood_history",
        description: "Retrieve the user's recent mood logs and emotional trends.",
        parameters: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Number of logs to fetch (max 10)." }
          }
        }
      },
      {
        name: "get_journal_history",
        description: "Retrieve snippets of the user's recent journal entries.",
        parameters: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Number of entries to fetch (max 5)." }
          }
        }
      },
      {
        name: "get_ritual_status",
        description: "Check if the user has completed their daily rituals today.",
        parameters: { type: "object", properties: {} }
      }
    ]
  }
];

export const generateOracleResponse = async (userMessage: string, context: any, userId: string) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools: tools as any
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `
USER PROFILE:
Name: ${context.onboarding?.firstName || 'User'}
University: ${context.onboarding?.university || 'University'}
Program: ${context.onboarding?.program || 'Student'}
Level: ${context.onboarding?.level || 'N/A'}
Preferred Language: ${context.onboarding?.preferredLanguage || 'English'}
Communication Style: ${context.onboarding?.communicationStyle || 'Gentle'}
Faith/Spirituality: ${context.onboarding?.spiritualBackground || 'None'}
Interests: ${context.onboarding?.interests?.join(', ') || 'None'}
Current Academic Season: ${context.onboarding?.currentAcademicSeason || 'Standard'}
          ` }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am now aware of the user's profile and preferences. How can I support them today?" }]
        }
      ]
    });

    let result = await chat.sendMessage(userMessage);
    let response = result.response;

    // Handle Function Calls (Tools)
    const call = response.functionCalls()?.[0];
    if (call) {
      console.log(`[AI TOOL] Executing: ${call.name}`, call.args);
      let toolResponse: any;

      switch (call.name) {
        case "get_mood_history":
          toolResponse = await AiRepository.getMoodHistory(userId, (call.args as any).limit);
          break;
        case "get_journal_history":
          toolResponse = await AiRepository.getJournalHistory(userId, (call.args as any).limit);
          break;
        case "get_ritual_status":
          toolResponse = await AiRepository.getTodayRitualStatus(userId);
          break;
        default:
          toolResponse = { error: "Unknown tool" };
      }

      // Send the tool result back to the model for the final response
      result = await chat.sendMessage([{
        functionResponse: {
          name: call.name,
          response: { result: toolResponse }
        }
      }]);
      response = result.response;
    }

    return response.text();
  } catch (error) {
    console.error("Error in Gemini service:", error);
    throw new Error("Failed to generate AI response");
  }
};

