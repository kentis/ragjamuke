import fs from "fs";
import { config } from "dotenv";
import OpenAI from "openai";

config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const parsedSongs  = JSON.parse(fs.readFileSync("./rag/dataset.json", "utf-8"));

// console.log(parsedJson)

const embedText = (song) =>
  `${song.tags.join(" ")} song chords ${song.chords.join(" ")}  strumming ${song.pattern}`;

const run = async () => {
  const embedded = [];

  for (const song of parsedSongs) {
    const input = embedText(song);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });

    embedded.push({
      ...song,
      embedding: response.data[0].embedding,
    });

    console.log(`Embedded: ${song.title}`);
  }
  fs.writeFileSync("./rag/embedded.json", JSON.stringify(embedded, null, 2));
  console.log("embeds saved to  rag/embedded.json");
};

run();
