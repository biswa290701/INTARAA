import { ChatGPTAPI } from "chatgpt";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import getCaseById from "../models/case.js";

let WillGenerateAudio = false;

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function handleChat(req, res) {
  try {
    const { caseId, message } = req.body;

    const caseData = await getCaseById(caseId);

    if (!caseData)
      return res.status(404).json({ success: false, message: "Case not found" });

    const reply = await api.sendMessage(message, {
      systemMessage: caseData.CasePrompt,
    });

    let base64audio = null;

    if (WillGenerateAudio)
      base64audio = await GenAudio(caseData.CaseVoiceId, reply.text);

    return res.json({
      success: true,
      response: reply.text,
      audio: base64audio
    });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({
      success: false,
      response: error.message,
      audio: null,
    });
  }
}

export default handleChat;

async function GenAudio(CaseVoiceId, replyTxt) {
  const audio = await elevenlabs.textToSpeech.convert(CaseVoiceId, {
    text: replyTxt,
    modelId: "eleven_multilingual_v2",
  });

  let chunks = [];
  for await (const chunk of audio) chunks.push(chunk);

  return Buffer.concat(chunks).toString("base64");
}

