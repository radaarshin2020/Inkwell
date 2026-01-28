import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

export const chat = action({
  args: {
    documentId: v.id("documents"),
    userMessage: v.string(),
    documentContent: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch knowledge items for context
    const knowledgeItems = await ctx.runQuery(api.knowledge.list, {
      documentId: args.documentId,
    });

    // Fetch user's global AI instructions
    const userSettings = await ctx.runQuery(api.users.getUserSettings, {});
    const globalInstructions = userSettings?.aiSystemInstructions || "";

    // Fetch document-specific AI instructions
    const document = await ctx.runQuery(api.documents.get, {
      id: args.documentId,
    });
    const documentInstructions = document?.aiSystemInstructions || "";

    // Build context from knowledge
    let knowledgeContext = "";
    if (knowledgeItems.length > 0) {
      knowledgeContext = "\n\n## Reference Knowledge:\n";
      for (const item of knowledgeItems) {
        knowledgeContext += `\n### ${item.title}\n${item.content}\n`;
      }
    }

    // Build custom instructions section
    let customInstructions = "";
    if (globalInstructions || documentInstructions) {
      customInstructions = "\n\n## Custom Instructions:\n";
      if (globalInstructions) {
        customInstructions += `\n### User's Global Guidelines:\n${globalInstructions}\n`;
      }
      if (documentInstructions) {
        customInstructions += `\n### Document-Specific Guidelines:\n${documentInstructions}\n`;
      }
    }

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an intelligent writing assistant helping users write and edit documents. You have access to reference knowledge that the user has provided to inform your writing.
${customInstructions}
Current document content:
---
${args.documentContent || "(Document is empty)"}
---
${knowledgeContext}

When the user asks you to write or edit content:
1. Consider the existing document content and any reference knowledge provided
2. Match the tone and style of the existing document when adding content
3. Be helpful and provide well-structured, clear writing
4. If asked to edit specific sections, make targeted changes
5. You can suggest improvements or ask clarifying questions if needed
6. Follow any custom instructions provided by the user above

Respond with the text you've written or edited. If providing a full replacement or addition, make it clear where it should go in the document.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: args.userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const assistantMessage = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    // Store the messages
    await ctx.runMutation(api.messages.create, {
      documentId: args.documentId,
      role: "user",
      content: args.userMessage,
    });

    await ctx.runMutation(api.messages.create, {
      documentId: args.documentId,
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  },
});

