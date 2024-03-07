import { useState, useRef } from 'react';

interface RecordingState {
  isRecording: boolean;
}

interface UseRecordingProps {
  onRecordingStart?: (recorder: MediaRecorder, chunksRef: React.MutableRefObject<Blob[]>) => void;
  stopRecording?: () => void; // Include stopRecording in UseRecordingProps
  onError?: (error: Error) => void;
}

interface UseRecordingResult {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  mediaRecorder: MediaRecorder | null;
}

const useRecording = ({ onRecordingStart, stopRecording, onError }: UseRecordingProps): UseRecordingResult => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
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

        setRecordingState({ isRecording: true });
      })
      .catch(error => {
        console.error("Error accessing microphone:", error);
        if (onError) onError(error);
      });
  };

  const stopRecordingInternal = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      mediaRecorder.current = null;
      setRecordingState({ isRecording: false });
      chunksRef.current = [];
    }
  };

  const stopRecordingWrapper = () => {
    stopRecordingInternal();
    if (stopRecording) {
      stopRecording(); // Call stopRecording callback if provided
    }
  };

  return {
    isRecording: recordingState.isRecording,
    startRecording,
    stopRecording: stopRecordingWrapper, // Return the wrapper function
    mediaRecorder: mediaRecorder.current,
  };
};

export default useRecording;
