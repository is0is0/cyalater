import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
    url: "https://raw.githubusercontent.com/is0is0/pls/main/Tokyo%20Ghoul%20-%20Glassy%20Sky%20%5B%E6%9D%B1%E4%BA%AC%E6%96%B0%E7%A8%AE%20-%E3%83%88%E3%83%BC%E3%82%AD%E3%83%A7%E3%83%BC%E3%82%AF%E3%82%99%E3%83%BC%E3%83%AB-%5D.mp3",
    title: "Yutaka Yamada - Glassy Sky"
  }
];

export default function FromYenAndAnge() {
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState("initial");
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuFade, setMenuFade] = useState('in');
  const [bgTheme, setBgTheme] = useState('dark');
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const lastBackClick = useRef(0);

  // Handle initial mount
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    
    // Reset states for navigation
    setShowSplash(true);
    setShowContent(false);
    setAnimationPhase("initial");

    // Smoother transition with longer duration
    const showContentTimer = setTimeout(() => {
      setShowSplash(false);
      setShowContent(true);
    }, 1500);

    return () => {
      clearTimeout(showContentTimer);
    };
  }, [isInitialMount]);

  // Menu options
  const menuOptions = [
    { icon: 'bx bx-home', label: 'cya', onClick: () => navigate('/') },
    { icon: 'bx bx-trophy', label: 'all about you', onClick: () => navigate('/all-about-you') },
    { icon: 'bx bxr bx-note', label: 'from yen & ange', onClick: () => navigate('/from-yen-and-ange') },
    { icon: 'bx bxr bx-photo-album', label: 'throwback', onClick: () => navigate('/throwback-gallery') },
    { icon: 'bx bx-arrow-back', label: 'back', onClick: () => navigate(-1) },
  ];

  // Show menu with fade-in/fade-out
  useEffect(() => {
    if (menuOpen) {
      setMenuVisible(true);
      setMenuFade('in');
    } else if (menuVisible) {
      setMenuFade('out');
      const timeout = setTimeout(() => {
        setMenuVisible(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [menuOpen, menuVisible]);

  // Helper for menu option animation delays
  const menuOptionCount = 3;
  const getMenuOptionClass = (i) => {
    if (menuFade === 'in') return `menu-fade-in menu-fade-in-${i}`;
    if (menuFade === 'out') return `menu-fade-out menu-fade-out-${i}`;
    return '';
  };

  // Background shift timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBgTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const isDarkBg = bgTheme === 'dark';

  // Music player handlers
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const handleSkip = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };

  const handleVolume = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = Number(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    if (muted && newVolume > 0) setMuted(false);
  };

  const handlePrevTrack = () => {
    setCurrentTrack((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    setCurrentTrack((prev) => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNextTrack();
  };

  const handleBack = () => {
    const audio = audioRef.current;
    const now = Date.now();
    if (audio) {
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
      } else if (now - lastBackClick.current < 500) {
        setCurrentTrack((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
        setIsPlaying(true);
      } else {
        audio.currentTime = 0;
      }
      lastBackClick.current = now;
    }
  };

  // Update current time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', update);
    return () => {
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('loadedmetadata', update);
    };
  }, [currentTrack]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const percent = Number(e.target.value);
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (s) => {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={false}
      animate={{
        background: isDarkBg 
          ? 'linear-gradient(120deg, #18181c 0%, #23242a 100%)'
          : 'linear-gradient(120deg, #f0f7ff 0%, #ccd9ff 100%)'
      }}
      transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Splash Screen */}
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(120deg, #18181c, #23242a)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5000,
            overflow: "hidden"
          }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 1.4 }
            }}
            style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center"
            }}
          >
            <motion.h1 
              style={{ 
                fontWeight: "700", 
                fontSize: "clamp(2.5rem, 8vw, 4rem)", 
                letterSpacing: "0.1em", 
                color: "#ccd9ff",
                padding: "0 clamp(16px, 5vw, 32px)",
                textShadow: "0 0 20px rgba(204,217,255,0.2)",
                margin: 0
              }}
            >
              A Message From Yen & Ange
            </motion.h1>
            <motion.h2
              style={{
                marginTop: 16,
                fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
                color: "#ccd9ff",
                opacity: 0.8,
                textAlign: "center",
                textShadow: "0 0 15px rgba(204,217,255,0.2)",
                margin: 0
              }}
            >
              (aka The White One & The Fat)
            </motion.h2>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        style={{ 
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32
        }}
      >
        {/* Cat Image */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginTop: 48,
          marginBottom: 24,
        }}>
          <img
            src="https://i.postimg.cc/pXVMp60Q/image.png"
            alt="Cats"
            style={{
              width: 'min(90vw, 420px)',
              maxWidth: 420,
              height: 'auto',
              borderRadius: 24,
              boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
              objectFit: 'cover',
              margin: '0 auto',
              display: 'block',
            }}
          />
          <div style={{
            fontWeight: 700,
            fontSize: '2.2rem',
            textAlign: 'center',
            marginTop: 24,
            marginBottom: 0,
            letterSpacing: 1,
            color: isDarkBg ? '#ccd9ff' : '#23242a',
          }}>
            mèo béo
          </div>
        </div>

        {/* Hamburger Menu Button */}
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 32,
            zIndex: 4000,
          }}
        >
          <motion.button
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
            whileTap={{ scale: 0.92 }}
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              outline: 'none',
              position: 'relative',
              boxShadow: 'none',
              transition: 'box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1), filter 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              filter: menuOpen ? 'drop-shadow(0 0 12px #ccd9ff88)' : 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 12px #ccd9ffcc)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = menuOpen ? 'drop-shadow(0 0 12px #ccd9ff88)' : 'none';
            }}
            onMouseDown={e => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 18px #ccd9ff)';
            }}
            onMouseUp={e => {
              e.currentTarget.style.filter = menuOpen ? 'drop-shadow(0 0 12px #ccd9ff88)' : 'drop-shadow(0 0 12px #ccd9ffcc)';
            }}
            aria-label="Menu"
          >
            <motion.i 
              className="bx bx-menu" 
              style={{ 
                fontSize: 32,
                color: isDarkBg ? '#ccd9ff' : '#6b7280',
                transition: 'color 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.button>
        </div>

        {/* Menu */}
        <AnimatePresence>
          {menuVisible && (
            <motion.div
              className={`menu-dropdown ${menuFade === 'in' ? 'menu-fade-in' : 'menu-fade-out'}`}
              style={{
                position: 'fixed',
                top: 64,
                right: 32,
                zIndex: 3999,
                minWidth: 200,
                background: 'none',
                boxShadow: 'none',
                borderRadius: 18,
                padding: '12px 0',
                border: 'none',
                pointerEvents: menuOpen ? 'auto' : 'none',
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(-24px)',
                transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1), transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              {menuOptions.map((option, i) => (
                <motion.button
                  key={option.label}
                  className={`menu-btn-iris ${getMenuOptionClass(i)}`}
                  onClick={option.onClick}
                  tabIndex={0}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    width: 200,
                    minWidth: 0,
                    maxWidth: '100vw',
                    minHeight: 44,
                    padding: '0 20px',
                    borderRadius: 12,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    fontSize: 14,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    outline: 'none',
                    border: '2px solid',
                    borderColor: isDarkBg ? '#ccd9ff' : '#6b7280',
                    background: 'transparent',
                    position: 'relative',
                    margin: 0,
                    transform: 'scale(1)',
                    transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkBg ? 'linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)' : '#6b7280';
                    e.currentTarget.querySelector('i').style.color = isDarkBg ? '#6b7280' : '#ccd9ff';
                    e.currentTarget.querySelector('span').style.color = isDarkBg ? '#6b7280' : '#ccd9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.querySelector('i').style.color = isDarkBg ? '#ccd9ff' : '#6b7280';
                    e.currentTarget.querySelector('span').style.color = isDarkBg ? '#ccd9ff' : '#6b7280';
                  }}
                >
                  <motion.i 
                    className={option.icon} 
                    style={{ 
                      color: isDarkBg ? '#ccd9ff' : '#6b7280',
                      fontSize: 18, 
                      transition: 'color 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                      position: 'relative', 
                      zIndex: 1 
                    }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    aria-label={option.label} 
                  />
                  <motion.span 
                    style={{ 
                      color: isDarkBg ? '#ccd9ff' : '#6b7280',
                      transition: 'color 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      position: 'relative',
                      zIndex: 1
                    }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {option.label}
                  </motion.span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music Player */}
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 18,
            transform: 'translate(-50%, 0)',
            opacity: 1,
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'auto',
            background: 'none',
            border: 'none',
            boxShadow: 'none',
            padding: 0,
            minWidth: 0,
            width: 'auto',
            maxWidth: 'calc(100vw - 32px)',
            marginBottom: 0,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            borderRadius: 12,
            padding: 0,
            boxShadow: 'none',
          }}>
            {/* Back Button */}
            <button onClick={handleBack} aria-label="Back or Previous Track" style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', height: 28, width: 28 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDarkBg ? "#6b7280" : "#6b7280"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            {/* Play/Pause */}
            <button onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"} style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', height: 32, width: 32 }}>
              {isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isDarkBg ? "#6b7280" : "#6b7280"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isDarkBg ? "#6b7280" : "#6b7280"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              )}
            </button>
            {/* Skip Button */}
            <button onClick={handleNextTrack} aria-label="Next Track" style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', height: 28, width: 28 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDarkBg ? "#6b7280" : "#6b7280"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
            </button>
            {/* Track Info */}
            <span style={{ 
              color: isDarkBg ? '#6b7280' : '#6b7280',
              fontSize: 12,
              marginLeft: 6,
              marginRight: 2,
              fontWeight: 500,
              letterSpacing: 0.5
            }}>
              Track {currentTrack + 1} / {playlist.length}
            </span>
            {/* Volume */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              style={{ 
                width: 48,
                accentColor: isDarkBg ? '#6b7280' : '#6b7280',
                marginLeft: 4,
                marginRight: 2,
                height: 2,
                background: 'none',
                borderRadius: 2,
                outline: 'none'
              }}
              aria-label="Volume"
            />
            {/* Mute toggle */}
            <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', height: 24, width: 24 }}>
              {muted ? (
                <i className="bx bxr bx-volume-mute" style={{ fontSize: 16, color: isDarkBg ? '#6b7280' : '#6b7280', display: 'inline-block', verticalAlign: 'middle' }} aria-label="Muted" />
              ) : (
                <i className="bx bxr bx-volume" style={{ fontSize: 16, color: isDarkBg ? '#6b7280' : '#6b7280', display: 'inline-block', verticalAlign: 'middle' }} aria-label="Volume" />
              )}
            </button>
          </div>
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 2,
          }}>
            <span style={{ 
              color: isDarkBg ? '#6b7280' : '#6b7280',
              fontSize: 10,
              minWidth: 28,
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums'
            }}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={duration ? currentTime / duration : 0}
              onChange={handleSeek}
              style={{ 
                flex: 1,
                accentColor: isDarkBg ? '#6b7280' : '#6b7280',
                height: 2,
                background: 'none',
                borderRadius: 2,
                outline: 'none'
              }}
              aria-label="Seek"
            />
            <span style={{ 
              color: isDarkBg ? '#6b7280' : '#6b7280',
              fontSize: 10,
              minWidth: 28,
              textAlign: 'left',
              fontVariantNumeric: 'tabular-nums'
            }}>{formatTime(duration)}</span>
          </div>
        </div>
      </motion.div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={playlist[currentTrack].url}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <style>{`
        .menu-fade-in {
          opacity: 0;
          transform: translateY(-16px);
          animation: menuDropFade 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .menu-fade-in-0 { 
          animation-delay: 0.08s;
          transform: translateY(-24px);
          animation: menuDropFade 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.08s forwards;
        }
        .menu-fade-in-1 { 
          animation-delay: 0.26s;
          transform: translateY(-32px);
          animation: menuDropFade 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.26s forwards;
        }
        .menu-fade-in-2 { 
          animation-delay: 0.44s;
          transform: translateY(-40px);
          animation: menuDropFade 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.44s forwards;
        }
        .menu-fade-out {
          opacity: 1;
          transform: translateY(0);
          animation: menuDropFadeOut 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .menu-fade-out-0 { 
          animation-delay: 0s;
          transform: translateY(0);
          animation: menuDropFadeOut 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0s forwards;
        }
        .menu-fade-out-1 { 
          animation-delay: 0.35s;
          transform: translateY(0);
          animation: menuDropFadeOut 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.35s forwards;
        }
        .menu-fade-out-2 { 
          animation-delay: 0.7s;
          transform: translateY(0);
          animation: menuDropFadeOut 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards;
        }
        @keyframes menuDropFade {
          from {
            opacity: 0;
            transform: translateY(-24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes menuDropFadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-8px);
          }
        }
      `}</style>
    </motion.div>
  );
} 