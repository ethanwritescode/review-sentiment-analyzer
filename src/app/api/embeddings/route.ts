import { NextRequest } from "next/server";
import { embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

type EmbedRequestBody = {
	texts: string[];
	model?: string;
};

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as EmbedRequestBody;
		if (!body || !Array.isArray(body.texts) || body.texts.length === 0) {
			return new Response(JSON.stringify({ error: "'texts' must be a non-empty array" }), {
				status: 400,
				headers: { "content-type": "application/json" },
			});
		}

		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set. Define it in .env.local" }), {
				status: 500,
				headers: { "content-type": "application/json" },
			});
		}

		const openai = createOpenAI({ apiKey });
		const modelName = body.model ?? "text-embedding-3-large";
		const { embeddings } = await embedMany({
			model: openai.embedding(modelName),
			values: body.texts,
		});

		return new Response(JSON.stringify({ embeddings }), {
			status: 200,
			headers: { "content-type": "application/json" },
		});
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: "Failed to create embeddings" }), {
			status: 500,
			headers: { "content-type": "application/json" },
		});
	}
}


