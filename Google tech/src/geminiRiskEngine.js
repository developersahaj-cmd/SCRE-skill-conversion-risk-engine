library: npm install @google/generative-ai
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const getRiskAssessment = async (skill, behaviors) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Flash is free & fast
  const prompt = `Assess the risk of someone learning ${skill} given these behaviors: ${behaviors}. Return a risk percentage and 3 key reasons.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};
