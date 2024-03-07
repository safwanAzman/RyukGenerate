"use client";

import { Button } from "@/components/ui/button";
import { useState, ChangeEvent, useCallback, useRef } from "react";
import { generateSpeechHF } from "@/lib/hf";
import { mp3Converter } from "@/utils/mp3-coverter";
import { useLoading } from "@/hooks/loading";
import useRecording from "@/hooks/recording";
import { AudioLines, Copy, FileText, Loader2, Mic, UploadCloud } from "lucide-react";
import { TypeAnimation } from 'react-type-animation';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { useMediaQuery } from "@react-spectrum/utils";
import dynamic from 'next/dynamic';
import { copyToClipboard } from "@/utils/copyToClipboard";
import { toast } from "sonner"
import { useAbout } from "@/hooks/about";
import About from "@/components/atoms/about";
const CurrentTime = dynamic(() => import('@/components/atoms/currentTime'), { ssr: false });

export default function Home() {

  const mobile = useMediaQuery('(max-width: 480px)')
  const { pendingCovert, pendingSpeech } = useLoading();
  const { aboutPage } = useAbout();
  const [mp3File, setMp3File] = useState<string | null>(null);
  const [file, setFile] = useState<Blob | null>(null);
  const [speech, setSpeech] = useState<string | null>(null);
  const [showGenerate, setShowGenerate] = useState<boolean>(false);
  const [copyTextColor, setCopyTextColor] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);;


  const { isRecording, startRecording, stopRecording, mediaRecorder } = useRecording({
    onRecordingStart: (recorder, chunksRef) => {
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const recordedFile = new File([blob], 'recorded_audio.wav', {
          type: blob.type,
          lastModified: Date.now()
        });
        mp3Converter({ file: recordedFile, setFile, setMp3File });
      };
      setShowGenerate(false);
    },
    stopRecording: () => {
      setShowGenerate(true);
    },
    onError: (error) => {
      toast.error("Error accessing microphone:" + error.message);
    }
  });

  const handleFile = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    mp3Converter({ file, setFile, setMp3File });
    setShowGenerate(true);
  };

  const generateSpeech = useCallback(async () => {
    try {
      const result = await generateSpeechHF(file);
      setSpeech(result.text);
      setShowGenerate(false);
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }, [file]);

  const copySpeech = async () => {
    if (!speech) {
      toast.warning("please generate text first!")
    } else {
      const isResult = await copyToClipboard(speech);
      if (isResult) {
        toast.success("Copied text successfully!")
        setCopyTextColor(true);
      } else {
        toast.error('Failed to copy!')
      }
    };
  }

  return (
    <div>
      {aboutPage ? <About /> :
        <>
          <div className="flex space-x-2 items-center justify-start px-6 mt-4 md:mt-6">
            {pendingCovert ?
              <div className="flex items-center space-x-2 text-white">
                <Loader2 className="animate-spin " />
                <p className="text-xs">Converting audio to mp3...</p>
              </div>
              :
              <>
                <audio ref={audioRef} controls className="h-10" src={mp3File ?? ''} />
                <Button
                  className="bg-main hover:bg-main/90 rounded-full h-10"
                  onClick={generateSpeech}
                  disabled={pendingSpeech || !showGenerate}>
                  {pendingSpeech ?
                    <Loader2 className="animate-spin" /> :
                    <FileText className="mr-2 w-4 h-4" />
                  }
                  <p className="text-xs">
                    {pendingSpeech ? '' : 'Click To Generate Text'}
                  </p>
                </Button>
              </>
            }
          </div>
          <div className="flex flex-col">
            <div className="h-[60vh] lg:h-[50vh] text-white py-10 px-10 flex-col flex items-start justify-start md:items-center md:justify-center overflow-y-auto">
              <p className={`text-base md:text-xl text-left max-w-6xl leading-loose break-words selection:text-main ${copyTextColor ? 'text-main' : ''}`}>
                {pendingSpeech ? 'waiting for generate text...' :
                  speech && !mediaRecorder && !showGenerate ?
                    <TypeAnimation
                      style={{ lineHeight: '1.8' }}
                      sequence={[`${speech}`]}
                      speed={75}
                    />
                    : null
                }
                {mediaRecorder && isRecording && (
                  <LiveAudioVisualizer
                    mediaRecorder={mediaRecorder}
                    width={mobile ? 300 : 500}
                    height={100}
                    barColor="#10b981"
                  />
                )}
              </p>
            </div>
            <div className="absolute bottom-0 w-full py-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 items-end px-6">
                <CurrentTime type="dateTime" />
                <div className="px-2 py-2 pb-3 bg-main/20 backdrop-blur-sm rounded-full" >
                  <div className="gap-0 items-center grid grid-cols-3 ">
                    <div className="pt-1">
                      <label htmlFor="file-upload" className="flex flex-col items-center text-main space-y-2 cursor-pointer hover:scale-105 transition-all duration-500">
                        <UploadCloud />
                        <p className="text-xs text-center">Upload File</p>
                      </label>
                      <input
                        type="file"
                        accept="audio/*"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFile}
                      />
                    </div>
                    <Button
                      variant="scale"
                      className="flex flex-col items-center "
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      <div className={`bg-main/90 p-4 -mt-10 rounded-full border-4 border-white/20`}>
                        {isRecording ?
                          <AudioLines className=" text-emerald-200 animate-pulse" /> :
                          <Mic className=" text-emerald-200" />
                        }
                      </div>
                      <p className="text-xs mt-3  text-main">
                        {isRecording ? 'Stop Voice' : 'Start Voice'}
                      </p>
                    </Button>
                    <Button variant="scale" onClick={copySpeech} >
                      <div className="flex flex-col items-center text-main space-y-2 pt-2">
                        <Copy className="w-5 h-5" />
                        <p className="text-xs text-center">Copy Text</p>
                      </div>
                    </Button>
                  </div>
                </div>
                <CurrentTime type="date" />
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
}
