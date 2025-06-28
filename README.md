# ragjamuke
A RAG application to find songs suitable for a Ukulele jam session and provide insights on how to play them.


## Useage

Fist, add your openai key to `.env` and run `npm i` to fetch all dependencies.


### Adding song choices

Edit `rag/dataset.json` to make changes the song collection. Once you are happy with the dataset run `node ./embed.mjs` to create embedings for the search.

### Run in commandline

To search for songs only run

```sh
node search.mjs "easy song with four chords"
```

To get LLM-enriched results use

```sh
node infer.mjs "easy song with four chords"
```


### Run as a web application

To run as a web application run

```sh
node server.mjs
```

And in your browser navigate to `http://localhost:3000`