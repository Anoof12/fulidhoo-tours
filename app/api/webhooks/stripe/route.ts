import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  void request;
  void headers;
  return NextResponse.json(
    { error: "Stripe webhook is disabled because online payment is not in use." },
    { status: 410 },
  );
}
