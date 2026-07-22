import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

function MusicPlayer({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  currentTime,
  duration,
  volume,
  onSeek,
  onVolumeChange,
}) {
  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <section className="music-player">
      <div className="music-player__song">
        <img src={currentSong.cover} alt={currentSong.title} />

        <div>
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist}</p>
        </div>
      </div>

      <div className="music-player__center">
        <div className="music-player__controls">
          <button type="button" onClick={onPrevious}>
            <SkipBack size={22} fill="currentColor" />
          </button>

          <button
            type="button"
            className="music-player__main-button"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" />
            )}
          </button>

          <button type="button" onClick={onNext}>
            <SkipForward size={22} fill="currentColor" />
          </button>
        </div>

        <div className="music-player__progress">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
          />

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="music-player__volume">
        <Volume2 size={20} />

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
        />
      </div>
    </section>
  );
}

export default MusicPlayer;