import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json("Hola desde la API");
}