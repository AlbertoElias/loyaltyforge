"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@crossmint/client-sdk-react-ui";
import { extractSubFromJwt } from "@/lib/auth";

interface ApiKeyDisplayProps {
  className?: string;
}

export function ApiKeyDisplay({ className = "" }: ApiKeyDisplayProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [fullApiKey, setFullApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { jwt } = useAuth();

  useEffect(() => {
    const fetchApiKey = async () => {
      const sub = extractSubFromJwt(jwt);
      if (sub) {
        setFullApiKey(sub);
        setApiKey(`${sub.slice(0, 12)}...${sub.slice(-4)}`);
      } else {
        setFullApiKey(null);
        setApiKey(null);
      }
    };
    fetchApiKey();
  }, [jwt]);

  const handleCopy = () => {
    if (fullApiKey) {
      navigator.clipboard.writeText(fullApiKey);
      setCopied(true);
      console.log("Copied set to true"); // Debugging line
      setTimeout(() => {
        setCopied(false);
        console.log("Copied set to false"); // Debugging line
      }, 2000);
    }
  };

  return (
    <div className="relative inline-block">
      <code
        onClick={handleCopy}
        onKeyDown={(e) => e.key === "Enter" && handleCopy()}
        tabIndex={0}
        role="button"
        className={`cursor-pointer transition-all duration-300 bg-gray-100 text-gray-700 border border-gray-300 rounded-md py-2 px-4 font-mono text-sm hover:bg-gray-200 hover:border-gray-400 active:bg-gray-300 ${className}`}
      >
        {apiKey || "Loading..."}
      </code>
      {copied && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300">
          <div className="bg-black text-white text-sm rounded-md py-2 px-4 font-semibold shadow-lg">
            Copied!
          </div>
        </div>
      )}
    </div>
  );
}