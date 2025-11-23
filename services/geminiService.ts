import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { DailyChallenge, PronunciationResult } from '../types';

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
console.log('API Key loaded:', apiKey ? 'Present' : 'Missing', 'Length:', apiKey?.length);
const genAI = new GoogleGenerativeAI(apiKey);

const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1000,
};

/**
 * Chat with Gemini for English practice.
 */
export const getChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  topic: string
): Promise<string> => {
  try {
    const systemInstruction = `You are a helpful and encouraging English conversation partner. 
    The user is practicing their English skills. 
    Current Topic: ${topic}.
    - Keep your responses natural, conversational, and concise (under 50 words usually).
    - Correct major grammar mistakes gently if they impede understanding, but focus on flow.
    - Ask follow-up questions to keep the conversation going.
    - Do not be too formal.
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction 
    });
    
    const response = await model.generateContent({
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
      generationConfig: GENERATION_CONFIG,
    });

    return response.response.text() || "I'm sorry, I didn't catch that. Could you say it again?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to the server. Please try again.";
  }
};

/**
 * Analyze pronunciation and grammar.
 */
export const analyzePronunciation = async (
  spokenText: string,
  targetText?: string
): Promise<PronunciationResult> => {
  try {
    const prompt = targetText 
      ? `User tried to say: "${targetText}". They actually said: "${spokenText}". Analyze this in JSON format: {score, fluencyScore, pronunciationScore, mistakes: [], correctedVersion, feedback}` 
      : `User said: "${spokenText}". Analyze the grammar and naturalness in JSON format: {score, fluencyScore, pronunciationScore, mistakes: [], correctedVersion, feedback}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const response = await model.generateContent(prompt);

    const text = response.response.text();
    if (!text) throw new Error("No response from AI");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    return JSON.parse(jsonMatch[0]) as PronunciationResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      score: 0,
      fluencyScore: 0,
      pronunciationScore: 0,
      mistakes: ["Error analyzing audio"],
      correctedVersion: "",
      feedback: "Could not analyze at this time."
    };
  }
};

/**
 * Generate 5 daily challenges.
 */
export const generateDailyChallenges = async (): Promise<DailyChallenge[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const response = await model.generateContent(
      "Generate 5 diverse daily English practice challenges for an intermediate learner. Return as JSON array with fields: id, type (speak/translate/pronounce/explain/quiz), question, targetAnswer, completed"
    );

    const text = response.response.text();
    if (!text) return [];
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]) as DailyChallenge[];
  } catch (error) {
    console.error("Challenge Gen Error:", error);
    return [];
  }
};
