import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "");

const SYSTEM_PROMPT = `
You are the MindBridge Oracle, a wise, empathetic, and non-judgmental AI companion for university students. 
Your goal is to provide emotional support, reflection, and guidance through the "Soft Luxury" aesthetic of the MindBridge app.

PERSONA:
- Tone: Warm, sophisticated, calm, and professional yet personal.
- Method: Use Motivational Interviewing. Reflect back what the user says, validate their feelings, and ask open-ended questions.
- Context: You are aware of the user's recent mood, journal entries, and academic goals. Integrate these naturally into the conversation.

BOUNDARIES:
- You are NOT a therapist or a doctor.
- For clinical or severe issues, always encourage professional help.
- If the user expresses self-harm or crisis thoughts, trigger the safety response (the controller will handle the actual redirection, but your tone should shift to immediate concern and support).

STUDENT FOCUS:
- Be aware of the academic calendar (exams, deadlines, transitions).
- Use relatable but mature language.
- Celebrate small wins like "planting a seed" in their Mood Garden.
`;

export const generateOracleResponse = async (userMessage: string, context: any) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT 
    });

    const prompt = `
CONTEXT:
User's Latest Mood: ${JSON.stringify(context.latestMood)}
Recent Journal Themes: ${context.recentJournal.map((j: any) => j.title || 'Untitled').join(', ')}
User Goals: ${JSON.stringify(context.onboarding?.primaryGoals || [])}

USER MESSAGE:
"${userMessage}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate AI response");
  }
};
