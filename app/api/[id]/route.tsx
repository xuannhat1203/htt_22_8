import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
export async function GET(req: any, res: any) {
  const filePath = path.join(process.cwd(), "database", "data.json");
  const data = fs.readFileSync(filePath, "utf8");
  const products = JSON.parse(data);
  const find = products.find((product: any) => product.id === +res.params.id);
  return NextResponse.json(find);
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "database", "data.json");
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const findIndex = products.findIndex(
      (product: any) => product.id === +params.id
    );
    if (findIndex !== -1) {
      products.splice(findIndex, 1);
      fs.writeFileSync(filePath, JSON.stringify(products), "utf8");
      return NextResponse.json(products);
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
export async function PUT(req: any, res: any) {
  const userRequest = await req.json();
  const filePath = path.join(process.cwd(), "database", "data.json");
  const data = fs.readFileSync(filePath, "utf8");
  const products = JSON.parse(data);
  const find = products.findIndex((user: any) => user.id === +res.params.id);
  if (find !== -1) {
    products[find] = { ...products[find], ...userRequest };
    fs.writeFileSync(filePath, JSON.stringify(products), "utf8");
    return NextResponse.json(products);
  }
}
