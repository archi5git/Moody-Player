import { Pause, Play } from "lucide-react";

function SongCard({ song, currentSong, isPlaying, onPlay }) {
  const isCurrentSong = currentSong?.id === song.id;

  return (
    <article
      className={`song-card ${
        isCurrentSong ? "song-card--active" : ""
      }`}
    >
      <div className="song-card__image-wrapper">
        <img
          src={song.cover}
          alt={`${song.title} cover`}
          className="song-card__image"
        />

        <button
          type="button"
          className="song-card__play-button"
          onClick={() => onPlay(song)}
          aria-label={`Play ${song.title}`}
        >
          {isCurrentSong && isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" />
          )}
        </button>
      </div>

      <div className="song-card__info">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
      </div>
    </article>
  );
}

export default SongCard;