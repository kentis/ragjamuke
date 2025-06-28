import fs from "fs";
import { config } from "dotenv";
import OpenAI from "openai";
import {pathToFileURL} from 'node:url';

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magA * magB);
}

config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const embeddeds  = JSON.parse(fs.readFileSync("./rag/embedded.json", "utf-8"));

const embedQuery = async (query) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  return response.data[0].embedding;
};

const searchSongs = (queryEmbedding, embeddedSongs) => {
  const similarities = [];
  for(const song of embeddedSongs){
    const score = cosineSimilarity(queryEmbedding, song.embedding)
    similarities.push({score, song})
  }
  similarities.sort((a,b)=>b.score-a.score)
  return similarities
};


const search = async (query) => {
  const embeddedQuery = await embedQuery(query);
  const similarities = searchSongs(embeddedQuery, embeddeds)
  var top = similarities.slice(0,5);
  return top.map((song) => ({...song.song, embedding: undefined, score: song.score}));
};


if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const query = process.argv.slice(2).join(" ") || "easy song with G-C-Am-F";
  const top = search(query);
  console.log(top);
}

export { search, embedQuery, searchSongs, cosineSimilarity };