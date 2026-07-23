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
    console.log("API URL:", API_URL);
  }, [API_URL]);

  useEffect(() => {
    if (!selectedMood) {
      setSongs([]);
      return;
    }

    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError("");

        const requestUrl =
          `${API_URL}/api/songs?mood=${encodeURIComponent(selectedMood)}`;

        console.log("Request URL:", requestUrl);

        const response = await fetch(requestUrl);
        const data = await response.json();

        console.log("Songs response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch songs");
        }

        setSongs(data.songs || []);

        if (!data.songs || data.songs.length === 0) {
          setError(`${selectedMood} mood ke songs nahi mile.`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setSongs([]);
        setError(err.message || "Songs load nahi ho paaye.");
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
      audioRef.current.play().catch(() => {
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
    setError("");
  };

  const handleSongPlay = (song) => {
    if (getSongId(song) === getSongId(currentSong)) {
      handlePlayPause();
      return;
    }

    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = async () => {
    if (!currentSong || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (!currentSong || songs.length === 0) return;

    const index = songs.findIndex(
      (song) => getSongId(song) === getSongId(currentSong)
    );

    const nextIndex = (index + 1) % songs.length;

    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (!currentSong || songs.length === 0) return;

    const index = songs.findIndex(
      (song) => getSongId(song) === getSongId(currentSong)
    );

    const previousIndex =
      (index - 1 + songs.length) % songs.length;

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

        {loading && <p>Songs load ho rahe hain...</p>}

        {error && <p className="error-message">{error}</p>}

        <SongList
          songs={songs}
          selectedMood={selectedMood}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlay={handleSongPlay}
        />
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