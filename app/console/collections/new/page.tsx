"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@crossmint/client-sdk-react-ui";
import Button from "@/app/(components)/Button";
import Image from "next/image";

interface Trait {
  key: string;
  value: string;
}

export default function NewCollectionPage() {
  const router = useRouter();
  const { jwt } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [traits, setTraits] = useState<Trait[]>([{ key: "", value: "" }]);
  const [nftCount, setNftCount] = useState(1);
  const [verificationStrings, setVerificationStrings] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTraitChange = (index: number, field: "key" | "value", value: string) => {
    const newTraits = [...traits];
    newTraits[index][field] = value;
    setTraits(newTraits);
  };

  const addTrait = () => {
    setTraits([...traits, { key: "", value: "" }]);
  };

  const removeTrait = (index: number) => {
    const newTraits = traits.filter((_, i) => i !== index);
    setTraits(newTraits);
  };

  const generateVerificationStrings = () => {
    const strings = Array.from({ length: nftCount }, () =>
      Math.random().toString(36).substring(2, 15)
    );
    setVerificationStrings(strings.join(", "));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image as Blob);
    formData.append("traits", JSON.stringify(traits));
    formData.append("nftCount", nftCount.toString());
    formData.append("verificationStrings", verificationStrings);

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create collection");
      }

      const createdCollection = await response.json();
      console.log("Created collection:", createdCollection);
      router.push("/console/collections");
    } catch (error) {
      console.error("Error creating collection:", error);
      setIsSubmitting(false);
      // TODO: Show error message to the user
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Loyalty Program</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Image
          </label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
            required
          />
          <div 
            className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer" 
            onClick={() => document.getElementById("image")?.click()}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("image")?.click()}
            tabIndex={0}
            role="button"
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" width={200} height={200} className="object-cover rounded-lg" />
            ) : (
              <div className="text-gray-500">Click to upload image</div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Attributes
          </label>
          {traits.map((trait, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={trait.key}
                onChange={(e) => handleTraitChange(index, "key", e.target.value)}
                placeholder="Attribute Name"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={trait.value}
                onChange={(e) => handleTraitChange(index, "value", e.target.value)}
                placeholder="Value"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeTrait(index)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <Button onClick={addTrait} variant="secondary" className="mt-2">Add Trait</Button>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nftCount">
            Number of Total Rewards
          </label>
          <input
            id="nftCount"
            type="number"
            value={nftCount}
            onChange={(e) => setNftCount(Number(e.target.value))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verificationStrings">
            Verification Strings
          </label>
          <textarea
            id="verificationStrings"
            value={verificationStrings}
            onChange={(e) => setVerificationStrings(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter comma-separated verification strings"
            required
          />
          <div className="mt-2">
            <Button onClick={generateVerificationStrings} variant="secondary">
              Generate Verification Strings
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Loyalty Program"}
          </Button>
        </div>
      </form>
    </div>
  );
}