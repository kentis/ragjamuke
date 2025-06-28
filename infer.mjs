import {search} from "./search.mjs";
import { config } from "dotenv";
import OpenAI from "openai";
import {pathToFileURL} from 'node:url';

config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const inferResults = async (songs, query) => {
    const context = songs
    .map((song, i) => `${i + 1}. "${song.title}" by ${song.artist} - chords: '${song.chords.join(", ")}'`)
    .join("\n");

    const prompt = `User wants to play songs like these on ukulele:\n${context}\n\generate easy ukulele tabs or strumming tips for these songs and two similar songs tailored to beginner.\nUser query: "${query}"`;
    const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6});

  return response.choices[0].message.content;
};

const run = async (query) => {
  const searchRes = (await search(query)).slice(0, 2);
  const inferedResults = await inferResults(searchRes, query);

  console.log(inferedResults);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const query = process.argv.slice(2).join(" ") || "easy song with G-C-Am-F";
  run(query);
}

export { inferResults };