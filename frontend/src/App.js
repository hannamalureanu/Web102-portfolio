import React, { useRef } from 'react';
import { LayoutProvider, useLayout } from './contexts/LayoutContext';
import LayoutSwitcher from './components/LayoutSwitcher';
import Portfolio from './components/Portfolio';
import ProjectsGrid from './components/ProjectsGrid';
import GitHubCommits from './components/GitHubCommits';
import Carousel from './components/Carousel';
import CVDownload from './components/CVDownload';
import WeatherMap from './components/WeatherMap';
import BookReader from './components/BookReader';
import './App.css';

function MainContent() {
  const projectsRef = useRef(null);
  const githubRef = useRef(null);
  const carouselRef = useRef(null);
  const cvRef = useRef(null);
  const mapRef = useRef(null);
  const { layout } = useLayout();
  const bookRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`app layout-${layout}`}>
      {/* Navbar fix */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">Hanna & Teodora</div>
          <ul className="nav-links">
            <li><button onClick={() => scrollTo(projectsRef)}>Proiecte</button></li>
            <li><button onClick={() => scrollTo(githubRef)}>GitHub</button></li>
            <li><button onClick={() => scrollTo(carouselRef)}>Diplome</button></li>
            <li><button onClick={() => scrollTo(cvRef)}>CV</button></li>
            <li><button onClick={() => scrollTo(mapRef)}>Hartă meteo</button></li>
            <li><button onClick={() => scrollTo(bookRef)}>Cititor PDF</button></li>
          </ul>
          <LayoutSwitcher />
        </div>
      </nav>

      <main>
        <Portfolio onCtaClick={() => scrollTo(projectsRef)} />
        <div ref={projectsRef}><ProjectsGrid /></div>
        <div ref={githubRef}><GitHubCommits /></div>
        <div ref={carouselRef}><Carousel /></div>
        <div ref={cvRef}><CVDownload /></div>
        <div ref={mapRef}><WeatherMap /></div>
        <div ref={bookRef}><BookReader /></div>
      </main>

      <footer className="footer">
        <p>© 2026 Hanna Mălureanu & Teodora Duca – Portofoliu interactiv</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LayoutProvider>
      <MainContent />
    </LayoutProvider>
  );
}

export default App;