import { Configuration, OpenAIApi } from "openai";

function initOpenAI(userSettings: any) {
    const configuration = new Configuration({
        apiKey: userSettings?.apiKey || process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    return openai;
}

export default initOpenAI;