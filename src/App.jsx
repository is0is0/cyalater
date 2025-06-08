import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AllAboutYou from './AllAboutYou.jsx';
import { motion } from 'framer-motion';

// Itinerary data
const itinerary = {
  Monday: [
    "10:50 AM – You **arrive** in **Atlanta**",
    "11:15 AM – **Situate**",
    "1:00 PM – **Airbnb** check-in & settle",
    "2:30 PM – Explore **Ponce City Market** & the **Beltline**",
    "Free Time",
    "7:30 PM – Dinner at **Your Choice**",
  ],
  Tuesday: [
    "10:00 AM – Brunch at **Cafe Intermezzo**",
    "Free Time",
    "3:00 PM – **The Frisky Whisker**",
    "5:00 PM – Shopping Tour **2nd Street**, **Good Times**, & **Lucky Exchange**",
    "8:00 PM – Dinner at **Wagyu House** or **Nagomiya**",
  ],
  Wednesday: [
    "7:30 AM – Arrive at **GSU Orientation**",
    "5:15 PM – Leave Orientation",
    "Free Time",
    "6:30 PM – Dinner at **Mom's Choice**",
  ],
  Thursday: [
    "7:30 AM – **Your Choice**",
    "10:00 AM – **Airbnb** checkout",
    "Free Time",
    "1:00 PM – Travel to airport",
    "3:00 PM – Departure",
  ],
}; 

const flightInfo = {
  departing: [
    { label: "Date", value: "June 23, 2025" },
    { label: "Departure", value: "Minneapolis-St. Paul (MSP)" },
    { label: "Departure Time", value: "7:18 PM CST" },
    { label: "Gate", value: "Terminal 2" },
    { label: "Airline", value: "Sun Country Airlines" },
    { label: "Arrival Time", value: "10:50 AM EST" },
    { label: "Arrival", value: "Atlanta, GA (ATL)" },
    { label: "Confirmation Code", value: "I9S4XD" },
  ],
  returning: [
    { label: "Date", value: "June 26, 2025" },
    { label: "Departure", value: "Atlanta, GA (ATL)" },
    { label: "Departure Time", value: "2:57 PM EST" },
    { label: "Gate", value: "Terminal 2" },
    { label: "Airline", value: "Sun Country Airlines" },
    { label: "Arrival Time", value: "4:36 PM CST" },
    { label: "Arrival", value: "Minneapolis-St. Paul (MSP)" },
    { label: "Confirmation Code", value: "I9S4XD" },
  ],
};

const airbnbInfo = {
  address: "691 Juniper St NE, Atlanta, GA 30308",
  room: "3rd Floor, Apt 6",
  "Check In": "June 23, 2025 at 4:00 PM",
  "Check Out": "June 26, 2025 at 10:00 AM",
};

const weatherInfo = {
  "June 23, 2025": {
  location: "Atlanta, GA",
  forecast: [
    { time: "Morning", condition: "Sunny", temp: "75°F" },
    { time: "Afternoon", condition: "Partly Cloudy", temp: "82°F" },
    { time: "Evening", condition: "Clear", temp: "70°F" },
  ],
  },
  "June 24, 2025": {
    location: "Atlanta, GA",
    forecast: [
      { time: "Morning", condition: "Sunny", temp: "76°F" },
      { time: "Afternoon", condition: "Scattered Thunderstorms", temp: "84°F" },
      { time: "Evening", condition: "Partly Cloudy", temp: "72°F" },
    ],
  },
  "June 25, 2025": {
    location: "Atlanta, GA",
    forecast: [
      { time: "Morning", condition: "Partly Cloudy", temp: "74°F" },
      { time: "Afternoon", condition: "Isolated Thunderstorms", temp: "83°F" },
      { time: "Evening", condition: "Clear", temp: "71°F" },
    ],
  },
  "June 26, 2025": {
    location: "Atlanta, GA",
    forecast: [
      { time: "Morning", condition: "Sunny", temp: "73°F" },
      { time: "Afternoon", condition: "Sunny", temp: "81°F" },
      { time: "Evening", condition: "Clear", temp: "69°F" },
    ],
  },
};

const gradientColors = ["#E6E8F0", "#CCD9FF", "#D7F0FC", "#F0F7FF"];

const Bullet = () => (
  <svg width="14" height="14" style={{ marginRight: 12, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="24" y2="24">
        <stop offset="0%" stopColor={gradientColors[0]} />
        <stop offset="40%" stopColor={gradientColors[1]} />
        <stop offset="70%" stopColor={gradientColors[2]} />
        <stop offset="100%" stopColor={gradientColors[3]} />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const TabBackground = ({ type, isActive }) => {
  const patterns = {
    monday: (
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: isActive ? 0.1 : 0 }}>
        <defs>
          <linearGradient id="monday-grad" x1="0" y1="0" x2="20" y2="20">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>
        <pattern id="monday-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10h20M10 0v20" stroke="url(#monday-grad)" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#monday-pattern)" />
      </svg>
    ),
    tuesday: (
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: isActive ? 0.1 : 0 }}>
        <pattern id="tuesday-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="2" fill="url(#tuesday-grad)" />
        </pattern>
        <defs>
          <linearGradient id="tuesday-grad" x1="0" y1="0" x2="30" y2="30">
            <stop offset="0%" stopColor={gradientColors[1]} />
            <stop offset="100%" stopColor={gradientColors[2]} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#tuesday-pattern)" />
      </svg>
    ),
    wednesday: (
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: isActive ? 0.1 : 0 }}>
        <pattern id="wednesday-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20h40M20 0v40" stroke="url(#wednesday-grad)" strokeWidth="0.5" strokeDasharray="2 2" />
        </pattern>
        <defs>
          <linearGradient id="wednesday-grad" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor={gradientColors[2]} />
            <stop offset="100%" stopColor={gradientColors[3]} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#wednesday-pattern)" />
      </svg>
    ),
    thursday: (
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: isActive ? 0.1 : 0 }}>
        <pattern id="thursday-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M0 0l25 25M25 0l-25 25" stroke="url(#thursday-grad)" strokeWidth="0.5" />
        </pattern>
        <defs>
          <linearGradient id="thursday-grad" x1="0" y1="0" x2="25" y2="25">
            <stop offset="0%" stopColor={gradientColors[3]} />
            <stop offset="100%" stopColor={gradientColors[0]} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#thursday-pattern)" />
      </svg>
    ),
    "flight info": (
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: isActive ? 0.1 : 0 }}>
        <pattern id="flight-pattern" x="0" y="0" width="35" height="35" patternUnits="userSpaceOnUse">
          <path d="M0 17.5h35M17.5 0v35" stroke="url(#flight-grad)" strokeWidth="0.5" strokeDasharray="4 2" />
        </pattern>
        <defs>
          <linearGradient id="flight-grad" x1="0" y1="0" x2="35" y2="35">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[2]} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#flight-pattern)" />
      </svg>
    ),
    "airbnb info": (
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: isActive ? 0.1 : 0 }}>
        <pattern id="airbnb-pattern" x="0" y="0" width="45" height="45" patternUnits="userSpaceOnUse">
          <rect x="15" y="15" width="15" height="15" fill="url(#airbnb-grad)" />
        </pattern>
        <defs>
          <linearGradient id="airbnb-grad" x1="0" y1="0" x2="45" y2="45">
            <stop offset="0%" stopColor={gradientColors[1]} />
            <stop offset="100%" stopColor={gradientColors[3]} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#airbnb-pattern)" />
      </svg>
    ),
    weather: (
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: isActive ? 0.1 : 0 }}>
        <pattern id="weather-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="3" fill="none" stroke="url(#weather-grad)" strokeWidth="0.5" />
        </pattern>
        <defs>
          <linearGradient id="weather-grad" x1="0" y1="0" x2="50" y2="50">
            <stop offset="0%" stopColor={gradientColors[2]} />
            <stop offset="100%" stopColor={gradientColors[0]} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#weather-pattern)" />
      </svg>
    ),
  };

  return patterns[type] || null;
};

const IRIDESCENT = '#bcd2f7';
const WeatherIcon = ({ condition, size = 32 }) => {
  const lc = condition.toLowerCase();
  if (lc.includes('thunder')) {
    // Thunderstorm icon: Boxicons
    return (
      <i
        className="bx bx-cloud-lightning"
        style={{ fontSize: size, color: IRIDESCENT, display: 'inline-block', verticalAlign: 'middle', textAlign: 'center', width: size, height: size }}
        aria-label="Thunderstorm"
      />
    );
  }
  if (lc.includes('partly cloudy')) {
    // Partly Cloudy icon: earlier SVG (cloud path + sun + rays), iridescent color
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Partly Cloudy">
        {/* Sun with rays */}
        <circle cx="22" cy="10" r="5" stroke={IRIDESCENT} strokeWidth="2" fill="none" />
        <line x1="22" y1="2" x2="22" y2="5" stroke={IRIDESCENT} strokeWidth="1.5" />
        <line x1="22" y1="15" x2="22" y2="18" stroke={IRIDESCENT} strokeWidth="1.5" />
        <line x1="27" y1="10" x2="30" y2="10" stroke={IRIDESCENT} strokeWidth="1.5" />
        <line x1="14" y1="10" x2="17" y2="10" stroke={IRIDESCENT} strokeWidth="1.5" />
        <line x1="25.54" y1="4.46" x2="27.68" y2="6.6" stroke={IRIDESCENT} strokeWidth="1.5" />
        <line x1="18.32" y1="13.4" x2="16.18" y2="15.54" stroke={IRIDESCENT} strokeWidth="1.5" />
        <line x1="25.54" y1="15.54" x2="27.68" y2="13.4" stroke={IRIDESCENT} strokeWidth="1.5" />
        <line x1="18.32" y1="6.6" x2="16.18" y2="4.46" stroke={IRIDESCENT} strokeWidth="1.5" />
        {/* Cloud */}
        <path d="M18 22h-7a5 5 0 1 1 1.48-9.78A7 7 0 0 1 25 17a5 5 0 0 1-7 5z" fill={IRIDESCENT} fillOpacity="0.5" stroke={IRIDESCENT} strokeWidth="2" />
      </svg>
    );
  }
  if (lc.includes('clear')) {
    // Clear skies: outlined sun, iridescent color
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Clear">
        <circle cx="16" cy="16" r="7" stroke={IRIDESCENT} strokeWidth="2" fill="none" />
        {/* Sun rays */}
        <line x1="16" y1="3" x2="16" y2="8" stroke={IRIDESCENT} strokeWidth="2" />
        <line x1="16" y1="24" x2="16" y2="29" stroke={IRIDESCENT} strokeWidth="2" />
        <line x1="3" y1="16" x2="8" y2="16" stroke={IRIDESCENT} strokeWidth="2" />
        <line x1="24" y1="16" x2="29" y2="16" stroke={IRIDESCENT} strokeWidth="2" />
        <line x1="7.5" y1="7.5" x2="11" y2="11" stroke={IRIDESCENT} strokeWidth="2" />
        <line x1="21" y1="21" x2="24.5" y2="24.5" stroke={IRIDESCENT} strokeWidth="2" />
        <line x1="7.5" y1="24.5" x2="11" y2="21" stroke={IRIDESCENT} strokeWidth="2" />
        <line x1="21" y1="11" x2="24.5" y2="7.5" stroke={IRIDESCENT} strokeWidth="2" />
      </svg>
    );
  }
  if (lc.includes('rain')) {
    // Rain icon: iridescent cloud + rain
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Rain">
        <ellipse cx="16" cy="14" rx="10" ry="8" fill={IRIDESCENT} fillOpacity="0.5" stroke={IRIDESCENT} strokeWidth="2" />
        <line x1="12" y1="22" x2="12" y2="26" stroke={IRIDESCENT} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="22" x2="16" y2="26" stroke={IRIDESCENT} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="22" x2="20" y2="26" stroke={IRIDESCENT} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  const icons = {
    "Sunny": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={IRIDESCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    "Clear": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    "Scattered Thunderstorms": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <polyline points="8 12 12 16 16 12" />
        <line x1="12" y1="16" x2="12" y2="20" />
      </svg>
    ),
    "Isolated Thunderstorms": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <polyline points="8 12 12 16 16 12" />
        <line x1="12" y1="16" x2="12" y2="20" />
      </svg>
    )
  };

  return icons[condition] || icons["Sunny"];
};

// Helper to create Google Maps links
function mapsLink(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Helper to create website links for known places
const knownWebsites = {
  "Ponce City Market": "https://poncecitymarket.com",
  "Beltline": "https://beltline.org",
  "Cafe Intermezzo": "https://cafeintermezzo.com",
  "The Frisky Whisker": "https://thefriskywhisker.com",
  "2nd Street": "https://2ndstreetusa.com",
  "Good Times": "https://www.instagram.com/goodtimes.atlanta/?hl=en",
  "Lucky Exchange": "https://www.instagram.com/the_lucky_exchange/?hl=en",
  "Wagyu House": "https://wagyuhouse.group/project/wagyu-house-atlanta/",
  "Nagomiya": "https://www.nagomiyaatlanta.com/"
};

export default function App() {
  const mainTabs = ["trip", "info", "weather", "hey"];
  const dayTabs = ["monday", "tuesday", "wednesday", "thursday"];
  const infoTabs = ["flight", "airbnb"];
  const [selectedTab, setSelectedTab] = useState("trip");
  const [selectedDay, setSelectedDay] = useState("monday");
  const [selectedInfo, setSelectedInfo] = useState("flight");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState("initial");
  const containerRef = useRef(null);
  const prevTabRef = useRef(selectedTab);
  const [borderState, setBorderState] = useState({ trip: "hidden", info: "hidden", weather: "hidden" });
  const [noteStep, setNoteStep] = useState(0);
  const noteMessages = [
    { text: <>To Natalie (aka <b>Big Head</b>):</>, className: "note-heading" },
    { text: "i made this for u.", className: "note-line" },
    { text: "enjoy.", className: "note-line" },
    { text: <b>cya later.</b>, className: "note-bold" },
    { text: "x_x", className: "note-signature" },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.18);
  const audioRef = useRef(null);
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
  const [currentTrack, setCurrentTrack] = useState(0);

  // Animation state for player/menu fade-in
  const [showPlayer, setShowPlayer] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    if (showContent) {
      setTimeout(() => setShowPlayer(true), 100); // slight delay for smoothness
      setTimeout(() => setShowMenu(true), 400); // fade in menu after player
    } else {
      setShowPlayer(false);
      setShowMenu(false);
    }
  }, [showContent]);

  // Play/pause/mute/volume logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
    if (isPlaying && !muted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [muted, isPlaying, volume, currentTrack]);

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

  useEffect(() => {
    if (selectedTab === 'hey') setNoteStep(0);
  }, [selectedTab]);

  // Auto-highlight 'monday' when switching to the 'trip' tab
  useEffect(() => {
    if (selectedTab === 'trip') setSelectedDay('monday');
  }, [selectedTab]);

  const handleTabChange = (newTab) => {
    if (isTransitioning) return;
    
    const prevIndex = mainTabs.indexOf(prevTabRef.current);
    const currentIndex = mainTabs.indexOf(newTab);
    setSlideDirection(currentIndex > prevIndex ? 1 : -1);
    setIsTransitioning(true);
    
    // Update tab state immediately
    setSelectedTab(newTab);
    prevTabRef.current = newTab;
    
    if (newTab === "trips") {
      setSelectedDay("Monday");
    }
    
    // Shorter timeout for smoother transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleTabChangeWithBorder = (tab) => {
    handleTabChange(tab);
    setBorderState({ trip: 'hidden', info: 'hidden', weather: 'hidden', [tab]: 'visible' });
  };

  const handleDayChange = (newDay) => {
    setSelectedDay(newDay);
  };

  const handleInfoChange = (newInfo) => {
    setSelectedInfo(newInfo);
  };

  const renderContent = () => {
    if (selectedTab === "trip") {
      const dayKey = selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1);
      return (
        <div>
          <div style={{ 
            display: "flex", 
            gap: 12, 
            marginBottom: 24,
            overflowX: "auto",
            paddingBottom: 8,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
            position: "relative",
            zIndex: 2,
            padding: "4px"
          }}>
            {dayTabs.map((day) => (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: "none",
                  background: selectedDay === day 
                    ? "linear-gradient(135deg, rgba(240, 247, 255, 0.1), rgba(204, 217, 255, 0.05))"
                    : "transparent",
                  color: selectedDay === day ? "transparent" : "#e6e8f0",
                  backgroundImage: selectedDay === day
                    ? "linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)"
                    : "none",
                  WebkitBackgroundClip: selectedDay === day ? "text" : "initial",
                  WebkitTextFillColor: selectedDay === day ? "transparent" : "#e6e8f0",
                  fontSize: 14,
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  whiteSpace: "nowrap",
                  boxShadow: 'none',
                  transform: selectedDay === day ? "scale(1.05)" : "scale(1)",
                  opacity: selectedDay === day ? 1 : 0.7
                }}
              >
                <TabBackground type={day} isActive={selectedDay === day} />
                {day}
              </button>
            ))}
          </div>
          <div style={{ 
            position: "relative",
            padding: "24px",
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(240, 247, 255, 0.03), rgba(204, 217, 255, 0.01))",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}>
            <svg style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "100%", 
              opacity: 0.05,
              pointerEvents: "none"
            }} viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tripGradient" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0%" stopColor="#f0f7ff" />
                  <stop offset="100%" stopColor="#ccd9ff" />
                </linearGradient>
              </defs>
              <path d="M0,50 Q25,25 50,50 T100,50" stroke="url(#tripGradient)" strokeWidth="0.5" fill="none" />
              <path d="M0,30 Q25,15 50,30 T100,30" stroke="url(#tripGradient)" strokeWidth="0.5" fill="none" />
              <path d="M0,70 Q25,85 50,70 T100,70" stroke="url(#tripGradient)" strokeWidth="0.5" fill="none" />
            </svg>
            <div style={{
              position: "relative",
              zIndex: 1
            }}>
              {itinerary[dayKey].map((item, i) => {
        const parts = item.split(/(\*\*.+?\*\*)/g);
                const isFreeTime = item.includes("Free Time");
        return (
                  <div key={i} className="fade-in" style={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    marginBottom: i !== itinerary[dayKey].length - 1 ? 22 : 0, 
                    paddingBottom: i !== itinerary[dayKey].length - 1 ? 14 : 0, 
                    borderBottom: i !== itinerary[dayKey].length - 1 ? "1px solid rgba(204, 217, 255, 0.1)" : "none", 
                    position: "relative", 
                    zIndex: 1, 
                    textAlign: "left",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderBottom: i !== itinerary[dayKey].length - 1 ? "1px solid rgba(204, 217, 255, 0.2)" : "none"
                    }
                  }}>
            <Bullet />
                    <p style={{ 
                      margin: 0, 
                      flex: 1,
                      color: isFreeTime ? "#ccd9ff" : "#e6e8f0"
                    }}>
                      {parts.map((part, idx) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          const label = part.slice(2, -2);
                          const noLinkLabels = ["Your Choice", "Mom's Choice", "Situate"];
                          const link = noLinkLabels.includes(label) ? null : (knownWebsites[label] || mapsLink(label));
                          return (
                            <strong
                              key={idx}
                              style={{ color: "#f0f7ff", fontWeight: "700", cursor: link ? 'pointer' : 'default' }}
                              onClick={link ? (e => { e.stopPropagation(); window.open(link, '_blank', 'noopener,noreferrer'); }) : undefined}
                            >
                              {label}
                            </strong>
                          );
                        }
                        return <span key={idx}>{part}</span>;
                      })}
            </p>
          </div>
        );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (selectedTab === "info") {
      return (
        <div>
          <div style={{ 
            display: "flex", 
            gap: 12, 
            marginBottom: 24,
            overflowX: "auto",
            paddingBottom: 8,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
            position: "relative",
            zIndex: 2,
            padding: "4px"
          }}>
            {infoTabs.map((info) => (
              <button
                key={info}
                onClick={() => handleInfoChange(info)}
                className="info-button"
                aria-selected={selectedInfo === info}
                aria-label={`Info: ${info}`}
                aria-controls={`panel-info-${info}`}
                id={`tab-info-${info}`}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: "none",
                  background: selectedInfo === info 
                    ? "linear-gradient(135deg, rgba(240, 247, 255, 0.1), rgba(204, 217, 255, 0.05))"
                    : "transparent",
                  color: selectedInfo === info ? "transparent" : "#e6e8f0",
                  backgroundImage: selectedInfo === info
                    ? "linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)"
                    : "none",
                  WebkitBackgroundClip: selectedInfo === info ? "text" : "initial",
                  WebkitTextFillColor: selectedInfo === info ? "transparent" : "#e6e8f0",
                  fontSize: 14,
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  whiteSpace: "nowrap",
                  boxShadow: 'none',
                  transform: selectedInfo === info ? "scale(1.05)" : "scale(1)",
                  opacity: selectedInfo === info ? 1 : 0.7
                }}
              >
                {info}
              </button>
            ))}
          </div>
          <div style={{ position: "relative", minHeight: 260 }}>
            <div
              className={`info-fade${selectedInfo === "flight" ? " active" : ""}`}
              style={{
                position: selectedInfo === "flight" ? "relative" : "absolute",
                top: 0, left: 0, right: 0,
                pointerEvents: selectedInfo === "flight" ? "auto" : "none",
                zIndex: selectedInfo === "flight" ? 2 : 1,
              }}
              aria-hidden={selectedInfo !== "flight"}
            >
        <section style={{ position: "relative", zIndex: 1, textAlign: "left" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "32px"
                }}>
                  <div style={{
                    padding: "24px",
                    background: "linear-gradient(135deg, rgba(240, 247, 255, 0.02), rgba(204, 217, 255, 0.01))",
                    borderRadius: "12px",
                    position: "relative"
                  }}>
                    <h2 style={{ 
                      fontWeight: "700", 
                      marginBottom: 24, 
                      color: "#f0f7ff", 
                      fontSize: 24,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <i className="fa-solid fa-plane-departure" style={{ fontSize: 24, color: '#ccd9ff' }} aria-label="Departure" />
                      Departing Flight
                    </h2>
                    {flightInfo.departing.map(({ label, value }, i) => {
                      let link = null;
                      if (label === "Airline") link = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
                      return (
                        <div key={i} className="info-card" style={{ display: "flex", justifyContent: "space-between", padding: "12px", marginBottom: "8px" }}>
              <strong style={{ color: "#ccd9ff" }}>{label}</strong>
                          {link ? (
                            <span style={{ cursor: 'pointer' }} onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}>{value}</span>
                          ) : (
              <span>{value}</span>
                          )}
            </div>
                      );
                    })}
                  </div>

                  <div style={{
                    padding: "24px",
                    background: "linear-gradient(135deg, rgba(240, 247, 255, 0.02), rgba(204, 217, 255, 0.01))",
                    borderRadius: "12px",
                    position: "relative"
                  }}>
                    <h2 style={{ 
                      fontWeight: "700", 
                      marginBottom: 24, 
                      color: "#f0f7ff", 
                      fontSize: 24,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <i className="fa-solid fa-plane-arrival" style={{ fontSize: 24, color: '#ccd9ff' }} aria-label="Return" />
                      Returning Flight
                    </h2>
                    {flightInfo.returning.map(({ label, value }, i) => {
                      let link = null;
                      if (label === "Airline") link = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
                      return (
                        <div key={i} className="info-card" style={{ display: "flex", justifyContent: "space-between", padding: "12px", marginBottom: "8px" }}>
              <strong style={{ color: "#ccd9ff" }}>{label}</strong>
                          {link ? (
                            <span style={{ cursor: 'pointer' }} onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}>{value}</span>
                          ) : (
              <span>{value}</span>
                          )}
            </div>
                      );
                    })}
                  </div>
                </div>
        </section>
            </div>
            <div
              className={`info-fade${selectedInfo === "airbnb" ? " active" : ""}`}
              style={{
                position: selectedInfo === "airbnb" ? "relative" : "absolute",
                top: 0, left: 0, right: 0,
                pointerEvents: selectedInfo === "airbnb" ? "auto" : "none",
                zIndex: selectedInfo === "airbnb" ? 2 : 1,
              }}
              aria-hidden={selectedInfo !== "airbnb"}
            >
              <section style={{ position: "relative", zIndex: 1, textAlign: "left" }}>
                <div style={{
                  padding: "24px",
                  background: "linear-gradient(135deg, rgba(240, 247, 255, 0.02), rgba(204, 217, 255, 0.01))",
                  borderRadius: "12px",
                  position: "relative"
                }}>
                  <h2 style={{ 
                    fontWeight: "700", 
                    marginBottom: 24, 
                    color: "#f0f7ff", 
                    fontSize: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Airbnb Details
                  </h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "24px"
                  }}>
                    {Object.entries(airbnbInfo).map(([key, value], i) => {
                      let link = null;
                      if (key.toLowerCase().includes("address")) link = mapsLink(value);
                      return (
                        <div key={i} className="info-card" style={{ padding: "16px", background: "linear-gradient(135deg, rgba(240, 247, 255, 0.02), rgba(204, 217, 255, 0.01))", borderRadius: "8px", transition: "all 0.3s ease", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                          <strong style={{ color: "#ccd9ff", display: "block", marginBottom: "8px", fontSize: "14px" }}>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                          {link ? (
                            <span style={{ cursor: 'pointer' }} onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}>{value}</span>
                          ) : (
                            <span style={{ fontSize: "16px" }}>{value}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      );
    }

    if (selectedTab === "weather") {
      return (
        <div>
        <section style={{ position: "relative", zIndex: 1, textAlign: "left" }}>
            <h2 style={{ fontWeight: "700", marginBottom: 24, color: "#f0f7ff", fontSize: 24 }}>Weather Forecast</h2>
            <div style={{ marginBottom: 24 }}><strong style={{ color: "#ccd9ff" }}>Location</strong>: {weatherInfo["June 23, 2025"].location}</div>
            {Object.entries(weatherInfo).map(([date, info]) => (
              <div key={date} className="fade-in" style={{ 
                marginBottom: 32,
                transition: "all 0.3s ease",
                transform: "translateY(0)",
                "&:hover": {
                  transform: "translateY(-2px)"
                }
              }}>
                <h3 style={{ fontWeight: "600", marginBottom: 16, color: "#f0f7ff", fontSize: 20 }}>{date}</h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  padding: "16px",
                  background: "linear-gradient(135deg, rgba(240, 247, 255, 0.03), rgba(204, 217, 255, 0.01))",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)"
                }}>
                  {info.forecast.map(({ time, condition, temp }, i) => (
                    <div key={i} className="weather-card">
                      <div style={{ 
                        color: "#ccd9ff", 
                        fontSize: "14px", 
                        marginBottom: "8px",
                        fontWeight: "600"
                      }}>{time}</div>
                      <div style={{ 
                        margin: "12px 0",
                        color: "#f0f7ff"
                      }}>
                        <WeatherIcon condition={condition} size={32} />
                      </div>
                      <div style={{ 
                        fontSize: "18px", 
                        fontWeight: "600",
                        color: "#f0f7ff"
                      }}>{temp}</div>
                      <div style={{ 
                        fontSize: "14px",
                        color: "#ccd9ff",
                        marginTop: "8px"
                      }}>{condition}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </section>
        </div>
      );
    }

    if (selectedTab === "hey" && !isTransitioning) {
      return (
        <div
          className="note-container"
          style={{
            borderRadius: 32,
            background: "linear-gradient(135deg, #f0f7ff 0%, #e6e8f0 100%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            padding: 32,
            overflow: "hidden",
            margin: "0 auto",
            minHeight: "320px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            transition: "min-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          {noteMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`note-step${noteStep >= idx ? " visible" : ""}`}
              style={{
                fontSize: idx === 0 ? 28 : idx === 3 ? 32 : 22,
                fontWeight: idx === 3 ? 700 : 400,
                color: idx === 3 ? "#121212" : "#3a3a3a",
                margin: idx === 0 ? "0 0 32px 0" : idx === 4 ? "32px 0 0 0" : "12px 0",
                letterSpacing: idx === 4 ? 8 : 0,
                background: undefined,
                WebkitBackgroundClip: undefined,
                WebkitTextFillColor: undefined,
                cursor: idx === 3 ? "default" : noteStep === idx && idx < noteMessages.length - 1 ? "pointer" : "default",
                userSelect: "none",
                transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: noteStep >= idx ? 1 : 0,
                transform: noteStep >= idx ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)"
              }}
            >
              {msg.text}
            </div>
          ))}
          {noteStep < noteMessages.length && (
            <div 
              className="reveal-button"
              style={{ 
                marginTop: 24, 
                color: "#7a7a7a", 
                fontSize: 15, 
                fontWeight: 500, 
                letterSpacing: 1, 
                opacity: noteStep === noteMessages.length - 1 ? 0 : 0.7, 
                pointerEvents: noteStep === noteMessages.length - 1 ? 'none' : 'auto',
                borderBottom: "1.5px dashed #ccd9ff", 
                paddingBottom: 2, 
                transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                transform: "translateY(0)"
              }}
              onClick={() => setNoteStep((prev) => Math.min(prev + 1, noteMessages.length - 1))}
            >
              click to reveal more
            </div>
          )}
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
        </div>
      );
    }
  };

  // Add fade-in animation CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .fade-in { opacity: 0; animation: fadeIn 0.7s ease forwards; }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .info-fade {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1);
      }
      .info-fade.active {
        opacity: 1;
        transform: translateY(0);
      }
      .note-container {
        transition: min-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .note-step {
        transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .note-step.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .reveal-button {
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ErrorBoundary for weather section
  function WeatherErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);
    if (hasError) {
      return <div style={{ color: '#f0f7ff', background: 'rgba(255,0,0,0.1)', padding: 16, borderRadius: 8 }}>Weather data failed to load.</div>;
    }
    return children;
  }

  // Handlers
  const handlePlayPause = () => setIsPlaying((p) => !p);
  const handleRewind = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
  };
  const handleSkip = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };
  const handleVolume = (e) => {
    setVolume(Number(e.target.value));
    if (muted && Number(e.target.value) > 0) setMuted(false);
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
  const handleSkipTrack = () => {
    setCurrentTrack((prev) => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  // State for progress bar
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const navigate = useNavigate();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuFade, setMenuFade] = useState('in'); // 'in' or 'out'

  // Show menu with fade-in/fade-out
  useEffect(() => {
    if (menuOpen) {
      setMenuVisible(true);
      setMenuFade('in');
    } else if (menuVisible) {
      setMenuFade('out');
      const timeout = setTimeout(() => setMenuVisible(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [menuOpen]);

  // Helper for menu option animation delays
  const menuOptionCount = 2; // update if you add more menu options
  const getMenuOptionClass = (i) => {
    if (menuFade === 'in') return `menu-fade-in menu-fade-in-${i}`;
    if (menuFade === 'out') return `menu-fade-out menu-fade-out-${i}`;
    return '';
  };

  const menuOptions = [
    { icon: 'bx bx-home', label: 'cya', onClick: () => navigate('/') },
    { icon: 'bx bx-trophy', label: 'all about you', onClick: () => navigate('/all-about-you') },
    { icon: 'bx bxr bx-note', label: 'from yen & ange', onClick: () => navigate('/from-yen-and-ange') },
    { icon: 'bx bxr bx-photo-album', label: 'throwback', onClick: () => navigate('/throwback-gallery') },
    { icon: 'bx bx-arrow-back', label: 'back', onClick: () => navigate(-1) },
  ];

  return (
    <div style={{ 
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: "#121212", 
      color: "#e6e8f0", 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none", 
      background: "linear-gradient(180deg, #121212 0%, #1a1a1a 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
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
          transform: showPlayer ? 'translate(-50%, 0)' : 'translate(-50%, 40px)',
          opacity: showPlayer ? 1 : 0,
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
          transition: 'opacity 3s cubic-bezier(0.22, 1, 0.36, 1), transform 3s cubic-bezier(0.22, 1, 0.36, 1)',
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
            {/* Simple left arrow */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccd9ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          {/* Play/Pause */}
          <button onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"} style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', height: 32, width: 32 }}>
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ccd9ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ccd9ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
          {/* Skip Button */}
          <button onClick={handleSkipTrack} aria-label="Next Track" style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', height: 28, width: 28 }}>
            {/* Simple right arrow */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccd9ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          </button>
          {/* Track Info */}
          <span style={{ color: '#ccd9ff', fontSize: 12, marginLeft: 6, marginRight: 2, fontWeight: 500, letterSpacing: 0.5 }}>
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
            style={{ width: 48, accentColor: '#ccd9ff', marginLeft: 4, marginRight: 2, height: 2, background: 'none', borderRadius: 2, outline: 'none' }}
            aria-label="Volume"
          />
          {/* Mute toggle */}
          <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', height: 24, width: 24 }}>
            {muted ? (
              <i className="bx bxr bx-volume-mute" style={{ fontSize: 16, color: '#ccd9ff', display: 'inline-block', verticalAlign: 'middle' }} aria-label="Muted" />
            ) : (
              <i className="bx bxr bx-volume" style={{ fontSize: 16, color: '#ccd9ff', display: 'inline-block', verticalAlign: 'middle' }} aria-label="Volume" />
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
          <span style={{ color: '#ccd9ff', fontSize: 10, minWidth: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={duration ? currentTime / duration : 0}
            onChange={handleSeek}
            style={{ flex: 1, accentColor: '#ccd9ff', height: 2, background: 'none', borderRadius: 2, outline: 'none' }}
            aria-label="Seek"
          />
          <span style={{ color: '#ccd9ff', fontSize: 10, minWidth: 28, textAlign: 'left', fontVariantNumeric: 'tabular-nums' }}>{formatTime(duration)}</span>
        </div>
      </div>
      {/* Hamburger Menu */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 2000,
          opacity: showMenu ? 1 : 0,
          transition: 'opacity 3s cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: showMenu ? 'auto' : 'none',
        }}
      >
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1), filter 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            outline: 'none',
            position: 'relative',
            background: 'none',
            border: 'none',
            padding: 0,
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
        >
          <motion.i 
            className="bx bx-menu" 
            style={{ 
              fontSize: 32,
              color: '#ccd9ff',
              transition: 'color 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            animate={{ rotate: menuOpen ? 90 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </button>
        {/* Dropdown menu with fade in/out */}
        {menuVisible && (
          <div
            className={`menu-dropdown`}
            style={{
              position: 'fixed',
              top: 64,
              right: 32,
              zIndex: 2001,
              minWidth: 240,
              background: 'none',
              boxShadow: 'none',
              borderRadius: 18,
              padding: '12px 0',
              border: 'none',
              pointerEvents: menuOpen ? 'auto' : 'none',
              overflow: 'visible',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(-24px)',
              transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1), transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            {menuOptions.map((option, index) => (
              <button
                key={index}
                className={`menu-btn-iris ${getMenuOptionClass(index)}`}
                onClick={option.onClick}
                tabIndex={0}
                aria-selected={false}
                type="button"
              >
                <i className={`bx ${option.icon}`} aria-label={option.label} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* End Hamburger Menu */}
      <div style={{
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(80px, 10vw, 120px) clamp(12px, 3vw, 24px)"
      }}>
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
            zIndex: 1000,
            opacity: animationPhase === "fadeToGrey" ? 0 : 1,
            transition: "opacity 1s ease-out"
          }}>
            <h1 style={{ 
              fontWeight: "700", 
              fontSize: "clamp(2.5rem, 8vw, 4rem)", 
              textAlign: "center", 
              letterSpacing: "0.1em", 
              color: "#121212",
              animation: animationPhase === "initial" 
                ? "slideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                : "none",
              padding: "0 clamp(16px, 5vw, 32px)"
            }}>cya later</h1>
          </div>
        )}
        <div style={{ 
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.8s ease-out",
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <h1 style={{ 
            fontWeight: "700", 
            fontSize: "clamp(2.5rem, 8vw, 3.5rem)", 
            textAlign: "center", 
            marginBottom: "clamp(24px, 5vw, 48px)", 
            letterSpacing: "0.1em", 
            background: "linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent", 
            MozBackgroundClip: "text", 
            MozTextFillColor: "transparent", 
            userSelect: "text",
            textShadow: "0 0 30px rgba(240, 247, 255, 0.1)",
            padding: "0 clamp(16px, 5vw, 32px)",
            width: "100%"
          }}>cya later</h1>
          <nav style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: "clamp(24px, 5vw, 40px)", 
            gap: "clamp(8px, 2vw, 16px)", 
            flexWrap: "wrap",
            position: "relative",
            opacity: showContent ? 1 : 0,
            transition: "opacity 0.8s ease-out",
            transitionDelay: "0.3s",
            padding: "0 clamp(4px, 1vw, 8px)",
            width: "100%"
          }} role="tablist" aria-label="Main tabs">
            {mainTabs.map((tab) => {
          const isActive = selectedTab === tab;
          return (
                <button
                  key={tab}
                  onClick={() => handleTabChangeWithBorder(tab)}
                  onMouseEnter={() => {
                    if (!isActive) setBorderState((prev) => ({ ...prev, [tab]: "animating-in" }));
                  }}
                  onMouseLeave={() => {
                    if (!isActive) setBorderState((prev) => ({ ...prev, [tab]: "animating-out" }));
                  }}
                  role="tab" 
                  aria-selected={isActive} 
                  aria-controls={`panel-${tab}`} 
                  id={`tab-${tab}`} 
                  className="tab-button"
                  style={{ 
                    cursor: isTransitioning ? "default" : "pointer", 
                    fontWeight: "600", 
                    fontSize: "clamp(13px, 2vw, 15px)", 
                    padding: "clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)", 
                    borderRadius: 30, 
                    border: 'none',
                    boxShadow: 'none',
                    outline: 'none',
                    background: isActive 
                      ? "linear-gradient(135deg, rgba(240, 247, 255, 0.1), rgba(204, 217, 255, 0.05))" 
                      : "transparent", 
                    color: isActive ? "transparent" : "#e6e8f0",
                    backgroundImage: isActive 
                      ? "linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff)"
                      : "none",
                    WebkitBackgroundClip: isActive ? "text" : "initial",
                    WebkitTextFillColor: isActive ? "transparent" : "#e6e8f0",
                    minWidth: "120px",
                    height: "48px",
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)", 
                    userSelect: "none", 
                    flexShrink: 0, 
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    opacity: isActive ? 1 : 0.7,
                    pointerEvents: isTransitioning ? "none" : "auto",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {!isActive && borderState[tab] !== "visible" && (
                    <svg
                      viewBox="0 0 120 48"
                      width="100%"
                      height="100%"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    >
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f0f7ff" />
                          <stop offset="50%" stopColor="#ccd9ff" />
                          <stop offset="100%" stopColor="#e6e8f0" />
                        </linearGradient>
                      </defs>
                      <rect
                        x="1"
                        y="1"
                        width="118"
                        height="46"
                        rx="23"
                        ry="23"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        fill="none"
                        style={{
                          strokeDasharray: 380,
                          strokeDashoffset: borderState[tab] === "animating-in" ? 0 : 380,
                          transition: borderState[tab] === "animating-in"
                            ? "stroke-dashoffset 4s cubic-bezier(0.5, 0, 0.2, 1)"
                            : borderState[tab] === "animating-out"
                              ? "stroke-dashoffset 4s cubic-bezier(0.22, 1, 0.36, 1)"
                              : undefined,
                        }}
                      />
                    </svg>
                  )}
                  {isActive && (
                    <svg
                      viewBox="0 0 120 48"
                      width="100%"
                      height="100%"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    >
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f0f7ff" />
                          <stop offset="50%" stopColor="#ccd9ff" />
                          <stop offset="100%" stopColor="#e6e8f0" />
                        </linearGradient>
                      </defs>
                      <rect
                        x="1"
                        y="1"
                        width="118"
                        height="46"
                        rx="23"
                        ry="23"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        fill="none"
                        style={{
                          strokeDasharray: 380,
                          strokeDashoffset: 0,
                        }}
                      />
                    </svg>
                  )}
                  <TabBackground type={tab} isActive={isActive} />
                  {tab}
                </button>
          );
        })}
      </nav>
          <main 
            key={selectedTab} 
            id={`panel-${selectedTab}`} 
            aria-labelledby={`tab-${selectedTab}`} 
            role="tabpanel" 
            ref={containerRef} 
            className="content-section"
            style={{ 
              opacity: isTransitioning ? 0 : 1,
              transform: `translateX(${isTransitioning ? slideDirection * 30 : 0}px)`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              minHeight: "clamp(200px, 40vh, 280px)", 
              textAlign: "left",
              willChange: "transform, opacity",
              padding: "clamp(16px, 3vw, 24px)",
              borderRadius: "clamp(16px, 3vw, 24px)",
              background: "linear-gradient(135deg, rgba(240, 247, 255, 0.03), rgba(204, 217, 255, 0.01))",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              width: "100%",
              transformOrigin: "center center",
              perspective: "1000px",
              backfaceVisibility: "hidden"
            }}
          >
        {renderContent()}
        {/* Dedication Text */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          fontSize: '14px', 
          color: '#ccd9ff', 
          opacity: 0.7,
          letterSpacing: '0.5px',
          width: '100%'
        }}>
          Dedicated to Natalie Nguyen | Class of 2025
        </div>
      </main>
        </div>
      </div>
      <style>
        {`
          @keyframes slideIn {
            0% { 
              transform: translateY(100vh);
              opacity: 0;
            }
            100% { 
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes drawBorder {
            0% { stroke-dashoffset: 380; }
            100% { stroke-dashoffset: 0; }
          }

          .tab-button, .info-button {
            position: relative;
          }

          .tab-button svg, .info-button svg {
            position: absolute;
            top: -1px;
            left: -1px;
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            pointer-events: none;
          }

          .tab-button svg path, .info-button svg path {
            fill: none;
            stroke: url(#gradient);
            stroke-width: 2;
            stroke-dasharray: 380;
            stroke-dashoffset: 380;
            stroke-linecap: round;
            stroke-linejoin: round;
            vector-effect: non-scaling-stroke;
          }

          .tab-button:not([aria-selected="true"]):hover svg path,
          .info-button:not([aria-selected="true"]):hover svg path {
            animation: drawBorder 4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .tab-button[aria-selected="true"] svg path,
          .info-button[aria-selected="true"] svg path {
            animation: none !important;
            stroke-dashoffset: 380 !important;
            transition: none !important;
          }

          .weather-card, .info-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px;
            background: linear-gradient(135deg, rgba(240, 247, 255, 0.02), rgba(204, 217, 255, 0.01));
            border-radius: 12px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            transform: scale(1);
          }

          .weather-card:hover, .info-card:hover {
            transform: scale(1.05);
            background: linear-gradient(135deg, rgba(240, 247, 255, 0.04), rgba(204, 217, 255, 0.02));
          }

          .weather-card::before, .info-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border: 1px solid rgba(204, 217, 255, 0.1);
            border-radius: 12px;
            transition: all 0.3s ease;
            pointer-events: none;
          }

          .weather-card:hover::before, .info-card:hover::before {
            border: 1px solid rgba(204, 217, 255, 0.3);
          }

          @media (max-width: 768px) {
            .tab-button, .info-button {
              padding: 8px 16px !important;
              font-size: 14px !important;
              min-width: 100px !important;
            }
            
            .content-section {
              padding: 16px !important;
            }
          }

          @media (max-width: 480px) {
            .tab-button, .info-button {
              padding: 6px 12px !important;
              font-size: 13px !important;
              min-width: 80px !important;
            }
            
            .content-section {
              padding: 12px !important;
            }
          }

          .tab-button svg rect {
            stroke-dasharray: 380;
            stroke-dashoffset: 380;
            stroke-linecap: round;
            stroke-linejoin: round;
            vector-effect: non-scaling-stroke;
          }
          .tab-button svg rect.border-anim-in {
            animation: drawBorderIn 4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .tab-button svg rect.border-visible {
            stroke-dashoffset: 0;
          }
          .tab-button svg rect.border-anim-out {
            animation: drawBorderOut 4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          @keyframes drawBorderIn {
            0% { stroke-dashoffset: 380; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes drawBorderOut {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 380; }
          }
          @keyframes fadeInMenu {
            from { 
              opacity: 0; 
              transform: translateY(-10px) scale(0.98);
              filter: blur(4px);
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }
          .tab-button svg rect,
          .info-button svg rect {
            filter: drop-shadow(0 0 0px #ccd9ff);
            transition: filter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .tab-button:not([aria-selected="true"]):hover svg rect,
          .info-button:not([aria-selected="true"]):hover svg rect {
            filter: drop-shadow(0 0 32px #ccd9ff);
          }
          .menu-fade-in {
            opacity: 0;
            transform: translateY(-16px);
            animation: menuDropFade 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .menu-fade-in-0 { animation-delay: 0.08s; }
          .menu-fade-in-1 { animation-delay: 0.26s; }
          .menu-fade-out {
            opacity: 1;
            transform: translateY(0);
            animation: menuDropFadeOut 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .menu-fade-out-0 { animation-delay: 0s; }
          .menu-fade-out-1 { animation-delay: 0.35s; }
          @keyframes menuDropFade {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes menuDropFadeOut {
            to {
              opacity: 0;
              transform: translateY(-8px);
            }
          }
          .menu-btn-iris {
            width: 260px;
            min-width: 0;
            max-width: 100vw;
            min-height: 54px;
            padding: 0 28px;
            border-radius: 16px;
            box-sizing: border-box;
            overflow: hidden;
            font-size: 16px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            cursor: pointer;
            outline: none;
            border: 2px solid transparent;
            background: linear-gradient(#121212, #121212) padding-box, linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff) border-box;
            color: #121212;
            position: relative;
            margin: 0;
            transform: scale(1);
            transition: color 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .menu-btn-iris::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff);
            border-radius: 16px;
            opacity: 0;
            transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1);
            pointer-events: none;
          }
          .menu-btn-iris:hover::before, .menu-btn-iris:focus::before, .menu-btn-iris.selected::before {
            opacity: 1;
          }
          .menu-btn-iris span {
            background: linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            transition: -webkit-text-fill-color 0.7s cubic-bezier(0.22, 1, 0.36, 1), color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            z-index: 1;
          }
          .menu-btn-iris:hover, .menu-btn-iris:focus, .menu-btn-iris.selected {
            color: #23242a;
            transform: scale(1.04);
          }
          .menu-btn-iris:hover span, .menu-btn-iris:focus span, .menu-btn-iris.selected span {
            -webkit-text-fill-color: #23242a;
            color: #23242a;
          }
          .menu-btn-iris i {
            color: #ccd9ff;
            font-size: 22px;
            transition: color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
            position: relative;
            z-index: 1;
          }
          .menu-btn-iris:hover i, .menu-btn-iris:focus i, .menu-btn-iris.selected i {
            color: #23242a;
          }
          .gallery-menu-btn-iris {
            width: 260px;
            min-width: 0;
            max-width: 100vw;
            min-height: 54px;
            padding: 0 28px;
            border-radius: 16px;
            box-sizing: border-box;
            overflow: hidden;
            font-size: 16px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            cursor: pointer;
            outline: none;
            border: 2px solid transparent;
            background: linear-gradient(#121212, #121212) padding-box, linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff) border-box;
            color: #121212;
            position: relative;
            margin: 0;
            transform: scale(1);
            transition: color 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .gallery-menu-btn-iris::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff);
            border-radius: 16px;
            opacity: 0;
            transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1);
            pointer-events: none;
          }
          .gallery-menu-btn-iris:hover::before, .gallery-menu-btn-iris:focus::before, .gallery-menu-btn-iris.selected::before {
            opacity: 1;
          }
          .gallery-menu-btn-iris span {
            background: linear-gradient(120deg, #f0f7ff, #ccd9ff, #e6e8f0, #f0f7ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            transition: -webkit-text-fill-color 0.7s cubic-bezier(0.22, 1, 0.36, 1), color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            z-index: 1;
          }
          .gallery-menu-btn-iris:hover, .gallery-menu-btn-iris:focus, .gallery-menu-btn-iris.selected {
            color: #23242a;
            transform: scale(1.04);
          }
          .gallery-menu-btn-iris:hover span, .gallery-menu-btn-iris:focus span, .gallery-menu-btn-iris.selected span {
            -webkit-text-fill-color: #23242a;
            color: #23242a;
          }
          .gallery-menu-btn-iris i {
            color: #ccd9ff;
            font-size: 22px;
            transition: color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
            position: relative;
            z-index: 1;
          }
          .gallery-menu-btn-iris:hover i, .gallery-menu-btn-iris:focus i, .gallery-menu-btn-iris.selected i {
            color: #23242a;
          }
        `}
      </style>
      {showPlayer && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            right: 32,
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            pointerEvents: 'auto',
            background: 'none',
            border: 'none',
            boxShadow: 'none',
            padding: 0, 
            minWidth: 0,
            width: 'auto',
            maxWidth: 'calc(100vw - 32px)',
            marginBottom: 0,
            opacity: showPlayer ? 1 : 0,
            transition: 'opacity 3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* ...music player controls and progress bar as before... */}
        </div>
      )}
    </div> 
  );
}

