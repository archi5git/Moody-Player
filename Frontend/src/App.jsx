import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import MoodSelector from "./components/MoodSelector";
import FacialExpression from "./components/FacialExpression";
import SongList from "./components/SongList";
import MusicPlayer from "./components/MusicPlayer";
import "./App.css";

function App() {
  const audioRef = useRef(null);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [selectedMood, setSelectedMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedMood) {
      setSongs([]);
      return;
    }

    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError("");

        const requestUrl = `${API_URL}/api/songs?mood=${encodeURIComponent(
          selectedMood
        )}`;

        console.log("Request URL:", requestUrl);

        const response = await fetch(requestUrl);
        const data = await response.json();

        console.log("Songs response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch songs");
        }

        const receivedSongs = data.songs || [];

        setSongs(receivedSongs);

        if (receivedSongs.length === 0) {
          setError(`${selectedMood} mood ke songs nahi mile.`);
        }
      } catch (fetchError) {
        console.error("Songs fetch error:", fetchError);
        setSongs([]);
        setError(
          "Songs load nahi ho paaye. Backend URL aur CORS check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [selectedMood, API_URL]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    audioRef.current.src = currentSong.audio;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play().catch((playError) => {
        console.error("Audio play error:", playError);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  const getSongId = (song) => song?._id || song?.id;

  const handleMoodChange = (mood) => {
    if (!mood) return;

    const normalizedMood = mood.toLowerCase().trim();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setSelectedMood(normalizedMood);
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError("");
  };

  const handleSongPlay = (song) => {
    if (getSongId(song) === getSongId(currentSong)) {
      handlePlayPause();
      return;
    }

    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePlayPause = async () => {
    if (!currentSong || !audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (playError) {
      console.error("Audio play error:", playError);
      setIsPlaying(false);
      setError("Audio play nahi ho pa rahi.");
    }
  };

  const handleNext = () => {
    if (!currentSong || songs.length === 0) return;

    const currentIndex = songs.findIndex(
      (song) => getSongId(song) === getSongId(currentSong)
    );

    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + 1) % songs.length;

    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (!currentSong || songs.length === 0) return;

    const currentIndex = songs.findIndex(
      (song) => getSongId(song) === getSongId(currentSong)
    );

    const previousIndex =
      currentIndex === -1
        ? 0
        : (currentIndex - 1 + songs.length) % songs.length;

    setCurrentSong(songs[previousIndex]);
    setIsPlaying(true);
  };

  const handleSeek = (event) => {
    const newTime = Number(event.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }

    setCurrentTime(newTime);
  };

  const handleVolumeChange = (event) => {
    setVolume(Number(event.target.value));
  };

  return (
    <div className={`app app--${selectedMood || "default"}`}>
      <Header />

      <main className="main-content">
        <MoodSelector
          selectedMood={selectedMood}
          onMoodChange={handleMoodChange}
        />

        <FacialExpression
          onMoodDetected={handleMoodChange}
        />

        {loading && (
          <p className="status-message">
            Songs load ho rahe hain...
          </p>
        )}

        {error && (
          <p className="status-message error-message">
            {error}
          </p>
        )}

        {!loading && (
          <SongList
            songs={songs}
            selectedMood={selectedMood}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlay={handleSongPlay}
          />
        )}
      </main>

      <audio
        ref={audioRef}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration)
        }
        onEnded={handleNext}
        onError={() => {
          setIsPlaying(false);
          setError("Audio file load ya play nahi ho rahi.");
        }}
      />

      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}

export default App;