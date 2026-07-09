const features = [
  "Simple React + Vite setup",
  "Ready for Git and GitHub",
  "Easy to extend into a real product",
];

function App() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Starter Project</p>
        <h1>Build your app from a clean, working base.</h1>
        <p className="lede">
          This project gives you a small front-end app scaffold so you can start
          building features instead of wrestling with setup.
        </p>

        <div className="actions">
          <a className="primary-button" href="https://github.com/" target="_blank" rel="noreferrer">
            Open GitHub
          </a>
          <a className="secondary-button" href="#next-steps">
            View next steps
          </a>
        </div>
      </section>

      <section className="content-grid" id="next-steps">
        <article className="info-panel">
          <h2>What’s included</h2>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>

        <article className="info-panel">
          <h2>Suggested next moves</h2>
          <ol>
            <li>Install dependencies with <code>npm install</code>.</li>
            <li>Start the app with <code>npm run dev</code>.</li>
            <li>Create a GitHub repo and push this folder to it.</li>
          </ol>
        </article>
      </section>
    </main>
  );
}

export default App;
