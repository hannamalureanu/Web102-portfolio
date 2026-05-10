import React from 'react';

const projectsData = [
  {
    id: 1,
    title: "Weather App Full-Stack",
    image: "/assets/WeatherApp.png",
    shortDesc: "Aplicație meteo cu prognoză, hartă și istoric CSV",
    fullDesc: "Backend Flask + OpenWeatherMap API, frontend React cu Recharts și Leaflet. Suportă dark/light theme și persistare ultimului oraș. Proiect colaborativ.",
    link: "https://github.com/hannamalureanu/Weather-App"  
  },
  {
    id: 2,
    title: "SafeLand – Siguranța online a copiilor",
    image: "/assets/SafeLandLogo.jpeg",
    shortDesc: "Soluție pentru protecția copiilor în mediul online",
    fullDesc: "Proiect realizat în cadrul Innovation Labs. Aplicație care monitorizează și introduce latency în conținutul copii.",
    link: "https://github.com/Sami111-Afk/DopamineHijack-v1.h"    
  },
  {
    id: 3,
    title: "Portofoliu dinamic",
    image: "/assets/portfolio.png",
    shortDesc: "Acest portofoliu cu multiple layout-uri",
    fullDesc: "Proiect realizat pentru cursul Web 102, include 3 layout-uri comutabile, carusel, integrare GitHub API, hartă meteo.",
    link: "https://github.com/hannamalureanu/Web102-Portfolio" 
  }
];

const ProjectsGrid = () => {
  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <h2>Proiectele noastre</h2>
        <div className="projects-grid">
          {projectsData.map(proj => (
            <div 
              key={proj.id} 
              className="project-card" 
              onClick={() => window.open(proj.link, '_blank')}
            >
              <img src={proj.image} alt={proj.title} />
              <h3>{proj.title}</h3>
              <p className="short-desc">{proj.shortDesc}</p>
              <div className="hover-details">
                <p>{proj.fullDesc}</p>
                <span className="link-hint">Click pentru detalii →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;