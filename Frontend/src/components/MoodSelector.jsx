const moods = [
  {
    name: "happy",
    label: "Happy",
    emoji: "😊",
  },
  {
    name: "sad",
    label: "Sad",
    emoji: "😢",
  },
  {
    name: "relaxed",
    label: "Relaxed",
    emoji: "😌",
  },
  {
    name: "energetic",
    label: "Energetic",
    emoji: "⚡",
  },
];

function MoodSelector({ selectedMood, onMoodChange }) {
  return (
    <section className="mood-section">
      <div className="section-heading">
        <p>Choose your vibe</p>
        <h1>How are you feeling today?</h1>
        <span>
          Select your current mood and we will create the perfect playlist.
        </span>
      </div>

      <div className="mood-grid">
        {moods.map((mood) => (
          <button
            type="button"
            key={mood.name}
            className={`mood-card ${
              selectedMood === mood.name ? "mood-card--active" : ""
            }`}
            onClick={() => onMoodChange(mood.name)}
          >
            <span className="mood-card__emoji">{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default MoodSelector;