import type { NextRequest } from 'next/server'
import { OpenAI } from 'openai'

export async function POST(req: NextRequest) {
  const { fileCols, firstRows, columns } = await req.json()
  const openai = new OpenAI()

  const prompt = `
      You are a data-ingestion assistant.
      ## Standard columns
      ${JSON.stringify(columns)}
      ## CSV columns
      ${JSON.stringify(fileCols)}
      ## Sample rows (max 10)
      ${JSON.stringify(firstRows, null, 2)}
      Return ONLY a JSON object whose keys are CSV columns and values are their matching standard column. If unsure, return null for that key.
  `

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You write JSON only, no explanations.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  })

  const mapping = JSON.parse(chat.choices[0].message.content ?? '{}')

  return Response.json({
    mapping,
  })
}
