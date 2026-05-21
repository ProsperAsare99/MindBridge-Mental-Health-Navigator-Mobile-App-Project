import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const modelsToTest = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-2.5-pro"
];

async function testModel(modelName) {
  console.log(`\nTesting model: ${modelName}`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say 'hello' in one word.");
    const response = await result.response;
    console.log(`Success! Response: "${response.text().trim()}"`);
    return true;
  } catch (error) {
    console.log(`Failed! Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  for (const model of modelsToTest) {
    const ok = await testModel(model);
    if (ok) {
      console.log(`>>> MODEL ${model} IS WORKING <<<`);
    }
  }
}

runTests();
