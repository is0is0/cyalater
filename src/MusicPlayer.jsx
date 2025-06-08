import React, { useState, useRef, useEffect } from 'react';

const playlist = [
  {
    url: "https://raw.githubusercontent.com/is0is0/pls/main/Frank%20Ocean%20-%20White%20Ferrari.mp3",
    title: "Frank Ocean - White Ferrari"
  },
  {
    url: "https://raw.githubusercontent.com/is0is0/pls/main/Hold%20Me%20Down.mp3",
    title: "Daniel Caeser - Hold Me Down"
  },
  {
    url: "https://raw.githubusercontent.com/is0is0/pls/main/Izaya%20Tiji%20-%20What%20Would%20You%20Do%20(prod.%20wifi%20%26%20izaya).mp3",
    title: "Izaya Tiji - What Would You Do"
  },
  {
    url: "https://raw.githubusercontent.com/is0is0/pls/main/Trying.mp3",
    title: "Orion Sun - Trying"
  },
  {
    url: "https://raw.githubusercontent.com/is0is0/pls/main/Tokyo%20Ghoul%20-%20Glassy%20Sky%20%5B%E6%9D%B1%E4%BA%AC%E5%96%B0%E7%A8%AE%20-%E3%83%88%E3%83%BC%E3%82%AD%E3%83%A7%E3%83%BC%E3%82%AF%E3%82%99%E3%83%BC%E3%83%AB-%5D.mp3",
    title: "Yutaka Yamada - Glassy Sky"
  }
];

export default function MusicPlayer({ theme = 'light' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Theme-based styles
  const styles = {
    container: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(90vw, 400px)',
      background: theme === 'light' 
        ? 'rgba(240, 247, 255, 0.9)' 
        : 'rgba(24, 24, 28, 0.9)',
      backdropFilter: 'blur(12px)',
      borderRadius: 16,
      padding: 16,
      boxShadow: theme === 'light'
        ? '0 4px 24px rgba(0, 0, 0, 0.1)'
        : '0 4px 24px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      zIndex: 1000,
      border: theme === 'light'
        ? '1px solid rgba(204, 217, 255, 0.3)'
        : '1px solid rgba(255, 255, 255, 0.1)',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    button: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme === 'light' ? '#23242a' : '#f0f7ff',
      transition: 'all 0.2s ease',
      borderRadius: 8,
    },
    buttonHover: {
      background: theme === 'light' 
        ? 'rgba(0, 0, 0, 0.05)' 
        : 'rgba(255, 255, 255, 0.1)',
    },
    progress: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    progressBar: {
      flex: 1,
      height: 4,
      background: theme === 'light'
        ? 'rgba(0, 0, 0, 0.1)'
        : 'rgba(255, 255, 255, 0.1)',
      borderRadius: 2,
      cursor: 'pointer',
      position: 'relative',
    },
    progressFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      background: theme === 'light' ? '#23242a' : '#f0f7ff',
      borderRadius: 2,
      transition: 'width 0.1s linear',
    },
    time: {
      fontSize: 12,
      color: theme === 'light' ? '#23242a' : '#f0f7ff',
      opacity: 0.7,
      fontVariantNumeric: 'tabular-nums',
    },
    trackInfo: {
      fontSize: 14,
      fontWeight: 500,
      color: theme === 'light' ? '#23242a' : '#f0f7ff',
      textAlign: 'center',
      marginBottom: 4,
    },
    volumeControl: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    volumeSlider: {
      width: 80,
      height: 4,
      background: theme === 'light'
        ? 'rgba(0, 0, 0, 0.1)'
        : 'rgba(255, 255, 255, 0.1)',
      borderRadius: 2,
      cursor: 'pointer',
      position: 'relative',
    },
    volumeFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      background: theme === 'light' ? '#23242a' : '#f0f7ff',
      borderRadius: 2,
      transition: 'width 0.1s linear',
    },
  };

  // Audio control handlers
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevTrack = () => {
    setCurrentTrack((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    setCurrentTrack((prev) => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  const handleVolume = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (muted && newVolume > 0) {
      setMuted(false);
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleSeek = (e) => {
    const percent = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = percent * duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);
    audio.addEventListener('ended', handleNextTrack);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
      audio.removeEventListener('ended', handleNextTrack);
    };
  }, [currentTrack]);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentTrack].url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  return (
    <div style={styles.container}>
      <div style={styles.trackInfo}>
        {playlist[currentTrack].title}
      </div>
      
      <div style={styles.controls}>
        <button
          onClick={handlePrevTrack}
          style={styles.button}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <button
          onClick={handlePlayPause}
          style={styles.button}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        <button
          onClick={handleNextTrack}
          style={styles.button}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18"/>
          </svg>
        </button>

        <div style={styles.volumeControl}>
          <button
            onClick={handleMute}
            style={styles.button}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            {muted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            )}
          </button>
          <div style={styles.volumeSlider}>
            <div style={{ ...styles.volumeFill, width: `${muted ? 0 : volume * 100}%` }}/>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      </div>

      <div style={styles.progress}>
        <span style={styles.time}>{formatTime(currentTime)}</span>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${(currentTime / duration) * 100}%` }}/>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={duration ? currentTime / duration : 0}
            onChange={handleSeek}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
        </div>
        <span style={styles.time}>{formatTime(duration)}</span>
      </div>

      <audio
        ref={audioRef}
        src={playlist[currentTrack].url}
        style={{ display: 'none' }}
      />
    </div>
  );
} 