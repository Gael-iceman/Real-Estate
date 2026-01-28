import React, { useEffect, useRef, useState } from "react";
import { FaMagic, FaPlay, FaSyncAlt } from "react-icons/fa";
import "./VibeStudio.css";

const vibes = [
  {
    name: "Candy Bloom",
    dot: "#ff5d9e",
    colors: {
      "--primary": "#ff5d9e",
      "--primary-dark": "#d81b60",
      "--accent": "#ffd166",
      "--accent-2": "#ffd166",
      "--accent-3": "#4cc9f0",
      "--color-primary": "#ff5d9e",
      "--color-primary-dark": "#d81b60",
      "--color-secondary": "#00bcd4",
      "--color-secondary-dark": "#00838f",
      "--color-accent": "#ffd166",
      "--bg": "#fff0f7",
      "--surface": "#fff7fb"
    }
  },
  {
    name: "Sunny Trail",
    dot: "#ff8c42",
    colors: {
      "--primary": "#ff8c42",
      "--primary-dark": "#d35a00",
      "--accent": "#f9c74f",
      "--accent-2": "#f9c74f",
      "--accent-3": "#4cc9f0",
      "--color-primary": "#ff8c42",
      "--color-primary-dark": "#d35a00",
      "--color-secondary": "#00c49a",
      "--color-secondary-dark": "#008c6c",
      "--color-accent": "#f9c74f",
      "--bg": "#fff6e5",
      "--surface": "#fff9f0"
    }
  },
  {
    name: "Ocean Pop",
    dot: "#4cc9f0",
    colors: {
      "--primary": "#4cc9f0",
      "--primary-dark": "#277da1",
      "--accent": "#f8961e",
      "--accent-2": "#f8961e",
      "--accent-3": "#ff5d9e",
      "--color-primary": "#4cc9f0",
      "--color-primary-dark": "#277da1",
      "--color-secondary": "#9bde7e",
      "--color-secondary-dark": "#59a96a",
      "--color-accent": "#f8961e",
      "--bg": "#e8fbff",
      "--surface": "#f2fdff"
    }
  }
];

const bubbleColors = ["#ff5d9e", "#ffd166", "#4cc9f0", "#80ed99", "#9d4edd"];

const applyVibe = colors => {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

const VibeStudio = () => {
  const [activeVibe, setActiveVibe] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [energy, setEnergy] = useState(70);
  const [bubbles, setBubbles] = useState([]);
  const playAreaRef = useRef(null);
  const autoTimerRef = useRef(null);

  useEffect(() => {
    applyVibe(vibes[activeVibe].colors);
  }, [activeVibe]);

  useEffect(() => {
    if (!autoPlay) {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
      }
      return;
    }
    autoTimerRef.current = setInterval(() => {
      setActiveVibe(prev => (prev + 1) % vibes.length);
    }, 3200);
    return () => clearInterval(autoTimerRef.current);
  }, [autoPlay]);

  const spawnBubble = event => {
    if (!playAreaRef.current) return;
    const rect = playAreaRef.current.getBoundingClientRect();
    const hasPointer = typeof event.clientX === "number";
    const x = hasPointer
      ? ((event.clientX - rect.left) / rect.width) * 100
      : 50;
    const y = hasPointer
      ? ((event.clientY - rect.top) / rect.height) * 100
      : 50;
    const id = Date.now() + Math.random();
    const size = 26 + Math.random() * 48;
    const bubble = {
      id,
      x,
      y,
      size,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)]
    };
    setBubbles(prev => [...prev, bubble].slice(-16));
    setTimeout(() => {
      setBubbles(prev => prev.filter(item => item.id !== id));
    }, 1600);
  };

  const shuffleVibe = () => {
    setActiveVibe(prev => (prev + 1) % vibes.length);
  };

  const handlePlayKeyDown = event => {
    if (event.key === "Enter" || event.key === " ") {
      spawnBubble(event);
    }
  };

  return (
    <section
      className={`vibe-studio vibe-${activeVibe}`}
      style={{ "--vibe-energy": `${energy / 100}` }}
    >
      <div className="container">
        <div className="vibe-header">
          <div>
            <p className="vibe-eyebrow">Play with the vibe</p>
            <h2>Vibe Studio</h2>
            <p>Change the mood, pop bubbles, and make the homepage dance.</p>
          </div>
          <div className="vibe-actions">
            <button className="vibe-btn" type="button" onClick={shuffleVibe}>
              <FaSyncAlt /> Shuffle vibe
            </button>
            <button
              className={`vibe-btn ${autoPlay ? "active" : ""}`}
              type="button"
              onClick={() => setAutoPlay(prev => !prev)}
            >
              <FaPlay /> {autoPlay ? "Stop auto" : "Auto vibe"}
            </button>
          </div>
        </div>

        <div className="vibe-panels">
          <div className="vibe-panel vibe-panel-play">
            <div
              className="vibe-play-area"
              ref={playAreaRef}
              onClick={spawnBubble}
              role="button"
              tabIndex={0}
              onKeyDown={handlePlayKeyDown}
            >
              <div className="vibe-play-text">
                Tap anywhere to pop bubbles and watch the glow.
              </div>
              {bubbles.map(bubble => (
                <span
                  key={bubble.id}
                  className="vibe-bubble"
                  style={{
                    "--bubble-x": `${bubble.x}%`,
                    "--bubble-y": `${bubble.y}%`,
                    "--bubble-size": `${bubble.size}px`,
                    "--bubble-color": bubble.color
                  }}
                />
              ))}
            </div>
          </div>
          <div className="vibe-panel vibe-panel-controls">
            <div className="vibe-card">
              <div className="vibe-card-title">
                <FaMagic /> Mood Dial
              </div>
              <p>Slide to amplify the sparkle and glow.</p>
              <input
                className="vibe-slider"
                type="range"
                min="30"
                max="100"
                value={energy}
                onChange={event => setEnergy(Number(event.target.value))}
              />
              <div className="vibe-meter">
                <span style={{ width: `${energy}%` }} />
              </div>
            </div>
            <div className="vibe-card vibe-card-tags">
              {vibes.map((vibe, index) => (
                <button
                  key={vibe.name}
                  className={`vibe-chip ${index === activeVibe ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveVibe(index)}
                >
                  <span
                    className="vibe-dot"
                    style={{ background: vibe.dot }}
                    aria-hidden="true"
                  />
                  {vibe.name}
                </button>
              ))}
            </div>
            <div className="vibe-card vibe-card-note">
              Playful touches help people explore longer, share more, and fall in love with listings.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VibeStudio;
