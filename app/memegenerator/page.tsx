"use client";
import Swal from "sweetalert2";
import Image from "next/image";
import React, { useEffect,useState } from "react";
import Loading from "../loading";

interface GeneratorProps {
  searchParams: {
    name: string;
    boxCount: string;
    url: string;
    id: string;
  };
}

const MemeGenerator = ({ searchParams }: GeneratorProps) => {
  console.log(searchParams);
  const { name, url, id, boxCount } = searchParams;
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [inputTexts, setInputTexts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (boxCount) {
      const count = parseInt(boxCount);
      setInputTexts(Array(count).fill(" ")); //Initialize inputTexts with spaces
    }
  }, [boxCount]);

  const handleInput = (index: number, value: string) => {
    const updateInp = [...inputTexts];
    updateInp[index] = value;
    setInputTexts(updateInp);
  }; //handleInput

  //function to generate the meme
  const memeGenerator = async () => {
    setLoading(true);
    try {
    const trimmedTexts=inputTexts.map(text=>text.trim())
      const params = new URLSearchParams();
      params.append("template_id", id!);
      params.append("username", "Muhammad-Umair"!);
      params.append("password", "Salam123");

      // Add all text values from inputTexts to the query parameters
      trimmedTexts.forEach((text, index) => {
        if(text){
        params.append(`boxes[${index}][text]`, text);
        params.append(`boxes[${index}][max_font_size]`, "25");
        }
      });

      const response = await fetch(
        `https://api.imgflip.com/caption_image?${params.toString()}`,
        { method: "POST" }
      );

      const result = await response.json();
      if (result.success) {
        setMemeUrl(result.data.url);
        // Fetch the image as a blob for downloading
        const imageResponse = await fetch(result.data.url); //generate image file from url
        const blob = await imageResponse.blob(); //image response into binary object called blob
        const blobUrl = URL.createObjectURL(blob); //create a temp local url for the blob, allowed to be accessed as a downlaodable file

        setDownloadUrl(blobUrl);

        // setLoading(false);
      } else {
        console.error("Error generating meme:", result.error_message); //Log any api errors
      }
    } catch (error) {
      console.error("Fetch error:", error); //log any api error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while generating the meme. Please try again.",
      });
    }finally {
      setLoading(false);
    }
    
  };
  return (
    <>
      {loading && <Loading />}
      <h2 className="text-center text-[22px] sm:text-[33px] py-3 text-[#000] font-semibold">
        Selected Meme template: {name}
      </h2>
      {/* show temp image */}
      {url && !memeUrl ? (
        <Image
          className="m-auto shadow-lg p-1"
          src={url}
          height={450}
          width={450}
          alt="memes"
        />
      ) : 
        null
      }

      {/* show the generated meme */}
      {memeUrl && (
        <div className="m-auto w-[100%] sm:w-[500px] border-2 p-3 rounded-md mt-10">
          <Image
            src={memeUrl}
            alt={name}
            width={500}
            height={500}
            quality={75}
          />
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={name}
              className="btn btn-info p-4 text-center mt-4 "
            >
              Download Meme
            </a>
          )}
        </div>
      )}
      {/* Meme text input fields */}
      <div>
        <div className="flex flex-col gap-4 w-[100%] sm:w-[450px] m-auto mt-[70px] shadow-lg p-4 rounded-md">
          <h1 className="text-center text-2xl font-semibold">
            Enter Meme text
          </h1>
          {inputTexts.length > 0 && inputTexts.map((_, index) => (
            <input
              type="text"
              key={index}
              onChange={(e) => handleInput(index, e.target.value)}
              placeholder={`Text for box ${index + 1}`}
              className="input input-bordered input-info w-full mb-2"
            />
          ))}



<button onClick={memeGenerator}  className="btn btn-info p-4 text-center mt-4 w-1/2 m-auto" disabled={loading}>{loading? "creating meme...": "generate meme" }</button>

        </div>
      </div>
    </>
  );
  }//MemeGenerator


  export default MemeGenerator;