import initOpenAI from "./openai";
import { collection, doc, DocumentData, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";

const getUserSettings = async (session: any) => {
  const userRef = doc(db, "users", session?.user?.email!);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return {
      temperature: userDoc.data()?.temperature,
      botName: userDoc.data()?.botName,
      apiKey: userDoc.data()?.apiKey,
    }
  }
};

const queryApi = async (prompt: string, chatId: string, session: any, model: string) => {
  const userSettings = await getUserSettings(session);
  const openai = initOpenAI(userSettings);

  // Get the previous messages
  var oldMessages: any = {};

  if (chatId) {
    var oldMessages: any = query(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      orderBy("createdAt", "asc")
    )

    // Use v9 syntax to get the data
    const snapshot = await getDocs(oldMessages);
    oldMessages = snapshot.docs.map((doc) => doc.data());

    oldMessages = oldMessages.map((message: any) => {
      return {
        role: message.user._id === "ChatGPT" ? "system" : "user",
        content: message.text,
      };
    });
  }

  if (model === "gpt-3.5-turbo" || model === "gpt-4") {
    try {
      var message_data: any = [
        {
          role: "system", content: `You are Tech With Anirudh GPT, a AI assistant, created by Anirudh Sriram (@techwithanirudh) a young tech enthusiast. Follow the user's instructions carefully. Respond using markdown.`
        },
      ].concat(oldMessages);

      const completion = await openai.createChatCompletion({
        // You need early access to GPT-4, otherwise use "gpt-3.5-turbo"
        model: model,
        messages: message_data,
        temperature: userSettings?.temperature || 0.9,
      }, {
        timeout: 5 * 60 * 1000,
      });

      var response = completion.data.choices[0].message?.content;
      return response;

      // return "ChatGPT is under maintenance. Please try again later."
    } catch (e: any) {
      console.log(e);
      if (!e || !e.response) return "Something went wrong! Please try again by typing continue.";
      if (e.response.status === 401 || e.response.status === 403 || e.response.status === 429) {
        return `If you are using your own OpenAI API key, please make sure you have enough credits! If you are using the default key, please [donate](https://chatgpt-clone-donate-openai-api-keys.techwithanirudh.repl.co/) your OpenAI API key to keep this free!`;
      } else if (e.response.status === 502 || e.response.status === 501 || e.response.status === 408) {
        return `An error occured! Please type continue to continue the conversation!`;
      } else {
        return `ChatGPT was unable to find an answer for that! (Error: ${e.message})`
      }
    }
  } else {
    const res = await openai
      .createCompletion({
        model,
        prompt,
        temperature: userSettings?.temperature || 0.9,
        max_tokens: 2048,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      }, {
        timeout: 5 * 60 * 1000,
      })
      .then((res) => res.data.choices[0].text)
      .catch(
        (e) => {
          console.log(e);
          if (!e || !e.response) return "Something went wrong! Please try again later!";
          if (e.response.status === 401 || e.response.status === 403 || e.response.status === 429) {
            return `If you are using your own OpenAI API key, please make sure you have enough credits! If you are using the default key, please [donate](https://chatgpt-clone-donate-openai-api-keys.techwithanirudh.repl.co/) your OpenAI API key to keep this free!`;
          } else if (e.response.status === 502 || e.response.status === 501 || e.response.status === 408) {
            return `An error occured! Please type continue to continue the conversation!`;
          } else {
            return `ChatGPT was unable to find an answer for that! (Error: ${e.message})`
          }
        }
      );

    return res;
  }
};

export default queryApi;
