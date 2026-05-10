import React, { useState, useEffect } from 'react';

const GitHubCommits = () => {
  const users = ['hannamalureanu', 'teodoraduca507'];
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCommits = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obține toate repository-urile publice ale utilizatorului
        const reposRes = await fetch(`https://api.github.com/users/${selectedUser}/repos?per_page=30`);
        if (!reposRes.ok) throw new Error('Nu s-au putut obține repo-urile');
        const repos = await reposRes.json();

        // Pentru fiecare repo, obține ultimele 2 commit-uri
        const commitPromises = repos.map(async (repo) => {
          const commitsRes = await fetch(`https://api.github.com/repos/${selectedUser}/${repo.name}/commits?per_page=2`);
          if (!commitsRes.ok) return [];
          const commitsData = await commitsRes.json();
          return commitsData.map(c => ({
            repo: repo.name,
            message: c.commit.message,
            date: new Date(c.commit.author.date).toLocaleString(),
            url: c.html_url,
            sha: c.sha
          }));
        });

        const allCommitsArrays = await Promise.all(commitPromises);
        const allCommits = allCommitsArrays.flat();
        // Sortează descrescător după dată (cel mai recent primul)
        allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
        // Afișează ultimele 10 commit-uri
        setCommits(allCommits.slice(0, 10));
      } catch (err) {
        console.error(err);
        setError(err.message);
        setCommits([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedUser) fetchAllCommits();
  }, [selectedUser]);

  return (
    <section className="github-section">
      <div className="container">
        <h2>Activitate recentă pe GitHub</h2>
        <div className="user-selector">
          <label>Alege utilizator: </label>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        {loading && <p>Încărcare...</p>}
        {error && <p className="error-message">Eroare: {error}</p>}
        {!loading && !error && (
          <ul className="commits-list">
            {commits.length === 0 && <li>Nu există commit-uri publice recente.</li>}
            {commits.map((c, idx) => (
              <li key={idx}>
                <strong>{c.date}</strong> – {c.message} <em>({c.repo})</em><br/>
                <a href={c.url} target="_blank" rel="noopener noreferrer">🔗 Vezi commit</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default GitHubCommits;