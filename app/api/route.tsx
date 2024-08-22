import path from "path";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
export async function GET() {
  const filePath = path.join(process.cwd(), "database", "data.json");
  const data = fs.readFileSync(filePath, "utf8");
  const products = JSON.parse(data);
  return NextResponse.json(products);
}
export async function POST(req: NextRequest, res: NextRequest) {
  const userRequest = await req.json();
  const filePath = path.join(process.cwd(), "database", "data.json");
  const listProduct = JSON.parse(fs.readFileSync(filePath, "utf8"));
  listProduct.push(userRequest);
  fs.writeFileSync(filePath, JSON.stringify(listProduct), "utf8");
  return NextResponse.json(listProduct);
}
