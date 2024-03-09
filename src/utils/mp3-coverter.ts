import { useLoading } from '@/hooks/loading';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

interface FileConversionParams {
  file: File;
  setFile: (blob: Blob) => void;
  setMp3File: (url: string) => void;
}

export const mp3Converter = async ({ file, setFile, setMp3File }: FileConversionParams): Promise<void> => {
  const setPendingCovert = useLoading.getState().setPendingCovert;
  const ffmpeg = new FFmpeg();
  setPendingCovert(true);
  
  await ffmpeg.load();
  const fileDataPromise = fetchFile(file);
  const fileData = await fileDataPromise;
  await ffmpeg.writeFile('input-file', fileData);
  await ffmpeg.exec(['-i', 'input-file', '-codec:a', 'libmp3lame', 'output.mp3']);
  
  const mp3Data = ffmpeg.readFile('output.mp3');
  const mp3Blob = new Blob([await mp3Data], { type: 'audio/mp3' });
  
  setFile(mp3Blob);
  setMp3File(URL.createObjectURL(mp3Blob));
  
  setPendingCovert(false);
};
