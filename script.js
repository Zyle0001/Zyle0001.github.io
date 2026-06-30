const username = "Zyle0001";
const excludedRepos = new Set(["zyle0001.github.io", "zyle0001/zyle0001.github.io"]);
const featuredRepos = [
  {
    name: "SynthSmith-Lab",
    html_url: "https://github.com/Zyle0001/SynthSmith-Lab",
    description: "RenderBot, director tooling, trainer skeletons, and internal docs for synthesizer-inspired AI experiments.",
    language: "Python",
    stargazers_count: 0,
    featured: true,
  },
  {
    name: "Tiny-Minds",
    html_url: "https://github.com/Zyle0001/Tiny-Minds",
    description: "Small, interpretable neural modules that explore perception, regulation, memory, agency, and other cognition primitives.",
    language: "Python",
    stargazers_count: 0,
    featured: true,
  },
];

const container = document.getElementById("repos");

function repoKey(repo) {
  return repo.name.toLowerCase();
}

function repoIdentifiers(repo) {
  return [repo.name, repo.full_name, repo.html_url]
    .filter(Boolean)
    .map(value => value.toLowerCase());
}

function isPortfolioRepo(repo) {
  return repoIdentifiers(repo).some(identifier => excludedRepos.has(identifier));
}

function normaliseRepo(repo) {
  const featured = featuredRepos.find(item => item.name.toLowerCase() === repo.name.toLowerCase());

  return {
    ...repo,
    description: repo.description || featured?.description || "Project details coming soon.",
    language: repo.language || featured?.language || "Various",
    featured: Boolean(featured),
    sortDate: repo.pushed_at || repo.updated_at || "",
  };
}

function mergeRepos(repos) {
  const repoMap = new Map();

  featuredRepos.forEach(repo => repoMap.set(repoKey(repo), repo));

  repos
    .filter(repo => !repo.fork && !isPortfolioRepo(repo))
    .map(normaliseRepo)
    .forEach(repo => repoMap.set(repoKey(repo), repo));

  return [...repoMap.values()].sort((a, b) => {
    if (a.featured !== b.featured) {
      return Number(b.featured) - Number(a.featured);
    }

    return new Date(b.sortDate || 0) - new Date(a.sortDate || 0);
  });
}

function renderRepos(repos) {
  container.innerHTML = "";

  repos.filter(repo => !isPortfolioRepo(repo)).forEach(repo => {
    const card = document.createElement("a");
    card.href = repo.html_url;
    card.className = `repo-card${repo.featured ? " repo-card--featured" : ""}`;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `Open ${repo.name} on GitHub`);

    const cardTop = document.createElement("div");
    cardTop.className = "repo-card__top";

    const title = document.createElement("h3");
    title.textContent = repo.name;
    cardTop.appendChild(title);

    if (repo.featured) {
      const badge = document.createElement("span");
      badge.className = "repo-badge";
      badge.textContent = "Featured";
      cardTop.appendChild(badge);
    }

    const description = document.createElement("p");
    description.textContent = repo.description;

    const meta = document.createElement("small");
    meta.textContent = `${repo.language} · ⭐ ${repo.stargazers_count ?? 0}`;

    const cta = document.createElement("span");
    cta.className = "repo-cta";
    cta.textContent = "View repository →";

    card.append(cardTop, description, meta, cta);
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
