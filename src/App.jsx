function App() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Function Only</p>
        <h1>Use the scoring function directly.</h1>
        <p className="lede">
          The reusable company scoring logic lives in <code>src/sustainabilityScore.js</code>.
          The main entry point is <code>getCompanySustainabilityScore(companyName)</code>.
        </p>
        <div className="info-panel">
          <h2>Example</h2>
          <pre>
            <code>{`import { getCompanySustainabilityScore } from "./sustainabilityScore";

const result = await getCompanySustainabilityScore("Unilever");`}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}

export default App;
