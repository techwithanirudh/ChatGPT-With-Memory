// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import query from "../../lib/ai/queryApi";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";
import fs from "fs";
import path from "path";
import { translate } from "@vitalets/google-translate-api";
import { Message } from "../../typings";
import requestIp from 'request-ip';

type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session } = req.body;
	const detectedIP = requestIp.getClientIp(req)
	
  if (!prompt) {
    res.status(400).json({ answer: "Please provide a prompt!" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat ID!" });
    return;
  }

  //   ChatGPT query
  // console.log(prompt, chatId, session, model);
  const response = await query(prompt, chatId, session, model);

  const message: Message = {
    text: response || "ChatGPT was unable to find an answer for that!",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    user: {
      _id: "ChatGPT",
      name: "ChatGPT",
      avatar: "https://cdn.iconscout.com/icon/free/png-256/chat-bubble-1851157-1569206.png?f=webp&w=128",
    },
  };

  // Add message to Firebase
  await adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

  // Log request to file
  const userEmail = session?.user?.email;
  const timestamp = new Date().toISOString();
  const logDir = "logs";
  const logFilename = "chat_requests.csv";
  const logPath = path.join(logDir, logFilename);
  const logMessage = `${userEmail},${timestamp},${detectedIP},${prompt},${message.text}\n`;

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  // Check if the first line of the file is the header
  var isCreated = fs.existsSync(logPath);
  if (!isCreated) {
    fs.appendFileSync(logPath, "userEmail,timestamp,detectedIP,prompt,response\n");
  }

  try {
    const translation = await translate(logMessage, { to: "en" });
    fs.appendFileSync(logPath, translation.text);
    console.log(`User ${userEmail} with IP ${detectedIP} asked ChatGPT to ${translation.text} at ${timestamp}`);
    console.log();
    console.log(`The reply was ${message.text}`);

    console.log(`-`.repeat(prompt.length + 50));
  } catch (error) {
    // console.error(`Error translating log message: ${error}`);
    fs.appendFileSync(logPath, logMessage);

    console.log(`User ${userEmail} with IP ${detectedIP} asked ChatGPT to ${prompt} at ${timestamp}`);
    console.log();
    console.log(`The reply was ${message.text}`);

    console.log(`-`.repeat(prompt.length + 50));
  }

  // Return response
  res.status(200).json({ answer: message.text });
}