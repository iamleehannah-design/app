import { useDeferredValue, useEffect, useState } from "react";

import {
  demoCompanies,
  getBarcodeSustainabilityScore,
  getCompanySustainabilityScore,
  resolveCompanyEntity,
  resolveCompanyProfile,
  sanitizeBarcodeInput,
} from "./sustainabilityScore";

const SAMPLE_COMPANY_INPUTS = [
  "Dove",
  "Oreo",
  "Unilever",
  "Gillette",
  "Coca-Cola",
  "Hellmann's",
];

const SCORING_SOURCES = [
  {
    name: "Local brand-to-company catalog",
    type: "Built into the app",
    role: "First-pass matching",
    detail: "Matches known parent companies, aliases, and brands first.",
  },
  {
    name: "Wikidata",
    type: "Public company resolution data",
    role: "Fallback company matching",
    detail: "Fallback matching when the local catalog misses.",
    url: "https://www.wikidata.org/wiki/Wikidata:Data_access",
  },
  {
    name: "Open Food Facts",
    type: "Public product evidence",
    role: "Food and grocery product records",
    detail: "Food barcode and product evidence.",
    url: "https://world.openfoodfacts.org/",
  },
  {
    name: "Open Beauty Facts",
    type: "Public product evidence",
    role: "Beauty and personal care product records",
    detail: "Beauty and personal-care product evidence.",
    url: "https://world.openbeautyfacts.org/",
  },
  {
    name: "Open Products Facts",
    type: "Public product evidence",
    role: "General consumer product records",
    detail: "General product evidence outside food and beauty.",
    url: "https://world.openproductsfacts.org/",
  },
  {
    name: "World Bank Indicators API",
    type: "Public context data",
    role: "Country-level background context",
    detail: "Country-level carbon, renewable, and land context.",
    url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
  },
  {
    name: "UN SDG API",
    type: "Public context data",
    role: "SDG alignment context",
    detail: "Light SDG context for social and governance.",
    url: "https://unstats.un.org/SDGAPI/swagger/",
  },
];

function formatScore(value) {
  return typeof value === "number" ? `${value}/100` : "N/A";
}

function formatConfidence(value) {
  return typeof value === "number" ? `${Math.round(value * 100)}%` : "N/A";
}

function formatMatchType(matchType) {
  if (matchType === "brand-parent") {
    return "brand";
  }

  if (matchType === "canonical") {
    return "company name";
  }

  if (matchType === "alias") {
    return "company alias";
  }

  if (matchType === "wikidata-owner") {
    return "public brand owner data";
  }

  if (matchType === "wikidata-company") {
    return "public company data";
  }

  return "unknown";
}

function getFriendlyBarcodeError(error) {
  if (error?.code === "invalid_barcode" || error?.code === "barcode_not_found") {
    return error.message;
  }

  if (String(error?.message || "").includes("503")) {
    return "Open Food Facts is temporarily rate-limiting anonymous lookups. Wait a moment and try again.";
  }

  return "Barcode lookup failed right now. Try again in a moment.";
}

function getScoreBanner(scoreResult) {
  if (scoreResult.error) {
    return {
      tone: "error",
      message: scoreResult.error,
    };
  }

  if (scoreResult.sourceAgreement?.detected) {
    return {
      tone: "warning",
      message: `${scoreResult.sourceAgreement.message} The final score uses a consensus blend rather than trusting any one source by itself.`,
    };
  }

  if (scoreResult.scoreStatus === "contextual-estimate") {
    return {
      tone: "info",
      message:
        "This is a contextual estimate. The app found the company and enough public background data to estimate a score, but it does not yet have strong direct product evidence for a fully verified company score.",
    };
  }

  if (scoreResult.scoreStatus === "insufficient-company-specific-data") {
    return {
      tone: "info",
      message:
        "This company matched, but the app still needs more direct product evidence before it can estimate a score.",
    };
  }

  return null;
}

function ScoringMethodTab() {
  return (
    <>
      <section className="hero-card logic-hero">
        <p className="eyebrow">Scoring Logic</p>
        <h1>How the score is built</h1>
        <p className="lede">
          The app pulls public evidence, converts it into one rubric, and computes one score.
        </p>
        <p className="hero-note">
          Random names can still show a number when only context data is available.
        </p>
      </section>

      <section className="logic-section">
        <article className="info-panel">
          <h2>Flowchart</h2>
          <div className="flowchart">
            <div className="flow-node">
              <strong>1. User enters a name or barcode</strong>
              <span>Dove, Oreo, Unilever, or package barcode</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">↓</div>
            <div className="flow-node">
              <strong>2. Resolve the company</strong>
              <span>Try the local catalog, then Wikidata</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">↓</div>
            <div className="flow-node">
              <strong>3. Gather evidence</strong>
              <span>Product evidence plus background context</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">↓</div>
            <div className="flow-node">
              <strong>4. Convert everything into one rubric</strong>
              <span>All signals become shared 0-100 inputs</span>
            </div>
            <div className="flow-arrow" aria-hidden="true">↓</div>
            <div className="flow-branch-grid">
              <div className="flow-node flow-node-accent">
                <strong>Product evidence exists</strong>
                <span>Show a verified company score</span>
              </div>
              <div className="flow-node flow-node-warning">
                <strong>Only context exists</strong>
                <span>Show a contextual estimate for now</span>
              </div>
              <div className="flow-node">
                <strong>No usable evidence</strong>
                <span>Show no score yet</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="content-grid">
        <article className="info-panel">
          <h2>One formula for every company</h2>
          <ul>
            <li>Overall score = 45% environmental + 25% social + 30% governance.</li>
            <li>Environmental = 75% product environmental + 10% carbon + 10% renewable + 5% land.</li>
            <li>Social = 70% product disclosure + 10% evidence coverage + 20% SDG context.</li>
            <li>Governance = 45% traceability + 30% disclosure + 15% evidence coverage + 10% SDG context.</li>
            <li>Evidence coverage rises as the app finds more direct product records.</li>
          </ul>
        </article>

        <article className="info-panel">
          <h2>How source disagreement is handled</h2>
          <ul>
            <li>The app does not blindly trust one website.</li>
            <li>It finds the middle value and downweights outliers.</li>
            <li>If sources still disagree a lot, the app lowers confidence.</li>
            <li>This helps with outliers, not weak matching.</li>
          </ul>
        </article>
      </section>

      <section className="content-grid">
        <article className="info-panel">
          <h2>Why fake-looking scores can appear</h2>
          <ul>
            <li>A typed name can miss the local catalog but still match a public Wikidata entity.</li>
            <li>The app can still compute a context-based number.</li>
            <li>That number can still appear when product evidence is zero.</li>
            <li>That is why some random names can look more scored than they are.</li>
          </ul>
        </article>

        <article className="info-panel">
          <h2>How to read the current result states</h2>
          <ul>
            <li><strong>Scored</strong>: the app found direct company-specific evidence.</li>
            <li><strong>Contextual estimate</strong>: the app found enough background context to estimate a number, but not enough direct product evidence.</li>
            <li><strong>Insufficient evidence</strong>: the app could not support a meaningful score yet.</li>
          </ul>
        </article>
      </section>

      <section className="logic-section">
        <article className="info-panel">
          <h2>Full source list used by the app right now</h2>
          <div className="source-catalog">
            {SCORING_SOURCES.map((source) => (
              <article className="source-catalog-card" key={source.name}>
                <p className="source-catalog-type">{source.type}</p>
                <h3>{source.name}</h3>
                <p className="source-catalog-role">
                  <strong>Used for:</strong> {source.role}
                </p>
                <p className="source-catalog-detail">{source.detail}</p>
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noreferrer">
                    Open source site
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function ScoreDetails({ title, scoreResult, compact = false }) {
  if (!scoreResult) {
    return null;
  }

  const banner = getScoreBanner(scoreResult);

  return (
    <section className={`results-panel${compact ? " results-panel-compact" : ""}`}>
      <div className="score-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>{scoreResult.resolvedCompany || scoreResult.input}</h2>
          <p className="result-summary">
            Match: <strong>{formatMatchType(scoreResult.matchedBy)}</strong>
            {" · "}
            Confidence: <strong>{formatConfidence(scoreResult.confidence)}</strong>
            {" · "}
            Score: <strong>{formatConfidence(scoreResult.scoreConfidence)}</strong>
          </p>
        </div>
        <p className="score-chip">
          {typeof scoreResult.score === "number" ? formatScore(scoreResult.score) : "No score yet"}
        </p>
      </div>

      {banner ? (
        <p
          className={`status-banner${banner.tone === "error" ? " status-banner-error" : ""}${
            banner.tone === "warning" ? " status-banner-warning" : ""
          }`}
        >
          {banner.message}
        </p>
      ) : null}

      <div className="result-grid">
        <article className="metric-card">
          <h3>Environmental</h3>
          <p>{formatScore(scoreResult.breakdown?.environmental)}</p>
          {!compact ? <p className="metric-note">Product signal plus light context.</p> : null}
        </article>
        <article className="metric-card">
          <h3>Social</h3>
          <p>{formatScore(scoreResult.breakdown?.social)}</p>
          {!compact ? <p className="metric-note">Disclosure, evidence coverage, and SDG context.</p> : null}
        </article>
        <article className="metric-card">
          <h3>Governance</h3>
          <p>{formatScore(scoreResult.breakdown?.governance)}</p>
          {!compact ? <p className="metric-note">Traceability, disclosure, and coverage.</p> : null}
        </article>
      </div>

      {compact ? (
        <div className="compact-meta">
          <p>Status: <strong>{scoreResult.scoreStatus || "none"}</strong></p>
          <p>Evidence: <strong>{scoreResult.breakdown?.productCoverage ?? 0}</strong></p>
          <p>Sources: <strong>{scoreResult.sources?.length ?? 0}</strong></p>
        </div>
      ) : (
        <div className="content-grid source-panel">
          <article className="info-panel">
            <h2>Match details</h2>
            <ul>
              <li>Resolved company: {scoreResult.resolvedCompany || "No match yet"}</li>
              <li>Score status: {scoreResult.scoreStatus}</li>
              <li>Scoring mode: {scoreResult.scoreStatus === "scored" ? "verified company score" : scoreResult.scoreStatus === "contextual-estimate" ? "contextual estimate" : "insufficient evidence"}</li>
              <li>Rubric version: {scoreResult.rubricVersion || "standard"}</li>
              <li>Product evidence count: {scoreResult.breakdown?.productCoverage ?? 0}</li>
              <li>Beauty evidence count: {scoreResult.breakdown?.beautyCoverage ?? 0}</li>
              <li>General products evidence count: {scoreResult.breakdown?.productsCoverage ?? 0}</li>
              <li>Evidence coverage score: {formatScore(scoreResult.breakdown?.evidenceCoverage)}</li>
              <li>Source agreement: {scoreResult.sourceAgreement?.status || "not-applicable"}</li>
            </ul>
          </article>

          <article className="info-panel">
            <h2>Sources used</h2>
            <ul>
              {scoreResult.sources?.length ? (
                scoreResult.sources.map((source) => (
                  <li key={source.source}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.source}
                    </a>
                  </li>
                ))
              ) : (
                <li>No source data was returned for this lookup.</li>
              )}
            </ul>
          </article>
        </div>
      )}

      {scoreResult.alternatives?.length ? (
        <p className="helper-copy">Other possible matches: {scoreResult.alternatives.join(", ")}.</p>
      ) : null}
    </section>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("lookup");
  const [companyQuery, setCompanyQuery] = useState("");
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [companyResult, setCompanyResult] = useState(null);
  const [barcodeResult, setBarcodeResult] = useState(null);
  const [companyError, setCompanyError] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [isBarcodeLoading, setIsBarcodeLoading] = useState(false);
  const [companyPreview, setCompanyPreview] = useState(null);
  const [isCompanyPreviewLoading, setIsCompanyPreviewLoading] = useState(false);

  const deferredCompanyQuery = useDeferredValue(companyQuery);

  useEffect(() => {
    const trimmedQuery = deferredCompanyQuery.trim();

    if (!trimmedQuery) {
      setCompanyPreview(null);
      setIsCompanyPreviewLoading(false);
      return undefined;
    }

    const localPreview = resolveCompanyEntity(trimmedQuery);
    if (localPreview.resolvedCompany) {
      setCompanyPreview(localPreview);
      setIsCompanyPreviewLoading(false);
      return undefined;
    }

    let cancelled = false;
    setCompanyPreview(null);
    setIsCompanyPreviewLoading(true);

    resolveCompanyProfile(trimmedQuery)
      .then((nextPreview) => {
        if (!cancelled) {
          setCompanyPreview(nextPreview);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCompanyPreview(localPreview);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsCompanyPreviewLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [deferredCompanyQuery]);

  async function handleCompanySubmit(event) {
    event.preventDefault();
    const trimmedQuery = companyQuery.trim();

    if (!trimmedQuery) {
      setCompanyError("Enter a product, brand, or company name first.");
      setCompanyResult(null);
      return;
    }

    setIsCompanyLoading(true);
    setCompanyError("");

    try {
      const nextResult = await getCompanySustainabilityScore(trimmedQuery);
      setCompanyResult(nextResult);
    } catch (error) {
      setCompanyResult(null);
      setCompanyError("Company lookup failed right now. Try again in a moment.");
    } finally {
      setIsCompanyLoading(false);
    }
  }

  async function handleBarcodeSubmit(event) {
    event.preventDefault();
    const normalizedBarcode = sanitizeBarcodeInput(barcodeQuery);

    if (!normalizedBarcode) {
      setBarcodeError("Enter a UPC or EAN barcode first.");
      setBarcodeResult(null);
      return;
    }

    setIsBarcodeLoading(true);
    setBarcodeError("");

    try {
      const nextResult = await getBarcodeSustainabilityScore(normalizedBarcode);
      setBarcodeResult(nextResult);
    } catch (error) {
      setBarcodeResult(null);
      setBarcodeError(getFriendlyBarcodeError(error));
    } finally {
      setIsBarcodeLoading(false);
    }
  }

  const barcodeScoreResult = barcodeResult?.scoreResult || null;

  return (
    <main className="page-shell">
      <section className="tab-strip" aria-label="App sections">
        <button
          className={`tab-button${activeTab === "lookup" ? " tab-button-active" : ""}`}
          type="button"
          onClick={() => setActiveTab("lookup")}
        >
          Lookup
        </button>
        <button
          className={`tab-button${activeTab === "logic" ? " tab-button-active" : ""}`}
          type="button"
          onClick={() => setActiveTab("logic")}
        >
          How scoring works
        </button>
      </section>

      {activeTab === "lookup" ? (
        <>
          <section className="hero-card">
            <p className="eyebrow">MVP Flow</p>
            <h1>Type a name now. Add barcode lookup without paid APIs.</h1>
            <p className="lede">
              Type a brand or barcode and get the company score.
            </p>
            <p className="hero-note">
              This MVP uses free public data only.
            </p>
          </section>

          <section className="lookup-grid">
            <article className="info-panel lookup-card">
              <h2>Search by product or company</h2>
              <p className="input-hint">
                Type a product, brand, or company.
              </p>

              <form className="score-form" onSubmit={handleCompanySubmit}>
                <label className="field-label" htmlFor="company-search">
                  Type a product, brand, or company
                </label>
                <div className="field-row">
                  <input
                    className="text-input"
                    id="company-search"
                    name="company-search"
                    type="text"
                    value={companyQuery}
                    onChange={(event) => setCompanyQuery(event.target.value)}
                    placeholder="Try Dove, Oreo, Unilever, Colgate..."
                  />
                  <button className="primary-button" type="submit" disabled={isCompanyLoading}>
                    {isCompanyLoading ? "Scoring..." : "Get score"}
                  </button>
                </div>
              </form>

              <div className="sample-chip-row">
                {SAMPLE_COMPANY_INPUTS.map((sample) => (
                  <button
                    key={sample}
                    className="sample-chip"
                    type="button"
                    onClick={() => {
                      setCompanyQuery(sample);
                    }}
                  >
                    {sample}
                  </button>
                ))}
              </div>

              <p className="helper-copy">
                {isCompanyPreviewLoading
                  ? "Checking for a match..."
                  : companyPreview
                  ? companyPreview.resolvedCompany
                    ? `Best match: ${companyPreview.resolvedCompany.canonicalName} via ${formatMatchType(
                        companyPreview.matchedBy,
                      )} (${formatConfidence(companyPreview.confidence)} confidence).`
                    : "No confident match yet."
                  : "Quickest way to test the app."}
              </p>

              {companyError ? (
                <p className="status-banner status-banner-error lookup-status">{companyError}</p>
              ) : null}

              {isCompanyLoading ? (
                <p className="status-banner lookup-status">Getting score...</p>
              ) : null}

              <ScoreDetails title="Typed result" scoreResult={companyResult} compact />
            </article>

            <article className="info-panel lookup-card">
              <h2>Lookup by barcode</h2>
              <p className="input-hint">
                Enter a UPC or EAN barcode.
              </p>

              <form className="score-form" onSubmit={handleBarcodeSubmit}>
                <label className="field-label" htmlFor="barcode-search">
                  Type a barcode
                </label>
                <div className="field-row">
                  <input
                    className="text-input"
                    id="barcode-search"
                    name="barcode-search"
                    type="text"
                    inputMode="numeric"
                    value={barcodeQuery}
                    onChange={(event) => setBarcodeQuery(sanitizeBarcodeInput(event.target.value))}
                    placeholder="Example: 12 or 13 digits from the package"
                  />
                  <button className="primary-button" type="submit" disabled={isBarcodeLoading}>
                    {isBarcodeLoading ? "Checking..." : "Lookup barcode"}
                  </button>
                </div>
              </form>

              <p className="helper-copy">
                Public and free. Upstream limits can be slow sometimes.
              </p>

              {barcodeError ? (
                <p className="status-banner status-banner-error lookup-status">{barcodeError}</p>
              ) : null}

              {isBarcodeLoading ? (
                <p className="status-banner lookup-status">Checking barcode...</p>
              ) : null}

              {barcodeResult ? (
                <section className="results-panel results-panel-compact">
                  <div className="score-header">
                    <div>
                      <p className="eyebrow">Barcode result</p>
                      <h2>{barcodeResult.product.productName}</h2>
                      <p className="result-summary">
                        Brand: <strong>{barcodeResult.product.brandText || "Unknown"}</strong>
                      </p>
                    </div>
                    <p className="score-chip barcode-value">{barcodeResult.barcode}</p>
                  </div>

                  <div className="compact-meta">
                    <p>Company: <strong>{barcodeResult.matchedCompany || "Not matched"}</strong></p>
                    <p>Match: <strong>{barcodeResult.matchedBy ? formatMatchType(barcodeResult.matchedBy) : "none"}</strong></p>
                    <p>Confidence: <strong>{formatConfidence(barcodeResult.confidence)}</strong></p>
                  </div>
                </section>
              ) : null}

              <ScoreDetails title="Barcode score" scoreResult={barcodeScoreResult} compact />
            </article>
          </section>

          <section className="content-grid">
            <article className="info-panel">
              <h2>What this MVP proves</h2>
              <ul>
                <li>Typing works now.</li>
                <li>Barcode lookup uses the same company resolver.</li>
                <li>Logo detection can plug in later.</li>
              </ul>
            </article>

            <article className="info-panel">
              <h2>Current catalog coverage</h2>
              <ul>
                <li>Local demo companies: {demoCompanies.join(", ")}.</li>
                <li>Best coverage: food, drinks, beauty, and household brands.</li>
                <li>Next gain: expand the brand catalog.</li>
              </ul>
            </article>
          </section>
        </>
      ) : (
        <ScoringMethodTab />
      )}
    </main>
  );
}

export default App;
