import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "");
async function testModel() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("test");
        console.log("Model 'gemini-1.5-flash-latest' is active and responding.");
        console.log("Response:", result.response.text());
    }
    catch (error) {
        console.error("Error testing model:", error);
    }
}
testModel();
//# sourceMappingURL=list_models.js.map