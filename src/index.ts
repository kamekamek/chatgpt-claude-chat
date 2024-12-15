#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = new Server(
  {
    name: "chatgpt-claude-conversation",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "start_conversation",
        description: "ChatGPTとClaudeの会話を開始します",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "会話のトピック",
            },
            turns: {
              type: "number",
              description: "会話のターン数",
            },
          },
          required: ["topic", "turns"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "start_conversation": {
      const topic = String(request.params.arguments?.topic);
      const turns = Number(request.params.arguments?.turns);

      if (!topic || isNaN(turns)) {
        throw new Error("トピックとターン数が必要です");
      }

      let conversation = `トピック: ${topic}\n\n`;

      for (let i = 0; i < turns; i++) {
        // ChatGPTの応答
        const chatgptResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "あなたはChatGPTです。Claudeとの会話を行います。" },
            { role: "user", content: `${topic}について、Claudeと会話してください。これは${i + 1}ターン目です。` },
          ],
        });

        const chatgptMessage = chatgptResponse.choices[0].message?.content || "ChatGPTの応答を取得できませんでした。";
        conversation += `ChatGPT: ${chatgptMessage}\n\n`;

        // Claudeの応答（実際のClaudeAPIがないため、OpenAI APIで代用）
        const claudeResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "あなたはClaudeです。ChatGPTとの会話を行います。" },
            { role: "user", content: `${topic}について、ChatGPTと会話してください。これは${i + 1}ターン目です。ChatGPTの最後の発言: ${chatgptMessage}` },
          ],
        });

        const claudeMessage = claudeResponse.choices[0].message?.content || "Claudeの応答を取得できませんでした。";
        conversation += `Claude: ${claudeMessage}\n\n`;
      }

      return {
        content: [{
          type: "text",
          text: conversation,
        }],
      };
    }

    default:
      throw new Error("不明なツールです");
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("サーバーエラー:", error);
  process.exit(1);
});
