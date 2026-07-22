
import SongCard from "./SongCard";

function SongList({
  songs = [],
  selectedMood,
  currentSong,
  isPlaying,
  onPlay,
}) {
  const hasSelectedMood = Boolean(selectedMood);
  const hasSongs = songs.length > 0;

  return (
    <section className="songs-section">
      <div className="songs-section__heading">
        <div>
          <p>Recommended playlist</p>

          <h2>
            {hasSelectedMood
              ? `${selectedMood} mood songs`
              : "Select your mood"}
          </h2>
        </div>

        {hasSongs && (
          <span>
            {songs.length} {songs.length === 1 ? "song" : "songs"}
          </span>
        )}
      </div>

      {!hasSongs ? (
        <div className="empty-state">
          <span>🎧</span>

          <h3>
            {hasSelectedMood
              ? "No songs found"
              : "No mood selected"}
          </h3>

          <p>
            {hasSelectedMood
              ? `${selectedMood} mood ke songs database mein available nahi hain.`
              : "Choose a mood to see recommended songs."}
          </p>
        </div>
      ) : (
        <div className="songs-grid">
          {songs.map((song) => (
            <SongCard
              key={song._id || song.id}
              song={song}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlay={onPlay}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default SongList;

