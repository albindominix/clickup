import { openai } from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //todos in the bodyof the post req

  const { todos } = await request.json();
  // console.log(todos);

  //communicate with OpenAI
  const data =  await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "when responding,welcome the user always as Mr.Albin and say welcome to trello App",
      },
      {
        role: "user",
        content: `Hi there ,provide a summary of the following todos. Count how many are in each category such as To do, in Progress and done, then tell the user to have productive day! here's the data ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });
  
  console.log("data is:",data)
  // console.log(data.choices[0])

  return NextResponse.json(data.choices[0].message)
  
}
