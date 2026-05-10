import React from 'react';

const Portfolio = ({ onCtaClick }) => {
  return (
    <section className="portfolio-section">
      <div className="container">
        <div className="team-photo">
          <img src="/assets/InnovationLabsGroupPhoto.jpeg" alt="Hanna și Teodora" />
        </div>
        <h1>Hanna Mălureanu & Teodora Duca</h1>
        <p className="tagline">Studente în anul 2 la Facultatea de Inginerie în Limbi Străine</p>
        <p> Roomies, pasionate de programare și design, concurente la Innovation Labs unde dezvoltăm SafeLand, o soluție pentru siguranța online a copiilor.</p>
        <button className="cta-button" onClick={onCtaClick}>Vezi proiectele noastre ↓</button>
      </div>
    </section>
  );
};

export default Portfolio;