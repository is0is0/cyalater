import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import AllAboutYou from './AllAboutYou'
import ThrowbackGallery from './ThrowbackGallery'
import FromYenAndAnge from './FromYenAndAnge'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/throwback-gallery" element={<ThrowbackGallery key={window.location.pathname} />} />
        <Route path="/all-about-you" element={<AllAboutYou />} />
        <Route path="/from-yen-and-ange" element={<FromYenAndAnge />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
