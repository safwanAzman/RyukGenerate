"use client";

import { Button } from "@/components/ui/button";
import { useState, ChangeEvent, useRef } from "react";
import { generateSpeechHF } from "@/lib/hf";
import { mp3Converter } from "@/utils/mp3-coverter";
import { useLoading } from "@/hooks/loading";
import useRecording from "@/hooks/recording";



export default function Home() {
  const {pendingCovert, pendingSpeech } = useLoading();
  const [mp3File, setMp3File] = useState<string | null>(null);
  const [file, setFile] = useState<Blob | null>(null);
  const [speech, setSpeech] = useState<string | null>(null);

  const { isRecording, startRecording, stopRecording } = useRecording({
    onRecordingStart: (recorder, chunksRef) => {
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const recordedFile = new File([blob], 'recorded_audio.wav', {
          type: blob.type,
          lastModified: Date.now()
        });
        mp3Converter({ file: recordedFile, setFile, setMp3File });
      };
    },
    onError: (error) => {
      alert("Error accessing microphone:" + error.message);
    }
  });

  const handleFile = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    mp3Converter({ file, setFile, setMp3File });
  };

  const generateSpeech = async () => {
    generateSpeechHF(file).then((result) => {
      setSpeech(result.text);
    })
      .catch((error) => {
        alert(error);
      });
  }

  return (
    <main className=" min-h-screen  p-24">
      <div className="space-y-6">
        <div>
          <input type="file" onChange={handleFile} />
        </div>

        <Button variant={'secondary'} onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        
        {pendingCovert ?
          <p>Converting...</p> :
          null
        }
        {mp3File &&
          <>
            <audio controls src={mp3File} />
            <Button onClick={generateSpeech}>Generate Speech</Button>
          </>
        }
        <p>{pendingSpeech ? 'generate...' : speech}</p>
      </div>
    </main>
  );
}
