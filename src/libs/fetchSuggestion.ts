import formatTodosForAI from './formatTodosForAI';

export default async function fetchSuggestion(board: Board) {
  const todos = formatTodosForAI(board);

  console.log(`>>>>>>>>>>>>>>>> Formatted todos to send >> `, todos);

  const res = await fetch(`/api/generateSummary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todos }),
  });

  const GPTdata = await res.json();
  const { content } = GPTdata;

  return content;
}
