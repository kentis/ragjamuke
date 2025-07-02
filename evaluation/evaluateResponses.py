from dotenv import load_dotenv
import asyncio
from ragas import SingleTurnSample
from ragas.metrics import AspectCritic
from ragas.metrics import AspectCritic
from ragas.metrics import SimpleCriteriaScore
from ragas.llms import LangchainLLMWrapper
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from ragas import evaluate
import os.path
load_dotenv()


def ParseScenario(path):
  with open(path) as f:
    content = f.read()
    segments = content.split("-------")
    return (segments[0].strip(), segments[1].strip())
  

async def run(query, result):
  test_data = {
      "user_input": query,
      "response": result,
  }
  evaluator_llm = LangchainLLMWrapper(ChatOpenAI(model="gpt-4o"))
  #metric = AspectCritic(name="summary_accuracy",llm=evaluator_llm, definition="Verify if the resulted songs are reasonable given query.")
  metric = SimpleCriteriaScore(
    name="course_grained_score", 
    definition="Score 0 to 5 by reasonableness",
    llm=evaluator_llm
  )
  res = await metric.single_turn_ascore(SingleTurnSample(**test_data))
  print(res)

if __name__ == "__main__":
    query, result = ParseScenario("testdata/colleaguesjamMedium.txt")
    print(query)
    
    asyncio.run(run(query, result))
    
    query, result = ParseScenario("testdata/summerjam4.txt")
    print(query)
    asyncio.run(run(query, result))
