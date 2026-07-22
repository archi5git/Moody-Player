import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import MoodSelector from "./components/MoodSelector";
import FacialExpression from "./components/FacialExpression";
import SongList from "./components/SongList";
import MusicPlayer from "./components/MusicPlayer";
import "./App.css";

function App() {
  const audioRef = useRef(null);

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
        setSongs([]);

        const url = `http://localhost:3000/api/songs?mood=${encodeURIComponent(
          selectedMood
        )}`;

        console.log("Fetching songs from:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("Backend response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Songs fetch failed");
        }

        const receivedSongs = Array.isArray(data)
          ? data
          : data.songs || [];

        setSongs(receivedSongs);

        if (receivedSongs.length === 0) {
          setError(
            `${selectedMood} mood ke liye koi song nahi mila.`
          );
        }
      } catch (fetchError) {
        console.error("Songs fetch error:", fetchError);

        setSongs([]);
        setError(
          "Songs load nahi ho paaye. Backend check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [selectedMood]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!currentSong || !audioRef.current) {
      return;
    }

    audioRef.current.src = currentSong.audio;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((playError) => {
          console.error("Audio play error:", playError);
          setIsPlaying(false);
        });
    }
  }, [currentSong]);

  const getSongId = (song) => {
    return song?._id || song?.id;
  };

  const handleMoodChange = (mood) => {
    if (!mood) {
      return;
    }

    const normalizedMood = mood.toLowerCase().trim();

    console.log("Mood received in App:", normalizedMood);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }

    setSelectedMood(normalizedMood);
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError("");
  };

  const handleSongPlay = (song) => {
    const selectedSongId = getSongId(song);
    const currentSongId = getSongId(currentSong);

    if (selectedSongId === currentSongId) {
      handlePlayPause();
      return;
    }

    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
    setError("");
  };

  const handlePlayPause = async () => {
    if (!currentSong || !audioRef.current) {
      return;
    }

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
    if (!currentSong || songs.length === 0) {
      return;
    }

    const currentSongId = getSongId(currentSong);

    const currentIndex = songs.findIndex(
      (song) => getSongId(song) === currentSongId
    );

    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + 1) % songs.length;

    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
    setError("");
  };

  const handlePrevious = () => {
    if (!currentSong || songs.length === 0) {
      return;
    }

    const currentSongId = getSongId(currentSong);

    const currentIndex = songs.findIndex(
      (song) => getSongId(song) === currentSongId
    );

    const previousIndex =
      currentIndex === -1
        ? 0
        : (currentIndex - 1 + songs.length) %
          songs.length;

    setCurrentSong(songs[previousIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
    setError("");
  };

  const handleSeek = (event) => {
    if (!audioRef.current) {
      return;
    }

    const newTime = Number(event.target.value);

    audioRef.current.currentTime = newTime;
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
