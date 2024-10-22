import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import prompts from "../ai/prompts";
import schemas from "../ai/jsonSchemas";
import { ReadStream } from "fs";

const client = new OpenAI();

const extractCharacterData = async (json: string) => {
    const completion = await client.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: prompts.EXTRACT_CHARACTER_DATA },
            { role: "user", content: json },
        ],
        response_format: zodResponseFormat(schemas.Player, "character")
    })

    if (completion.choices[0].message.refusal) {
        throw new Error("AI refused to fulfill the request");
    }
    return completion.choices[0].message.parsed;
}

const createAssistant = async () => {
    const assistant = await client.beta.assistants.create({
      name: 'D&D Rulebook Assistant',
      instructions:
        'You are an expert on Dungeons & Dragons rules. Use the provided rulebook to answer questions, citing relevant sections.',
      model: 'gpt-4o-2024-08-06',
      tools: [{ type: 'file_search' }],
    });
    return assistant;
}

const createVectorStore = async (stream: ReadStream) => {
    const vectorStore = await client.beta.vectorStores.create({
        name: 'User Rulebook Store',
    })
    await client.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: [stream] });
  
      // Create an assistant and attach the vector store
      const assistant = await createAssistant();
  
      await client.beta.assistants.update(assistant.id, {
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStore.id],
          },
        },
      });

      return { rulebookId: vectorStore.id, assistantId: assistant.id };
}

export default { extractCharacterData, createVectorStore };
