import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type RfPrediction = {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

function parseCard(label: string) {
  const suits: Record<string, string> = {
    c: "clubs", d: "diamonds", h: "hearts", s: "spades",
  };
  const m = label.trim().toLowerCase().match(/^([0-9]+|[ajqk])\s*(?:of\s*)?([cdhs])/);
  if (!m) return { rank: label, suit: "", raw: label };
  const rankMap: Record<string, string> = { a: "A", j: "J", q: "Q", k: "K" };
  return { rank: rankMap[m[1]] ?? m[1], suit: suits[m[2]] ?? m[2], raw: label };
}

export async function POST(req: NextRequest) {
  const { image } = await req.json();
  if (typeof image !== "string" || !image.startsWith("data:")) {
    return NextResponse.json({ error: "image must be a data URL" }, { status: 400 });
  }
  const base64 = image.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");

  const key = process.env.ROBOFLOW_API_KEY;
  const model = process.env.ROBOFLOW_MODEL;
  const version = process.env.ROBOFLOW_VERSION;
  if (!key || !model || !version) {
    return NextResponse.json({ error: "missing ROBOFLOW_* env vars" }, { status: 500 });
  }

  const url = `https://detect.roboflow.com/${model}/${version}?api_key=${encodeURIComponent(key)}&confidence=50`;
  const rf = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: base64,
  });
  if (!rf.ok) {
    return NextResponse.json(
      { error: `roboflow ${rf.status}: ${await rf.text()}` },
      { status: 502 },
    );
  }
  const data = (await rf.json()) as { predictions?: RfPrediction[] };
  const preds = data.predictions ?? [];

  const cards = preds
    .slice()
    .sort((a, b) => a.x - b.x)
    .map((p) => parseCard(p.class));

  return NextResponse.json({ cards, raw: preds });
}
