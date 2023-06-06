import formatTodosForAI from './formatTodosForAI';

/**
 * AI에게 요청을 보내서 요약문을 받아옵니다.
 */
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
