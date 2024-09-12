import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { extractSubFromJwt } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  const userId = await extractSubFromJwt(token);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        traits: true,
        verificationStrings: true,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    if (collection.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch collection" }, { status: 500 });
  }
}