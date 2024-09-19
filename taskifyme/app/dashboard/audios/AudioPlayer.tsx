"use client";
import { useState, useRef, useEffect } from "react";
//
interface Props {
  src: string;
}
//
export default function AudioPlayer({ src }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1); // Volume between 0 and 1 (default is 1)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    if (!audioRef.current) return;

    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  };

  const changeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", updateProgress);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-4 bg-base-200 rounded-lg shadow-lg">
      <audio ref={audioRef} src={src} preload="auto" className="hidden" />

      <button onClick={togglePlayPause} className="btn btn-primary my-4">
        {isPlaying ? "Pause" : "Play"}
      </button>
      {/* Progress Bar */}
      <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
      {/* Volume Control */}
      <div className="my-4 w-full flex items-center">
        <label className="mr-2">Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVolume}
          className="range range-primary w-full"
        />
      </div>
    </div>
  );
}
