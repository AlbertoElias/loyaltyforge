"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@crossmint/client-sdk-react-ui";
import Link from "next/link";
import Image from "next/image";

interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  nftCount: number;
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const { jwt } = useAuth();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections", {
          headers: {
            "Authorization": `Bearer ${jwt}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Collections:", data);
          setCollections(data);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    if (jwt) {
      fetchCollections();
    }
  }, [jwt]);

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Loyalty Programs</h1>
        <Link href="/console/collections/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-300 ease-in-out">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Add icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Loyalty Program
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/console/collections/${collection.id}`} className="block h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
              <div className="relative h-48 w-full flex-shrink-0">
                <Image
                  src={collection.imageUrl || "/placeholder-image.jpg"}
                  alt={collection.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out transform"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{collection.name}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{collection.description}</p>
                <div className="flex items-center text-sm text-gray-500 mt-auto">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {collection.nftCount} NFTs
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
