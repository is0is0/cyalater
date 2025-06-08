import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const allAboutYouList = [
  "Nonstop Perseverance",
  "Amazing Cat Mom of 2",
  "Generous Heart",
  "Sometimes Funny",
  "Big Head",
  "Open-Minded",
  "Very Curious",
  "Welcoming",
  "Optimistic",
  "Loving",
  "Pretty",
  "Ambitious",
  "Risk Taker",
  "Self-Resilient",
  "Cooperative",
  "A Great Friend",
  "Thoughtful",
  "Creative",
  "Adventurous",
  "Value Based",
  "Beautiful",
  "Weird",
  "Indifferent",
  "Compassionate",
  "Unapologetically You"
];

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

const ITEM_HEIGHT = 96;
const VISIBLE_COUNT = 5;

export default function AllAboutYou() {
  const [index, setIndex] = useState(0);
  const [bgTheme, setBgTheme] = useState('light');
  const touchStart = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const lastBackClick = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuFade, setMenuFade] = useState('in');
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState("initial");

  // Opening sequence animation
  useEffect(() => {
    // Handle splash screen animation sequence
    const initialTimer = setTimeout(() => {
      setAnimationPhase("slideUp");
    }, 1000);

    const fadeToGreyTimer = setTimeout(() => {
      setAnimationPhase("fadeToGrey");
    }, 2000);

    const showContentTimer = setTimeout(() => {
      setShowSplash(false);
      setShowContent(true);
      setAnimationPhase("complete");
    }, 3000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(fadeToGreyTimer);
      clearTimeout(showContentTimer);
    };
  }, []);

  // Background shift timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBgTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getVisibleItems = (centerIdx) => {
    const result = [];
    for (let i = -2; i <= 2; i++) {
      const idx = (centerIdx + i + allAboutYouList.length) % allAboutYouList.length;
      result.push({ text: allAboutYouList[idx], rel: i });
    }
    return result;
  };

  const next = () => setIndex((prev) => (prev + 1) % allAboutYouList.length);
  const prev = () => setIndex((prev) => (prev - 1 + allAboutYouList.length) % allAboutYouList.length);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, []);

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStart.current;
    if (diff > 50) prev();
    if (diff < -50) next();
    touchStart.current = null;
  };

  const slots = getVisibleItems(index);
  const isDarkBg = bgTheme === 'dark';

  // Generate random sparks for dark theme
  const sparks = isDarkBg
    ? Array.from({ length: 6 }).map((_, i) => {
        const size = Math.random() * 120 + 80;
        const top = Math.random() * 80 + 5;
        const left = Math.random() * 80 + 5;
        const colors = [
          'rgba(204,217,255,0.18)',
          'rgba(251,194,235,0.18)',
          'rgba(161,196,253,0.18)',
          'rgba(255,255,255,0.10)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              background: `radial-gradient(circle, ${color} 0%, transparent 80%)`,
              opacity: 1,
              borderRadius: '50%',
              filter: 'blur(18px)',
              zIndex: 0,
              pointerEvents: 'none',
              transition: 'opacity 1.5s',
            }}
          />
        );
      })
    : null;

  // Menu options
  const menuOptions = [
    { icon: 'bx bx-home', label: 'cya', onClick: () => navigate('/') },
    { icon: 'bx bx-trophy', label: 'all about you', onClick: () => setMenuOpen(false) },
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
  const menuOptionCount = 3; // update if you add more menu options
  const getMenuOptionClass = (i) => {
    if (menuFade === 'in') return `menu-fade-in menu-fade-in-${i}`;
    if (menuFade === 'out') return `menu-fade-out menu-fade-out-${i}`;
    return '';
  };

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

  return (
    <motion.div
      initial={false}
      animate={bgTheme}
      variants={{
        light: { background: 'linear-gradient(120deg, #f0f7ff 0%, #ccd9ff 100%)' },
        dark: { background: 'linear-gradient(120deg, #18181c 0%, #23242a 100%)' },
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
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(120deg, #2a2a2a, #3a3a3a, #2a2a2a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5000,
          opacity: animationPhase === "fadeToGrey" ? 0 : 1,
          transition: "opacity 1s ease-out"
        }}>
          {/* Iridescent sparks */}
          {Array.from({ length: 8 }).map((_, i) => {
            const size = Math.random() * 160 + 100;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const colors = [
              'rgba(204,217,255,0.15)',
              'rgba(251,194,235,0.15)',
              'rgba(161,196,253,0.15)',
              'rgba(255,255,255,0.08)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const duration = 15 + Math.random() * 10; // 15-25 seconds
            const delay = Math.random() * 5; // 0-5 seconds delay
            const xMove = 4 + Math.random() * 4; // 4-8px movement
            const yMove = 4 + Math.random() * 4; // 4-8px movement
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: `${top}%`,
                  left: `${left}%`,
                  width: size,
                  height: size,
                  background: `radial-gradient(circle, ${color} 0%, transparent 80%)`,
                  opacity: 1,
                  borderRadius: '50%',
                  filter: 'blur(24px)',
                  zIndex: 0,
                  pointerEvents: 'none',
                  animation: `sparkFloat${i} ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}
          <h1 style={{ 
            fontWeight: "700", 
            fontSize: "clamp(2.5rem, 8vw, 4rem)", 
            textAlign: "center", 
            letterSpacing: "0.1em", 
            color: "#ffffff",
            animation: animationPhase === "initial" 
              ? "appreciateSlideIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards"
              : "none",
            padding: "0 clamp(16px, 5vw, 32px)",
            position: "relative",
            zIndex: 1,
            textShadow: "0 0 20px rgba(204,217,255,0.3)"
          }}>I appreciate you.</h1>
        </div>
      )}

      {/* Main Content */}
      <div style={{ 
        opacity: showContent ? 1 : 0,
        transition: "opacity 0.8s ease-out",
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Iridescent sparks for dark bg */}
        {sparks}
        {/* Subtle sparks for light bg */}
        {!isDarkBg && (
          <>
            <div style={{
              position: "absolute",
              top: -40,
              left: -40,
              width: 160,
              height: 160,
              background: "radial-gradient(circle at 60% 40%, #a1c4fd 0%, transparent 80%)",
              opacity: 0.25,
              borderRadius: "50%",
              filter: "blur(8px)",
              zIndex: 1,
              pointerEvents: "none"
            }} />
            <div style={{
              position: "absolute",
              bottom: -40,
              right: -40,
              width: 160,
              height: 160,
              background: "radial-gradient(circle at 40% 60%, #fbc2eb 0%, transparent 80%)",
              opacity: 0.25,
              borderRadius: "50%",
              filter: "blur(8px)",
              zIndex: 1,
              pointerEvents: "none"
            }} />
          </>
        )}

        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            height: ITEM_HEIGHT * VISIBLE_COUNT,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '600px',
            padding: '0 20px'
          }}
        >
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
                  color: isDarkBg ? '#6b7280' : '#6b7280',
                  transition: 'color 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.button>
          </div>

          <AnimatePresence initial={false}>
            {slots.map(({ text, rel }, i) => {
              const scale = 1 - Math.abs(rel) * 0.1;
              const opacity = 1 - Math.abs(rel) * 0.25;
              const blur = Math.abs(rel) * 2.5;
              const y = rel * ITEM_HEIGHT;

              return (
                <motion.div
                  key={text}
                  layout
                  initial={{ y: y + 20, opacity: 0, scale: 0.95 }}
                  animate={{ y, opacity, scale, filter: `blur(${blur}px)` }}
                  exit={{ y: y - 20, opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                  style={{
                    position: 'absolute',
                    top: `calc(50% - ${ITEM_HEIGHT / 2}px)`,
                    height: ITEM_HEIGHT,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: rel === 0 ? 56 : 44,
                    fontWeight: 600,
                    color: isDarkBg ? '#6b7280' : '#6b7280',
                    pointerEvents: 'none',
                    transition: 'color 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                    background: rel === 0 && isDarkBg
                      ? 'linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)'
                      : rel === 0 && !isDarkBg
                      ? 'rgba(30,30,40,0.65)'
                      : 'transparent',
                    WebkitBackgroundClip: rel === 0 ? 'text' : 'none',
                    WebkitTextFillColor: rel === 0 ? 'transparent' : undefined,
                    MozBackgroundClip: rel === 0 ? 'text' : 'none',
                    MozTextFillColor: rel === 0 ? 'transparent' : undefined,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {text}
                </motion.div>
              );
            })}
          </AnimatePresence>
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
                  {/* Icon */}
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
                  {/* Text */}
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

        {/* Background Audio */}
        <audio
          ref={audioRef}
          src={playlist[currentTrack].url}
          loop={false}
          autoPlay
          onEnded={handleEnded}
          style={{ display: 'none' }}
        />

        {/* Audio Controls Bar */}
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
      </div>

      <style>
        {`
          ${Array.from({ length: 8 }).map((_, i) => {
            const xMove = 4 + Math.random() * 4;
            const yMove = 4 + Math.random() * 4;
            return `
              @keyframes sparkFloat${i} {
                0%, 100% {
                  transform: translate(0, 0);
                }
                25% {
                  transform: translate(${xMove}px, ${yMove}px);
                }
                50% {
                  transform: translate(${-xMove}px, ${yMove}px);
                }
                75% {
                  transform: translate(${-xMove}px, ${-yMove}px);
                }
              }
            `;
          }).join('')}

          @keyframes appreciateSlideIn {
            0% {
              opacity: 0;
              transform: translateY(40px) scale(0.9);
              filter: blur(8px);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(${Math.random() * 12 - 6}px, ${Math.random() * 12 - 6}px);
            }
          }
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
        `}
      </style>
    </motion.div>
  );
}
