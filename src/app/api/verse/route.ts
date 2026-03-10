import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { error: "Reference is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://bible-api.com/${encodeURIComponent(reference)}`
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch verse" },
      { status: 500 }
    );
  }
}