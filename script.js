const views = {
  spark: {
    body: `
      <article class="localhost-card">
        <div class="localhost-card__header">
          <a class="localhost-link" href="/spark/" target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>
        <iframe
          class="localhost-frame"
          src="/spark/jobs/"
          title="Spark UI"
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
      </article>
    `,
  },
  uc: {
    body: `
      <article class="localhost-card">
        <div class="localhost-card__header">
          <a class="localhost-link" href="http://localhost:3000/" target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>
        <iframe
          class="localhost-frame"
          src="http://localhost:3000/"
          title="Unity Catalog UI"
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
      </article>
    `,
  },
  sql: {
    body: `
      <article class="localhost-card">
        <div class="localhost-card__header">
          <a class="localhost-link" href="/sql/" target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>
        <iframe
          class="localhost-frame"
          src="/sql/"
          title="SQL UI"
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
      </article>
    `,
  },
  mlflow: {
    body: `
      <article class="localhost-card">
        <div class="localhost-card__header">
          <a class="localhost-link" href="/mlflow/" target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>
        <iframe
          class="localhost-frame"
          src="/mlflow/"
          title="MLFlow UI"
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
      </article>
    `,
  },
  airflow: {
    body: `
      <div class="content-grid">
        <article class="panel-card">
          <span class="panel-label">Airflow (waiting)</span>
          <h3>Pipeline orchestration</h3>
          <p>
            Use this panel for DAG status, schedules, task retries, and operational notes.
          </p>
          <div class="pill-row">
            <span class="pill">DAGs</span>
            <span class="pill">Schedules</span>
            <span class="pill">Retries</span>
          </div>
        </article>
        <aside class="info-card">
          <span class="panel-label">Status</span>
          <h3>Operations ready</h3>
          <p>Track failures, reruns, and dependency chains in one place.</p>
        </aside>
      </div>
      <article class="list-card">
        <span class="panel-label">Runbook</span>
        <h3>Useful additions</h3>
        <ul>
          <li>Latest DAG run outcomes and owner contacts.</li>
          <li>Task duration summaries and SLA misses.</li>
          <li>Quick links to logs and manual rerun actions.</li>
        </ul>
      </article>
    `,
  },
  superset: {
    body: `
      <div class="content-grid">
        <article class="panel-card">
          <span class="panel-label">Superset (waiting)</span>
          <h3>Data exploration</h3>
          <p>
            Use this panel for dashboards, charts, and data insights.
          </p>
          <div class="pill-row">
            <span class="pill">Dashboards</span>
            <span class="pill">Charts</span>
            <span class="pill">SQL Lab</span>
          </div>
        </article>
        <aside class="info-card">
          <span class="panel-label">Highlights</span>
          <h3>Key metrics</h3>
          <p>Track important KPIs, recent queries, and dashboard updates.</p>
        </aside>
      </div>
      <article class="list-card">
        <span class="panel-label">Resources</span>
        <h3>Useful links</h3>
        <ul>
          <li>Frequently accessed dashboards and charts.</li>
          <li>Recent SQL queries and saved datasets.</li>
          <li>Documentation and support contacts.</li>
        </ul>
      </article>
    `,
  },
};

const menuLinks = document.querySelectorAll(".menu-link");
const contentBody = document.getElementById("content-body");
const contentPanel = document.querySelector('.content-panel');

const embeddedViews = new Set(['spark', 'uc', "sql", 'mlflow',]);

function renderView(viewKey) {
  const selectedView = views[viewKey];

  if (!selectedView) {
    return;
  }

  contentPanel.classList.toggle('content-panel--embedded', embeddedViews.has(viewKey));
  contentBody.innerHTML = selectedView.body;

  menuLinks.forEach((link) => {
    const isActive = link.dataset.view === viewKey;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    renderView(link.dataset.view);
  });
});

renderView("spark");