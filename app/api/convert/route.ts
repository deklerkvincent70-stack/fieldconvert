import { NextResponse } from 'next/server';
import { parseNaturalLanguage } from '@/lib/ai/parser';
import { convert } from '@/lib/conversions/engine';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  if (typeof body.query === 'string') {
    return NextResponse.json({ suggestions: parseNaturalLanguage(body.query) });
  }

  const { category, from, to, value } = body;
  if (!category || !from || !to || typeof value !== 'number') {
    return NextResponse.json({ error: 'Expected category, from, to and numeric value' }, { status: 400 });
  }

  return NextResponse.json({ result: convert(category, from, to, value) });
}
