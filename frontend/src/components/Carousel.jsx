import React, { useState, useEffect } from 'react';

const certificates = [
  { id: 1, img: "/assets/diploma1.png", title: "Certificat CCNA1", desc: "Curs finalizat cu succes - Noțiuni de bază" },
  { id: 2, img: "/assets/diploma2.png", title: "Certificat CCNA2", desc: "Curs finalizat cu succes - Noțiuni intermediare" },
  { id: 3, img: "/assets/diploma3.png", title: "Certificat Web101", desc: "Curs finalizat cu succes - Noțiuni de bază" },
  { id: 4, img: "/assets/HackItAllPrize.jpeg", title: "HackItAll", desc: "Concurs de 24 de ore - Locul 3" },
  { id: 5, img: "/assets/SCSS1.png", title: "Sesiune de Comunicări Științifice Studențești", desc: "Fenomenul de Burnout la noua generație - Locul 1" },
  { id: 6, img: "/assets/SCSS2.png", title: "Sesiune de Comunicări Științifice Studențești", desc: "Roomsy - aplicație de găsit colocatar - Mențiune" }
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCert, setSelectedCert] = useState(null);

  // Autoscroll la fiecare 3 secunde
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % certificates.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const openPopup = (cert) => {
    setSelectedCert(cert);
  };

  const closePopup = () => {
    setSelectedCert(null);
  };

  return (
    <section className="carousel-section">
      <div className="container">
        <h2>Diplome și participări</h2>
        <div className="carousel-container">
          <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {certificates.map(cert => (
              <div key={cert.id} className="carousel-item" onClick={() => openPopup(cert)}>
                <img src={cert.img} alt={cert.title} />
                <p>{cert.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCert && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <h3>{selectedCert.title}</h3>
            <img src={selectedCert.img} alt={selectedCert.title} />
            <p>{selectedCert.desc}</p>
            <button className="close-popup" onClick={closePopup}>✕ Închide</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Carousel;