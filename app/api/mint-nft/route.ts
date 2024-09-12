import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const CROSSMINT_API_URL = "https://staging.crossmint.com/api/2022-06-09/collections";

export async function POST(request: Request) {
  try {
    const { userId, walletAddress, verificationString } = await request.json();

    console.log("Received request with:", { userId, walletAddress, verificationString });

    // Find the collection with the given verification string and userId
    const collection = await prisma.collection.findFirst({
      where: {
        userId: userId,
        verificationStrings: {
          some: {
            value: verificationString,
            used: false
          }
        }
      },
      include: {
        verificationStrings: true,
        traits: true
      }
    });

    console.log("Query result:", collection);

    if (!collection) {
      console.log("Collection not found. Querying all collections for user...");
      const allUserCollections = await prisma.collection.findMany({
        where: { userId: userId },
        include: { verificationStrings: true }
      });
      console.log("All user collections:", allUserCollections);

      return NextResponse.json({ 
        error: "Collection not found or unauthorized",
        debug: { 
          queriedUserId: userId,
          queriedVerificationString: verificationString,
          allUserCollections 
        }
      }, { status: 404 });
    }

    if (collection.nftCount <= 0) {
      return NextResponse.json({ error: "No more NFTs available in this collection" }, { status: 400 });
    }

    // Construct the full URL for the Crossmint API request
    const fullUrl = `${CROSSMINT_API_URL}/${collection.crossmintId}/nfts`;
    console.log("traits", collection.traits)
    console.log("sending nft", {
        recipient: `polygon-amoy:${walletAddress}`,
        metadata: {
          name: collection.name,
          image: `${process.env.BASE_URL}${collection.imageUrl}`,
          description: collection.description,
          attributes: collection.traits.map((trait: any) => ({
            trait_type: trait.key,
            value: trait.value,
          })),
        },
      });

    // Make the request to Crossmint
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.CROSSMINT_SERVER_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: `polygon-amoy:${walletAddress}`,
        metadata: {
          name: collection.name,
          image: `${process.env.BASE_URL}${collection.imageUrl}`,
          description: collection.description,
          attributes: collection.traits.map((trait) => ({
            trait_type: trait.key,
            value: trait.value,
          })),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: "Failed to mint NFT", details: errorData }, { status: response.status });
    }

    const mintedNFT = await response.json();

    // Update the nftCount in the collection (decrease) and mark the verification string as used
    await prisma.$transaction([
      prisma.collection.update({
        where: { id: collection.id },
        data: { nftCount: { decrement: 1 } },
      }),
      prisma.verificationString.updateMany({
        where: {
          collectionId: collection.id,
          value: verificationString,
          used: false
        },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ success: true, nft: mintedNFT });
  } catch (error) {
    console.error("Error minting NFT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}