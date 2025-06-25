"use client";
import Swal from "sweetalert2";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import Loading from "../loading";

// --- Constants for Configuration ---
const IMGFLIP_API_URL = "https://api.imgflip.com/caption_image";
const API_USERNAME = "Muhammad-Umair";
const API_PASSWORD = "Salam123";

// --- Type Definitions ---
interface Meme {
  url: string;
  downloadUrl: string;
}

interface GeneratorProps {
  searchParams: {
    name: string;
    boxCount: string;
    url: string;
    id: string;
  };
}

// --- Custom Hook for Meme Generation Logic ---
const useMemeApi = (templateId: string) => {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateMeme = useCallback(
    async (texts: string[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          template_id: templateId,
          username: API_USERNAME,
          password: API_PASSWORD,
        });

        texts.forEach((text, index) => {
          const trimmedText = text.trim();
          if (trimmedText) {
            params.append(`boxes[${index}][text]`, trimmedText);
            params.append(`boxes[${index}][max_font_size]`, "25");
          }
        });

        const response = await fetch(
          `${IMGFLIP_API_URL}?${params.toString()}`,
          {
            method: "POST",
          }
        );

        const result = await response.json();

        if (result.success) {
          const imageResponse = await fetch(result.data.url);
          const blob = await imageResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
          setMeme({ url: result.data.url, downloadUrl: blobUrl });
        } else {
          throw new Error(result.error_message || "Failed to generate meme.");
        }
      } catch (err: any) {
        console.error("Meme generation failed:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [templateId]
  );

  return { meme, isLoading, error, generateMeme };
};

// --- UI Component for Displaying the Generated Meme ---
const MemeDisplay = ({
  meme,
  templateName,
}: {
  meme: Meme;
  templateName: string;
}) => (
  <div className="m-auto w-[100%] sm:w-[500px] border-2 p-3 rounded-md mt-10">
    <Image
      src={meme.url}
      alt={templateName}
      width={500}
      height={500}
      quality={75}
      priority
    />
    <a
      href={meme.downloadUrl}
      download={templateName}
      className="btn btn-info p-4 text-center mt-4"
    >
      Download Meme
    </a>
  </div>
);

// --- UI Component for the Input Form ---
const MemeForm = ({
  boxCount,
  onSubmit,
  isLoading,
}: {
  boxCount: number;
  onSubmit: (texts: string[]) => void;
  isLoading: boolean;
}) => {
  const [inputs, setInputs] = useState<string[]>(() =>
    Array(boxCount).fill("")
  );

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-[100%] sm:w-[450px] m-auto mt-[70px] shadow-lg p-4 rounded-md"
    >
      <h1 className="text-center text-2xl font-semibold">Enter Meme Text</h1>
      {inputs.map((_, index) => (
        <input
          key={index}
          type="text"
          value={inputs[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
          placeholder={`Text for box ${index + 1}`}
          className="input input-bordered input-info w-full mb-2"
        />
      ))}
      <button
        type="submit"
        className="btn btn-info p-4 text-center mt-4 w-1/2 m-auto"
        disabled={isLoading}
      >
        {isLoading ? "Creating Meme..." : "Generate Meme"}
      </button>
    </form>
  );
};

// --- Main Page Component ---
const RefactoredMemeGenerator = ({ searchParams }: GeneratorProps) => {
  const { name, url, id, boxCount } = searchParams;
  const { meme, isLoading, error, generateMeme } = useMemeApi(id);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Something went wrong: ${error}`,
      });
    }
  }, [error]);

  const numBoxCount = parseInt(boxCount, 10) || 0;

  return (
    <>
      {isLoading && <Loading />}
      <h2 className="text-center text-[22px] sm:text-[33px] py-3 text-[#000] font-semibold">
        Selected Meme Template: {name}
      </h2>

      {!meme && url && (
        <Image
          className="m-auto shadow-lg p-1"
          src={url}
          height={450}
          width={450}
          alt="Meme template preview"
        />
      )}

      {meme && <MemeDisplay meme={meme} templateName={name} />}

      <MemeForm
        boxCount={numBoxCount}
        onSubmit={generateMeme}
        isLoading={isLoading}
      />
    </>
  );
};

export default RefactoredMemeGenerator;
