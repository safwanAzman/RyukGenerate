import { useLoading } from '@/hooks/loading';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

interface FileConversionParams {
  file: File;
  setFile: (blob: Blob) => void;
  setMp3File: (url: string) => void;
}

export const mp3Converter = ({ file, setFile, setMp3File }: FileConversionParams): void => {
  const setPendingCovert = useLoading.getState().setPendingCovert;
  const ffmpeg = createFFmpeg({
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    log: false,
  });
  setPendingCovert(true);
  ffmpeg.load().then(async () => {
    ffmpeg.FS('writeFile', 'input-file', await fetchFile(file));
    await ffmpeg.run('-i', 'input-file', '-codec:a', 'libmp3lame', 'output.mp3');

    const data = ffmpeg.FS('readFile', 'output.mp3');
    const blob = new Blob([data.buffer], { type: 'audio/mp3' });
    setFile(blob);
    setMp3File(URL.createObjectURL(blob));
    setPendingCovert(false);
  });
};