const username = "YOUR_GITHUB_USERNAME";

fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
  .then(res => res.json())
  .then(repos => {
    const container = document.getElementById("repos");

    repos
      .filter(repo => !repo.fork)
      .forEach(repo => {
        const card = document.createElement("a");
        card.href = repo.html_url;
        card.className = "repo-card";
        card.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description yet."}</p>
          <small>${repo.language || "Various"} · ⭐ ${repo.stargazers_count}</small>
        `;
        container.appendChild(card);
      });
  });
