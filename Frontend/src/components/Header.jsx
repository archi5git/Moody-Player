import { Music2, Sparkles } from "lucide-react";

function Header() {
  return (
    <header className="header">
      <div className="brand">
        <div className="brand__icon">
          <Music2 size={26} />
        </div>

        <div>
          <h2>Moody Player</h2>
          <p>Music that understands you</p>
        </div>
      </div>

      <div className="ai-badge">
        <Sparkles size={17} />
        AI Mood Music
      </div>
    </header>
  );
}

export default Header;