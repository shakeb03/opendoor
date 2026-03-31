import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getComparisonPrompt } from '@/lib/prompts'

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { address } = await request.json()
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: getComparisonPrompt(address) }],
    })

    const text = (response.content[0] as { type: 'text'; text: string }).text
    const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const data = JSON.parse(cleaned)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Comparison API error:', error)
    return NextResponse.json({ error: 'Failed to generate comparison' }, { status: 500 })
  }
}
