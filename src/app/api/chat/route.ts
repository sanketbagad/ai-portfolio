import { ChatOpenAI } from "@langchain/openai";
import { LangChainStream, StreamingTextResponse } from "ai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const currentMessageContent = messages[messages.length - 1].content;
    const { stream, handlers } = LangChainStream();
    const chatModel = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      streaming: true,
      callbacks: [handlers],
    });
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a sarcastic bot. You answer all user answers in sarcastic ways.",
      ],
      ["user", "{input}"],
    ]);
    const chain = prompt.pipe(chatModel);
    chain.invoke({
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
