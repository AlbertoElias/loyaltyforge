"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@crossmint/client-sdk-react-ui";
import Image from "next/image";

interface Trait {
  id: string;
  key: string;
  value: string;
}

interface VerificationString {
  id: string;
  value: string;
  used: boolean;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  nftCount: number;
  traits: Trait[];
  verificationStrings: VerificationString[];
}

export default function CollectionPage() {
  const params = useParams();
  const collectionId = params.id as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { jwt } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollection() {
      if (!jwt) return;

      try {
        const response = await fetch(`/api/collections/${collectionId}`, {
          headers: {
            "Authorization": `Bearer ${jwt}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch collection");
        }
        const data = await response.json();
        setCollection(data);
      } catch (err) {
        setError("Error fetching collection");
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [collectionId, jwt]);

  const copyToClipboard = useCallback((text: string, id: string, used: boolean) => {
    if (used) {
      // Don't copy if the verification string is used
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-10">{error}</div>;
  }

  if (!collection) {
    return <div className="text-center text-gray-500 text-xl mt-10">Collection not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{collection.name}</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <Image
              src={collection.imageUrl || "/placeholder-image.jpg"}
              alt={collection.name}
              width={400}
              height={400}
              className="h-full w-full object-cover md:w-48"
            />
          </div>
          <div className="p-8">
            <p className="mt-2 text-gray-500">{collection.description}</p>
            <p className="mt-2 text-gray-600">NFT Count: <span className="font-semibold">{collection.nftCount}</span></p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Attributes</h2>
            <ul className="divide-y divide-gray-200">
              {collection.traits.map((trait) => (
                <li key={trait.id} className="py-3 flex justify-between">
                  <span className="text-gray-600">{trait.key}</span>
                  <span className="text-gray-800 font-medium">{trait.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Verification Strings</h2>
            <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
              {collection.verificationStrings.map((vs) => (
                <li
                  key={vs.id}
                  className={`py-3 ${
                    vs.used ? "text-gray-400 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"
                  } transition-colors duration-200`}
                  onClick={() => !vs.used && copyToClipboard(vs.value, vs.id, vs.used)}
                  onKeyPress={(e) => e.key === "Enter" && !vs.used && copyToClipboard(vs.value, vs.id, vs.used)}
                  tabIndex={vs.used ? -1 : 0}
                  aria-disabled={vs.used}
                >
                  <span className={`text-gray-800 font-mono text-sm break-all ${vs.used ? "line-through" : ""}`}>
                    {vs.value}
                  </span>
                  {copiedId === vs.id && !vs.used && (
                    <span className="ml-2 text-green-500 text-xs">Copied!</span>
                  )}
                  {vs.used && (
                    <span className="ml-2 text-red-500 text-xs">Used</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}