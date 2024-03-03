import { useState, useRef } from 'react';

interface RecordingState {
  isRecording: boolean;
  recordedBlob: Blob | null;
}

interface UseRecordingProps {
  onRecordingStart?: (recorder: MediaRecorder, chunksRef: React.MutableRefObject<Blob[]>) => void;
  onRecordingStop?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

const useRecording = ({ onRecordingStart, onRecordingStop, onError }: UseRecordingProps) => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    recordedBlob: null,
  });
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        mediaRecorder.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        if (onRecordingStart) {
          onRecordingStart(recorder, chunksRef);
        }

        recorder.start();

        setRecordingState({ isRecording: true, recordedBlob: null });
      })
      .catch(error => {
        console.error("Error accessing microphone:", error);
        if (onError) onError(error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setRecordingState(prevState => ({
        ...prevState,
        isRecording: false
      }));
    }
  };

  return {
    isRecording: recordingState.isRecording,
    recordedBlob: recordingState.recordedBlob,
    startRecording,
    stopRecording,
  };
};

export default useRecording;
