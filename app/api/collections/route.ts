import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { extractSubFromJwt } from "@/lib/auth";
import { uploadFile } from "@/lib/fileUpload"; // Implement this function to handle file uploads

const prisma = new PrismaClient();

console.log(JSON.stringify(prisma.collection.fields, null, 2));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let userId: string | null = null;

  // Check for Authorization header first
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (token) {
    userId = await extractSubFromJwt(token);
  }

  // If no userId from token, check for userId query parameter
  if (!userId) {
    userId = searchParams.get("userId");
  }

  console.log("userId", userId);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized: No valid token or userId provided" }, { status: 401 });
  }

  try {
    const collections = await prisma.collection.findMany({
      where: { userId },
      include: {
        traits: true,
      },
    });
    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json({ error: "Unable to fetch collections" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  const sub = await extractSubFromJwt(token);

  console.log("Extracted sub:", sub);

  if (!sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find or create the user
    let user = await prisma.user.findUnique({
      where: { id: sub },
    });

    if (!user) {
      console.log("User not found, creating new user with id:", sub);
      user = await prisma.user.create({
        data: { id: sub },
      });
    }

    console.log("User:", user);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File;
    const traits = JSON.parse(formData.get("traits") as string);
    console.log("traits", traits)
    const nftCount = Number.parseInt(formData.get("nftCount") as string);
    const verificationStrings = (formData.get("verificationStrings") as string).split(",").map(s => s.trim());
    // Handle file upload
    const imageUrl = await uploadFile(image);


    // Create collection in Crossmint
    const collectionResponse = await fetch("https://staging.crossmint.com/api/2022-06-09/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.CROSSMINT_SERVER_API_KEY as string
      },
      body: JSON.stringify({
        chain: "polygon-amoy",
        metadata: {
            name: name,
            description: description,
            image: imageUrl,
        },
        supplyLimit: nftCount
      })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Collection created in Crossmint:", data);
        console.log("Creating collection for user:", user.id);

        return prisma.collection.create({
            data: {
                crossmintId: data.id,
                name,
                description,
                imageUrl,
                nftCount,
                verificationStrings: {
                    create: verificationStrings.map(value => ({ value })),
                },
                userId: user.id,
                traits: {
                    create: traits.map((trait: { key: string; value: string }) => ({
                        key: trait.key,
                        value: trait.value,
                    })),
                },
            },
            include: {
                traits: true,
            },
        });
    })
    .catch(error => {
        console.error(error);
        throw new Error(error);
    });

    console.log("collectionResponse", collectionResponse)

    return NextResponse.json(collectionResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json({ error: "Unable to create collection" }, { status: 500 });
  }
}