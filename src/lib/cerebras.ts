import OpenAI from 'openai';

const cerebras = new OpenAI({
  baseURL: 'https://api.cerebras.ai/v1',
  apiKey: process.env.CEREBRAS_API_KEY || '',
});

export async function chatWithCerebras(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  dashboardContext: string
): Promise<string> {
  try {
    const systemMessage = {
      role: 'system' as const,
      content: `You are TrintoSpec AI, an intelligent assistant for the Tunisia Solar Panel Market Dashboard. You have real-time access to dashboard data and can answer questions about solar panel prices, market trends, news, reviews, and announcements in the Tunisian market.

Current Dashboard Data:
${dashboardContext}

Instructions:
- Provide accurate, data-driven responses based on the dashboard data
- Format numbers and currencies properly (TND - Tunisian Dinar)
- Highlight trends and insights from the real-time data
- Be concise but informative
- If asked about specific brands or regions, reference the actual data
- Suggest actionable insights for solar panel buyers in Tunisia`,
    };

    const completion = await cerebras.chat.completions.create({
      model: 'llama-4-scout-17b-16e-instruct',
      messages: [systemMessage, ...messages],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
  } catch (error) {
    console.error('Cerebras API error:', error);
    return 'I apologize, there was an error processing your request. Please try again.';
  }
}
