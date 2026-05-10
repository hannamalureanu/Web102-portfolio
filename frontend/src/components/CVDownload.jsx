import React from 'react';

const CVDownload = () => {
  const downloadCV = (filePath, fileName) => {
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(err => console.error('Eroare descărcare CV:', err));
  };

  return (
    <section className="cv-section">
      <div className="container">
        <h2>CV-urile echipei</h2>
        <div className="cv-buttons">
          <button onClick={() => downloadCV('/assets/cv_hanna.pdf', 'CV_Hanna_Malureanu.pdf')}>
            📄 CV Hanna Mălureanu
          </button>
          <button onClick={() => downloadCV('/assets/cv_teo.pdf', 'CV_Teodora_Duca.pdf')}>
            📄 CV Teodora Duca
          </button>
        </div>
      </div>
    </section>
  );
};

export default CVDownload;