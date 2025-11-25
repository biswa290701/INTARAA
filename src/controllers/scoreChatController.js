import { ChatGPTAPI } from "chatgpt";
import getCaseById from "../models/case.js";

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function handleScoreChat(req, res) {
  try {
    const { caseId, messages } = req.body;

    const caseData = await getCaseById(caseId);

    if (!caseData)
      return res.status(404).json({ success: false, message: "Case not found" });

    const scoreChatSystemMessage = `You are an expert evaluator. Your task is to assess the quality of the conversation based on relevance, coherence, and informativeness. The following is json with the scenario and the conversation to rate.
    
    {
        "scenario": "${caseData.CasePrompt}",
        "conversation": ${JSON.stringify(messages)}
    }

    Provide a score from 1 to 10, where 1 is very poor and 10 is excellent for each category in the following json and return the same.
    {
        "relevance": "",
        "coherence": "",
        "informativeness": ""
    }
    `

    const reply = await api.sendMessage(scoreChatSystemMessage);

    const jsonResponse = JSON.parse(reply.text);

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Scoring Chat Error:", error);
    res.status(500);
  }
}

export default handleScoreChat;
