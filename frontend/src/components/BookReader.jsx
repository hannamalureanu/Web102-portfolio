import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const BookReader = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [totalPages, setTotalPages] = useState(null);
  const [currentDoublePage, setCurrentDoublePage] = useState(1);
  const [quotes, setQuotes] = useState([]);
  const [quoteText, setQuoteText] = useState('');
  const [quotePage, setQuotePage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Încarcă date salvate pentru fișier
  useEffect(() => {
    if (!fileName) return;
    const saved = localStorage.getItem(`book_${fileName}`);
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentDoublePage(data.currentDoublePage || 1);
      setTotalPages(data.totalPages || null);
      setQuotes(data.quotes || []);
    }
  }, [fileName]);

  // Salvează automat
  useEffect(() => {
    if (!fileName || !totalPages) return;
    const toSave = { currentDoublePage, totalPages, quotes };
    localStorage.setItem(`book_${fileName}`, JSON.stringify(toSave));
  }, [currentDoublePage, totalPages, quotes, fileName]);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Te rog să încarci un fișier PDF.');
      return;
    }
    setFileName(file.name);
    setLoading(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages = pdf.numPages;
      setTotalPages(pages);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      const saved = localStorage.getItem(`book_${file.name}`);
      if (saved) {
        const data = JSON.parse(saved);
        setCurrentDoublePage(data.currentDoublePage || 1);
        setQuotes(data.quotes || []);
      } else {
        setCurrentDoublePage(1);
        setQuotes([]);
      }
    } catch (err) {
      setError('Nu s-a putut citi PDF-ul. Fișierul este corupt?');
    } finally {
      setLoading(false);
    }
  };

  const goPrev = () => {
    if (currentDoublePage > 1) {
      setCurrentDoublePage(currentDoublePage - 1);
    }
  };

  const goNext = () => {
    if (totalPages && currentDoublePage < totalPages - 1) {
      setCurrentDoublePage(currentDoublePage + 1);
    }
  };

  const addQuote = () => {
    if (!quoteText.trim()) return;
    const newQuote = {
      id: Date.now(),
      text: quoteText.trim(),
      page: quotePage,
      timestamp: new Date().toLocaleString(),
    };
    setQuotes([...quotes, newQuote]);
    setQuoteText('');
  };

  const deleteQuote = (id) => {
    setQuotes(quotes.filter(q => q.id !== id));
  };

  if (!pdfUrl || !totalPages) {
    return (
      <section className="book-reader-section">
        <div className="container">
          <h2>📖 Cititor PDF (Double Page)</h2>
          <div className="upload-area">
            <input type="file" accept="application/pdf" onChange={onFileChange} />
            {loading && <p>Se încarcă...</p>}
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </section>
    );
  }

  const leftPage = currentDoublePage;
  const rightPage = currentDoublePage + 1;

  return (
    <section className="book-reader-section">
      <div className="container">
        <h2>📖 Cititor PDF (Double Page)</h2>
        <div className="upload-area">
          <input type="file" accept="application/pdf" onChange={onFileChange} />
          <p>Fișier: {fileName}</p>
        </div>

        <div className="toolbar">
          <button onClick={goPrev} disabled={leftPage <= 1}>◀ Pagina anterioară</button>
          <span>Pagina {leftPage} – {rightPage} din {totalPages}</span>
          <button onClick={goNext} disabled={rightPage >= totalPages}>Pagina următoare ▶</button>
        </div>

        <div className="double-page-iframe">
          <iframe
            key={`left-${leftPage}`}
            title={`page-${leftPage}`}
            className="pdf-iframe"
            src={`${pdfUrl}#page=${leftPage}`}
          />
          <iframe
            key={`right-${rightPage}`}
            title={`page-${rightPage}`}
            className="pdf-iframe"
            src={`${pdfUrl}#page=${rightPage}`}
          />
        </div>

        <div className="quote-manual-area">
          <textarea
            rows="3"
            placeholder="📌 Selectează textul din paginile de mai sus, copiază-l (Ctrl+C), apoi lipește aici."
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
          />
          <div className="quote-row">
            <label>Pagina citatului:</label>
            <select value={quotePage} onChange={(e) => setQuotePage(parseInt(e.target.value))}>
              <option value={leftPage}>Pagina {leftPage}</option>
              <option value={rightPage}>Pagina {rightPage}</option>
            </select>
            <button onClick={addQuote}>✍️ Salvează ca quote</button>
          </div>
        </div>

        <div className="quotes-list">
          <h3>📝 Citate salvate</h3>
          {quotes.length === 0 && <p>Niciun quote încă. Adaugă unul folosind câmpul de mai sus.</p>}
          {quotes.map(q => (
            <div key={q.id} className="quote-item">
              <p><strong>Pagina {q.page}:</strong> “{q.text}”</p>
              <small>{q.timestamp}</small>
              <button onClick={() => deleteQuote(q.id)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookReader;