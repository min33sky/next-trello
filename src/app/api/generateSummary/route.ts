import openai from '@/libs/openAi';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  /**
   *! OpenAI API Free Tier 사용량 초과로 인해 작동하지 않습니다.
   */

  try {
    const { todos } = await request.json();

    console.log('[generateSummary route] todos : ', todos);

    // OpenAI GPT와 통신
    // const response = await openai.createChatCompletion({
    //   model: 'gpt-3.5-turbo',
    //   temperature: 0.8,
    //   n: 1,
    //   stream: false,
    //   messages: [
    //     {
    //       role: 'system',
    //       content: `When responding, welcome the user always as Min33sky and say welcome to the Next Todo App! Limit the response to 200 characters.`,
    //     },
    //     {
    //       role: 'user',
    //       content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(
    //         todos,
    //       )}`,
    //     },
    //   ],
    // });

    // const { data } = response;

    // console.log('Data is: ', data);
    // console.log(data.choices[0].message);

    // return NextResponse.json(data.choices[0].message);

    return NextResponse.json(
      {
        message: 'OpenAI API Free Tier 사용량 초과로 인해 작동하지 않습니다.',
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.response.statusText,
      },
      { status: 500 },
    );
  }
}
