"use client";

import { AnotherAnotherInitial } from "@/components/component/another-another-initial";
import { AnotherAnotherLoading } from "@/components/component/another-another-loading";
import { FinalScreen } from "@/components/component/final-screen";
import { useState } from "react";

export type GeneratedImage = {
  generatedImage: string;
};

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [ARGenerating, setARGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage>();

  const handleSubmit = async (prompt: string) => {
    setGenerating(true);
    setUserPrompt(prompt);
    console.log(prompt);
    const response = await fetch(
      "https://unknown.buildship.run/get-prompt-cloth-image",
      {
        method: "POST",
        body: JSON.stringify({
          prompt: prompt
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setGeneratedImage(data);
    setGenerating(false);
  };

  const handleARSubmit = async () => {
    setARGenerating(true);
    console.log("AR opening");
    try {
        const response = await fetch(`http://localhost:5000/run-script?image_url=${encodeURIComponent(generatedImage?.generatedImage!)}`);
        const data = await response.text();
        console.log(data);
    } catch (error) {
        console.error('Error running the script:', error);
    } finally{
      setARGenerating(false);
    }
};

  const reset = () => {
    setUserPrompt("");
    setGeneratedImage(undefined);
  };

  if (generating)
    return <AnotherAnotherLoading />;

  if (generatedImage)
    return (
      <FinalScreen
          image={generatedImage!}
          userPrompt={userPrompt}
          reset={reset}
          onSubmit={handleARSubmit}
      />
    );

  return <
    AnotherAnotherInitial onSubmit={handleSubmit}
    />
  ;
}


