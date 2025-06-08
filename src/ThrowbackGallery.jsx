import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const images = [
  { src: "https://i.postimg.cc/qMF9nP5X/IMG-1589.jpg", date: "August 4, 2024" },
  { src: "https://i.postimg.cc/x1smFvW9/25-A9-BD76-114-D-40-F1-9986-73239912-ACED-1-105-c.jpg", date: "August 5, 2024" },
  { src: "https://i.postimg.cc/QdLNNH1c/64061149-82-DF-46-D4-8-D74-5883-B4-E8-A791-1-105-c.jpg", date: "August 4, 2024" },
  { src: "https://i.postimg.cc/RVPVr4Tz/14-BE204-C-6-E55-40-AD-BD55-8-F9-F17-CAF378-4-5005-c.jpg", date: "October 11, 2024" },
  { src: "https://i.postimg.cc/BbB5ZXnp/D2-D59977-EF9-A-4086-8624-DFC9-E1-AEBF25-4-5005-c.jpg", date: "October 11, 2024" },
  { src: "https://i.postimg.cc/T1nyfSCX/3-DFB2-C75-EB4-D-4-DAC-8-E21-74-FA871-DE101-1-105-c.jpg", date: "October 12, 2024" },
  { src: "https://i.postimg.cc/tRdCRh9y/C8-AA24-B3-A745-46-DA-9504-41-F3-CF1-E0-B7-E-1-105-c.jpg", date: "October 12, 2024" },
  { src: "https://i.postimg.cc/Gp3SYnyq/macos-startup-screen-disk-unavailable-1024x624.jpg", date: "June 23, 2025" },
];

const IMAGE_SIZE = 320;
const SIDE_IMAGE_SIZE = 180;
const BORDER_RADIUS = 24;
const BORDER = "3px solid #e6e8f0";
const GLOW_COLOR = "rgba(204,217,255,0.13)";
const GLOW_COLOR_HOVER = "rgba(204,217,255,0.32)";
const GLOW_SIZE = 120;
const GLOW_SIZE_HOVER = 180;

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

export default function ThrowbackGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isCenterHovered, setIsCenterHovered] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuFade, setMenuFade] = useState('in');
  const [theme, setTheme] = useState('iridescent');
  const [flares, setFlares] = useState([]);
  const navigate = useNavigate();
  const autoResumeTimeout = useRef(null);
  const [bgTheme, setBgTheme] = useState('light'); // 'light' or 'dark'
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState("initial");
  const [isInitialMount, setIsInitialMount] = useState(true);

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

    // Start animation sequence
    const initialTimer = setTimeout(() => {
      setAnimationPhase("slideUp");
    }, 100);

    const fadeToGreyTimer = setTimeout(() => {
      setAnimationPhase("fadeToGrey");
    }, 1100);

    const showContentTimer = setTimeout(() => {
      setShowSplash(false);
      setShowContent(true);
      setAnimationPhase("complete");
    }, 2100);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(fadeToGreyTimer);
      clearTimeout(showContentTimer);
    };
  }, [isInitialMount]);

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Auto-rotate logic
  useEffect(() => {
    if (!autoRotate || isCenterHovered) return;
    const interval = setInterval(() => handleNext(1), 3000);
    return () => clearInterval(interval);
  }, [currentIndex, autoRotate, isCenterHovered]);

  // Pause auto-rotation and navigation on hover
  const handleCenterMouseEnter = () => {
    setIsCenterHovered(true);
    setAutoRotate(false);
  };
  const handleCenterMouseLeave = () => {
    setIsCenterHovered(false);
    setAutoRotate(true);
  };

  // Disable navigation if hovering center
  const canNavigate = !isCenterHovered;

  // Pause auto-rotation on user click, resume after 5s
  const handleUserSelect = (dir) => {
    setAutoRotate(false);
    if (autoResumeTimeout.current) clearTimeout(autoResumeTimeout.current);
    handleNext(dir);
    autoResumeTimeout.current = setTimeout(() => {
      setAutoRotate(true);
    }, 5000);
  };

  const handleNext = (dir) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + images.length) % images.length);
  };

  // Carousel logic
  const prevIdx = (currentIndex - 1 + images.length) % images.length;
  const nextIdx = (currentIndex + 1) % images.length;

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      filter: "blur(8px)",
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        filter: { duration: 0.2 }
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      filter: "blur(8px)",
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }),
  };

  // Menu options
  const menuOptions = [
    { icon: 'bx bx-home', label: 'cya', onClick: () => navigate('/') },
    { icon: 'bx bx-trophy', label: 'all about you', onClick: () => navigate('/all-about-you') },
    { icon: 'bx bxr bx-note', label: 'from yen & ange', onClick: () => navigate('/from-yen-and-ange') },
    { icon: 'bx bxr bx-photo-album', label: 'throwback', onClick: () => setMenuOpen(false) },
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

  // Text style helpers
  const iridescentText = {
    background: 'linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    MozBackgroundClip: 'text',
    MozTextFillColor: 'transparent',
    fontWeight: 600
  };
  const darkText = {
    color: '#23242a',
    fontWeight: 600
  };

  // Background gradients
  const bgGradients = {
    light: 'linear-gradient(120deg, #f0f7ff 0%, #ccd9ff 100%)',
    dark: 'linear-gradient(120deg, #18181c 0%, #23242a 100%)',
  };

  // Photocard and text theme
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

  // Animate background gradient with framer-motion
  const bgVariants = {
    light: { background: 'linear-gradient(120deg, #f0f7ff 0%, #ccd9ff 100%)' },
    dark: { background: 'linear-gradient(120deg, #18181c 0%, #23242a 100%)' },
  };

  // Background shift timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBgTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

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

  // Double-click logic for back button
  const lastBackClick = useRef(0);
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

  // Seek handler
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const percent = Number(e.target.value);
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  // Format time
  const formatTime = (s) => {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={false}
      animate={bgTheme}
      variants={bgVariants}
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
          background: "linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5000,
          opacity: animationPhase === "fadeToGrey" ? 0 : 1,
          transition: "opacity 1s ease-out"
        }}>
          <h1 style={{ 
            fontWeight: "700", 
            fontSize: "clamp(2.5rem, 8vw, 4rem)", 
            textAlign: "center", 
            letterSpacing: "0.1em", 
            color: "#121212",
            opacity: animationPhase === "initial" ? 0 : 1,
            transform: animationPhase === "initial" ? "translateY(40px)" : "translateY(0)",
            transition: "opacity 1s ease-out, transform 1s ease-out",
            padding: "0 clamp(16px, 5vw, 32px)"
          }}>Memories With You</h1>
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
              zIndex: 0,
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
              zIndex: 0,
              pointerEvents: "none"
            }} />
          </>
        )}

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

        {/* Full-page dim/blur overlay on hover */}
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(30,30,40,0.18)',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}
          animate={{ opacity: isCenterHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Gallery Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: 'min(60vw, 70vh)',
            minHeight: 320,
            maxWidth: 1200,
            margin: '0 auto',
            position: 'relative',
            zIndex: 200,
          }}
        >
          {/* Previous (clickable) */}
          <motion.div
            style={{ width: 'clamp(120px,22vw,260px)', height: 'clamp(120px,22vw,260px)', zIndex: 1, margin: '0 2vw', cursor: canNavigate ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: canNavigate ? 'auto' : 'none' }}
            tabIndex={0}
            aria-label="Previous image"
            role="button"
            initial={false}
            animate={{ scale: 0.92, opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={canNavigate ? () => handleUserSelect(-1) : undefined}
          >
            <div style={{ position: "relative", borderRadius: 18, overflow: "visible", border: BORDER, width: '100%', height: '100%', background: '#18181c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Glow */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: GLOW_SIZE,
                  height: GLOW_SIZE,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${GLOW_COLOR} 0%, transparent 80%)`,
                  filter: "blur(24px)",
                  zIndex: 0,
                  pointerEvents: "none",
                  transform: "translate(-50%, -50%)",
                }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              />
              <div style={{ borderRadius: 18, overflow: "hidden", width: "100%", height: "100%", zIndex: 1 }}>
                <img
                  src={images[prevIdx].src}
                  alt="Previous"
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", borderRadius: 18 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Center */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={images[currentIndex].src}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ width: 'clamp(180px,32vw,380px)', height: 'clamp(180px,32vw,380px)', zIndex: 10, margin: '0 2vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
              onMouseEnter={handleCenterMouseEnter}
              onMouseLeave={handleCenterMouseLeave}
              whileHover={{ scale: 1.07 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Photocard background on hover */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: -24,
                  left: -24,
                  right: -24,
                  bottom: -24,
                  zIndex: 1,
                  borderRadius: 32,
                  boxShadow: isDarkBg
                    ? '0 8px 32px rgba(204,217,255,0.13)'
                    : '0 8px 32px rgba(0,0,0,0.18)',
                  backdropFilter: 'blur(12px)',
                  opacity: isCenterHovered ? 1 : 0,
                  pointerEvents: 'none',
                }}
                animate={{
                  opacity: isCenterHovered ? 1 : 0,
                  background: isDarkBg
                    ? 'linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)'
                    : 'rgba(30,30,40,0.65)',
                }}
                transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
              />
              {/* Image */}
              <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", width: '100%', height: '100%', background: isDarkBg ? '#f0f7ff' : '#18181c', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <img
                  src={images[currentIndex].src}
                  alt="gallery"
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", borderRadius: 22 }}
                />
              </div>
              {/* Date below image, animated, theme-inverting */}
              <motion.div
                key={images[currentIndex].date + (isCenterHovered ? '-hover' : '-nohover') + (isDarkBg ? '-dark' : '-light')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  marginTop: 24,
                  color:
                    isDarkBg
                      ? (isCenterHovered ? '#6b7280' : undefined)
                      : (isCenterHovered ? undefined : '#6b7280'),
                  fontSize: "clamp(1.1rem,2vw,1.5rem)",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textAlign: 'center',
                  borderRadius: 8,
                  zIndex: 3,
                  userSelect: 'none',
                  background:
                    isDarkBg
                      ? (!isCenterHovered
                          ? 'linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)'
                          : undefined)
                      : (isCenterHovered
                          ? 'linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)'
                          : undefined),
                  WebkitBackgroundClip:
                    (isDarkBg && !isCenterHovered) || (!isDarkBg && isCenterHovered)
                      ? 'text'
                      : undefined,
                  WebkitTextFillColor:
                    (isDarkBg && !isCenterHovered) || (!isDarkBg && isCenterHovered)
                      ? 'transparent'
                      : undefined,
                  MozBackgroundClip:
                    (isDarkBg && !isCenterHovered) || (!isDarkBg && isCenterHovered)
                      ? 'text'
                      : undefined,
                  MozTextFillColor:
                    (isDarkBg && !isCenterHovered) || (!isDarkBg && isCenterHovered)
                      ? 'transparent'
                      : undefined,
                  transition: 'color 0.3s, background 0.3s',
                }}
              >
                {images[currentIndex].date}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Next (clickable) */}
          <motion.div
            style={{ width: 'clamp(120px,22vw,260px)', height: 'clamp(120px,22vw,260px)', zIndex: 1, margin: '0 2vw', cursor: canNavigate ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: canNavigate ? 'auto' : 'none' }}
            tabIndex={0}
            aria-label="Next image"
            role="button"
            initial={false}
            animate={{ scale: 0.92, opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={canNavigate ? () => handleUserSelect(1) : undefined}
          >
            <div style={{ position: "relative", borderRadius: 18, overflow: "visible", border: BORDER, width: '100%', height: '100%', background: '#18181c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Glow */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: GLOW_SIZE,
                  height: GLOW_SIZE,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${GLOW_COLOR} 0%, transparent 80%)`,
                  filter: "blur(24px)",
                  zIndex: 0,
                  pointerEvents: "none",
                  transform: "translate(-50%, -50%)",
                }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              />
              <div style={{ borderRadius: 18, overflow: "hidden", width: "100%", height: "100%", zIndex: 1 }}>
                <img
                  src={images[nextIdx].src}
                  alt="Next"
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", borderRadius: 18 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}