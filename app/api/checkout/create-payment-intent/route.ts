import { NextResponse } from "next/server";
export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    { error: "Online payment is disabled. Payment is collected on-site." },
    { status: 410 },
  );
}
