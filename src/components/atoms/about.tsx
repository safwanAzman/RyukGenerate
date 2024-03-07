"use client"

import Link from "next/link";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { useAbout } from "@/hooks/about";
const CurrentTime = dynamic(() => import('@/components/atoms/currentTime'), { ssr: false });


const About = () => {

  const about = [
    
  ]
  const { setAboutPage } = useAbout();
  return (
    <div className="flex flex-col items-start justify-center h-[60vh]">
      <div className="px-6">
        <h1 className="text-2xl font-bold text-main">About</h1>
        <p className="text-white mt-5 leading-loose max-w-4xl break-words text-sm lg:text-xl">
          Greetings from Ryuk Generate! This site was built by SafwanAzman with the goal of transcribing audio files into accurate text.
          This web application uses <Link href="https://huggingface.co/openai/whisper-large-v3" target="_blank" className="text-main hover:underline">Hugging Face openai/whisper-large-v3 model</Link> to translate audio to text.
          Feel free to explore Ryuk Generate and make use of its conveniences. Happy generating!
        </p>
      </div>
      <div className="fixed bottom-0 w-full py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-end px-6">
          <CurrentTime type="dateTime" />
          <Button onClick={() => setAboutPage(false)} className="text-main px-2 py-2 pb-3 bg-main/20 backdrop-blur-sm rounded-full flex justify-center transition-all hover:scale-105 duration-500 hover:bg-main/20" >
            {"let's generate!"}
          </Button>
          <CurrentTime type="date" />
        </div>
      </div>
    </div>
  )
}
export default About;