const username = "Zyle0001";
const excludedRepos = new Set(["Zyle0001.github.io"]);
const featuredRepos = [
  {
    name: "SynthSmith-Lab",
    html_url: "https://github.com/Zyle0001/SynthSmith-Lab",
    description: "A highlighted portfolio project from my current GitHub work.",
    language: "Repository",
    stargazers_count: 0,
    featured: true,
  },
  {
    name: "Tiny-Minds",
    html_url: "https://github.com/Zyle0001/Tiny-Minds",
    description: "A highlighted portfolio project from my current GitHub work.",
    language: "Repository",
    stargazers_count: 0,
    featured: true,
  },
];

const container = document.getElementById("repos");

function normaliseRepo(repo) {
  const featured = featuredRepos.find(item => item.name === repo.name);

  return {
    ...repo,
    description: repo.description || featured?.description || "Project details coming soon.",
    language: repo.language || featured?.language || "Various",
    featured: Boolean(featured),
  };
}

function mergeRepos(repos) {
  const repoMap = new Map();

  featuredRepos.forEach(repo => repoMap.set(repo.name, repo));

  repos
    .filter(repo => !repo.fork && !excludedRepos.has(repo.name))
    .forEach(repo => repoMap.set(repo.name, normaliseRepo(repo)));

  return [...repoMap.values()].sort((a, b) => Number(b.featured) - Number(a.featured));
}

function renderRepos(repos) {
  container.innerHTML = "";

  repos.forEach(repo => {
    const card = document.createElement("a");
    card.href = repo.html_url;
    card.className = `repo-card${repo.featured ? " repo-card--featured" : ""}`;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    if (repo.featured) {
      const badge = document.createElement("span");
      badge.className = "repo-badge";
      badge.textContent = "Featured";
      card.appendChild(badge);
    }

    const title = document.createElement("h3");
    title.textContent = repo.name;

    const description = document.createElement("p");
    description.textContent = repo.description;

    const meta = document.createElement("small");
    meta.textContent = `${repo.language} · ⭐ ${repo.stargazers_count ?? 0}`;

    card.append(title, description, meta);
    container.appendChild(card);
  });
}

fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
  .then(res => {
    if (!res.ok) {
      throw new Error("GitHub repositories could not be loaded.");
    }

    return res.json();
  })
  .then(repos => renderRepos(mergeRepos(repos)))
  .catch(() => renderRepos(featuredRepos));
