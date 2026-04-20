import { action } from "./_generated/server";
import { v } from "convex/values";

type ParsedChore = {
  title: string;
  description: string;
  category: string;
  recurrence: "once" | "daily" | "weekly" | "monthly";
  baseTokens: number;
  dueTime: string;
  assigneeName: string | null;
};

export const parseVoiceCommand = action({
  args: {
    transcript: v.string(),
    childNames: v.array(v.string()),
  },
  handler: async (_ctx, args): Promise<ParsedChore> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-exp:free";

    if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

    const systemPrompt = `You are a helpful assistant that extracts chore details from a parent's voice command for a family chore app.

Extract the following fields from the command and return ONLY valid JSON (no markdown, no explanation):
{
  "title": "short chore title (2-5 words)",
  "description": "brief description of what to do",
  "category": "one of: Bedroom, Kitchen, Bathroom, Living Room, Garden, Laundry, Homework, Personal, Pets, Other",
  "recurrence": "one of: once, daily, weekly, monthly",
  "baseTokens": number between 5 and 50 based on effort,
  "dueTime": "HH:MM in 24h format, default 17:00",
  "assigneeName": "child name if mentioned, or null"
}

Available children names: ${args.childNames.join(", ") || "none specified"}

Rules:
- baseTokens: easy task = 5-10, medium = 10-20, hard/long = 20-50
- If no recurrence mentioned, default to "daily"
- If no time mentioned, default to "17:00"
- Category must exactly match one of the allowed values`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chore-champ.vercel.app",
        "X-Title": "ChoreChamp",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: args.transcript },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.statusText}`);
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    const parsed = JSON.parse(content) as ParsedChore;
    return parsed;
  },
});