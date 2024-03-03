import { useLoading } from "@/hooks/loading";
import { HfInference } from "@huggingface/inference";

export const generateSpeechHF = async (file: Blob | null) => {
  const setPendingSpeech = useLoading.getState().setPendingSpeech;
  const inference = new HfInference(process.env.HF_TOKEN);
  if (!file) {
    throw new Error("file is null");
  }
  setPendingSpeech(true);
  const result = await inference.automaticSpeechRecognition({
    model: "openai/whisper-large-v3",
    data: file,
  });
  setPendingSpeech(false);
  return result;
};
