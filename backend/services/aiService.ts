import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import prompts from "../ai/prompts";
import schemas from "../ai/jsonSchemas";
import { ReadStream } from "fs";

const client = new OpenAI();

interface AssistantMetadata {
  rulebookName: string;
}

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

const generateEncounter = async (
  players: unknown[],
  parameters: { difficulty: string, numEnemies?: number, environment?: string },
  messages: { role: "user" | "assistant", content: string }[]
) => {
    const completion = await client.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: prompts.GENERATE_ENCOUNTER },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { 
                role: "user", 
                content: JSON.stringify({
                    players,
                    parameters
                })
            }
        ],
        response_format: zodResponseFormat(schemas.EncounterResponse, "encounter")
    });

    if (completion.choices[0].message.refusal) {
        throw new Error("AI refused to fulfill the request");
    }
    return completion.choices[0].message.parsed;
};

const generateChatResponse = async (messages: { role: "user" | "assistant", content: string }[]) => {
  const completion = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
          { 
              role: "system", 
              content: prompts.GENERAL_CHAT 
          },
          ...messages.map(msg => ({ 
              role: msg.role, 
              content: msg.content 
          }))
      ]
  });

  return {
      message: completion.choices[0].message.content
  };
};

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

const createVectorStoreWithAssistant = async (stream: ReadStream, rulebookName: string) => {
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
        metadata: { rulebookName }
      });

      return { rulebookId: vectorStore.id, assistantId: assistant.id };
}

const deleteVectorStoreAndAssistant = async (assistantId: string, rulebookId: string) => {
  try {
    await client.beta.assistants.del(assistantId);
    await client.beta.vectorStores.del(rulebookId);
  } catch (err) {
    if (!(err instanceof OpenAI.NotFoundError)) {
      throw err;
    }
    console.error(err);
  }
};

const getRulebookName = async (assistantId: string) => {
  const assistant = await client.beta.assistants.retrieve(assistantId);
  return (assistant.metadata as AssistantMetadata).rulebookName;
}

const createThread = async (assistantId: string, existingThreadId: string | null, message: string) => {
  if (existingThreadId) {
    // clean up old thread
    await client.beta.threads.del(existingThreadId);
  }
  const thread = await client.beta.threads.create({ messages: [{ role: "user", content: message }] });
  return thread.id;
}

const getMessages = async (threadId: string, assistantId?: string) => {
  const messagesPage = await client.beta.threads.messages.list(threadId);
  const fileName = assistantId && await getRulebookName(assistantId);
  return Promise.all(messagesPage.data.map(async (message) => {
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      fileSearchResults: await getMessageFileSearchResults(message),
      fileName
    }
  }));
}

const getMessageFileSearchResults = async (message: OpenAI.Beta.Threads.Message) => {
  if (message.run_id) {
    const run = await client.beta.threads.runs.retrieve(message.thread_id, message.run_id);
    const steps = (await client.beta.threads.runs.steps.list(message.thread_id, run.id, {}, { query: { "include[]": "step_details.tool_calls[*].file_search.results[*].content" } })).data;
    return steps;
  }
}

const appendMessage = async (threadId: string, message: string) => {
  return client.beta.threads.messages.create(threadId, { role: "user", content: message });
}

const runThread = async (threadId: string, assistantId: string) => {
  await client.beta.threads.runs.createAndPoll(threadId, { assistant_id: assistantId });
  return getMessages(threadId, assistantId);
}

export default { extractCharacterData, generateEncounter, generateChatResponse, createVectorStoreWithAssistant, deleteVectorStoreAndAssistant, getRulebookName, createThread, getMessages, runThread, appendMessage };
