import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import prompts from "../ai/prompts";
import schemas from "../ai/jsonSchemas";

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

export default { extractCharacterData };
