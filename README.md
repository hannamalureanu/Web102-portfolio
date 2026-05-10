# 🌐 Portofoliu interactiv – Web102 

Proiect full-stack ce integrează un portofoliu personal, aplicație meteo, activitate GitHub, diplome, 3 layout-uri comutabile și **un cititor PDF avansat (double-page, citate, persistentă) – implementat ca extra / bonus**. Dezvoltat cu **Flask** (backend) și **React** (frontend).

---

## 🚀 Funcționalități principale

### Modul I – Portofoliu & Proiecte
- Prezentare echipă cu poză, descriere și buton CTA (scroll smooth la proiecte).
- Grid de proiecte (biscuiți) cu imagine, titlu, descriere scurtă.
- La hover: descriere detaliată + efect de mărire.
- Click pe card → deschide link-ul proiectului (ex. GitHub repo).

### Modul II – CV & Evenimente
- Carusel automat cu diplome / participări (autoscroll la 3 secunde).
- Click pe element → popup cu detalii.
- Butoane pentru descărcarea CV-urilor fiecărui membru.

### Modul III – Layout-uri comutabile
- 3 layout-uri: `professional`, `whimsical`, `retro`.
- Butoane de comutare în navbar.
- Persistență în `localStorage` (se reține la refresh).
- Tranziții animate între layout-uri.

### Modul IV – Harta meteo
- Hartă Leaflet cu 6 locații prestabilite (București, Câmpulung, Ploiești, Paris, Orléans, Toulouse).
- Click pe marker → afișează date meteo de la OpenWeatherMap (temperatură, umiditate, descriere, vânt, iconiță).
- Card meteo frumos stilizat, cu buton de închidere.

### ⭐ Modul V – Cititor PDF (Double-page) – **EXTRA / BONUS**

- **Încărcare PDF** local.
- **Extrage automat numărul total de pagini** folosind `pdfjs-dist`.
- **Double-page display** – două pagini afișate una lângă alta, pe fundal lemn (aspect de carte).
- **Butoane de navigare** corect limitate la intervalul paginilor.
- **Salvare automată** a paginii curente și a citatelor în `localStorage` (pe numele fișierului).
- **Citate** – utilizatorul selectează text din pagină (copiază manual), lipește în câmp, alege pagina (stânga / dreapta) și salvează.
- **Listă citate salvate** cu posibilitate de ștergere.
- **Persistență completă** – la reîncărcarea paginii, utilizatorul revine la ultima pagină vizualizată și își vede citatele.

### Extra – Activitate GitHub (commits)
- Dropdown pentru a alege utilizatorul (`hannamalureanu` sau `teodoraduca507`).
- Afișează ultimele 10 commit‑uri din toate repository‑urile publice, în ordine cronologică descrescătoare.
- Link direct către commit pe GitHub.

---

## 🛠️ Tehnologii utilizate

| Categorie           | Tehnologii                                                                 |
|---------------------|----------------------------------------------------------------------------|
| Backend             | Python 3, Flask, Flask-CORS, Requests, python-dotenv, csv                  |
| Frontend            | React 19, React Hooks, Context API, Recharts, Leaflet, react-leaflet        |
| PDF & Worker (extra)| pdfjs-dist (2.16.105), iframe + #page=                                    |
| API externe         | OpenWeatherMap, GitHub API (commits)                                      |
| Stilizare           | CSS custom cu variabile, 3 teme, tranziții, responsive design              |
| Stocare client      | localStorage (temă, pagină PDF, citate, ultimul oraș)                      |
