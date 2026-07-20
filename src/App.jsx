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

function ScoreDetails({ title, scoreResult }) {
  if (!scoreResult) {
    return null;
  }

  const banner = getScoreBanner(scoreResult);

  return (
    <section className="results-panel">
      <div className="score-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>{scoreResult.resolvedCompany || scoreResult.input}</h2>
          <p className="result-summary">
            Match method: <strong>{formatMatchType(scoreResult.matchedBy)}</strong>
            {" · "}
            Match confidence: <strong>{formatConfidence(scoreResult.confidence)}</strong>
            {" · "}
            Score confidence: <strong>{formatConfidence(scoreResult.scoreConfidence)}</strong>
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
          <p className="metric-note">Unified product-environment signal plus light context.</p>
        </article>
        <article className="metric-card">
          <h3>Social</h3>
          <p>{formatScore(scoreResult.breakdown?.social)}</p>
          <p className="metric-note">Unified disclosure signal, evidence coverage, and SDG context.</p>
        </article>
        <article className="metric-card">
          <h3>Governance</h3>
          <p>{formatScore(scoreResult.breakdown?.governance)}</p>
          <p className="metric-note">Unified traceability, disclosure, and evidence coverage.</p>
        </article>
      </div>

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

      {scoreResult.alternatives?.length ? (
        <p className="helper-copy">Other possible matches: {scoreResult.alternatives.join(", ")}.</p>
      ) : null}
    </section>
  );
}

function App() {
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

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">MVP Flow</p>
        <h1>Type a name now. Add barcode lookup without paid APIs.</h1>
        <p className="lede">
          This version supports both direct typing and manual barcode entry. Both
          paths resolve a shopper-facing product or brand into a parent company
          before scoring it.
        </p>
        <p className="hero-note">
          Barcode and product lookups use public Open Food Facts family datasets
          plus public Wikidata company data, so the app stays on free, open data
          for this MVP.
        </p>
      </section>

      <section className="lookup-grid">
        <article className="info-panel lookup-card">
          <h2>Search by product or company</h2>
          <p className="input-hint">
            Start with what the shopper can type: a product, brand, or parent company.
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
              ? "Checking public company data for a better match..."
              : companyPreview
              ? companyPreview.resolvedCompany
                ? `Best match so far: ${companyPreview.resolvedCompany.canonicalName} via ${formatMatchType(
                    companyPreview.matchedBy,
                  )} (${formatConfidence(companyPreview.confidence)} confidence).`
                : "No confident company match yet. Try the brand or parent company name."
              : "This is the fastest path to a working demo before camera scanning."}
          </p>
        </article>

        <article className="info-panel lookup-card">
          <h2>Lookup by barcode</h2>
          <p className="input-hint">
            Enter UPC or EAN digits from the package. This MVP submits only when the user clicks the button, which stays within public API rate limits much better than auto-searching every keystroke.
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
            Barcode lookup is public and free, but the upstream dataset can temporarily rate-limit anonymous traffic during busy periods.
          </p>
        </article>
      </section>

      <section className="content-grid">
        <article className="info-panel">
          <h2>What this MVP proves</h2>
          <ul>
            <li>Typed brand and company input can already drive the app.</li>
            <li>Barcode lookup can feed the exact same parent-company resolver.</li>
            <li>Logo detection can plug into this same matching layer later.</li>
          </ul>
        </article>

        <article className="info-panel">
          <h2>Current catalog coverage</h2>
          <ul>
            <li>Local demo companies: {demoCompanies.join(", ")}.</li>
            <li>Best early coverage: food, beverages, beauty, and household brands.</li>
            <li>The next accuracy gain comes from expanding the brand-to-company catalog.</li>
          </ul>
        </article>
      </section>

      {companyError ? (
        <p className="status-banner status-banner-error">{companyError}</p>
      ) : null}

      {isCompanyLoading ? (
        <p className="status-banner">Pulling open data for {companyQuery.trim()}...</p>
      ) : null}

      <ScoreDetails title="Typed Lookup Result" scoreResult={companyResult} />

      {barcodeError ? (
        <p className="status-banner status-banner-error">{barcodeError}</p>
      ) : null}

      {isBarcodeLoading ? (
        <p className="status-banner">Looking up barcode {barcodeQuery}...</p>
      ) : null}

      {barcodeResult ? (
        <section className="results-panel">
          <div className="score-header">
            <div>
              <p className="eyebrow">Barcode Result</p>
              <h2>{barcodeResult.product.productName}</h2>
              <p className="result-summary">
                Barcode: <strong>{barcodeResult.barcode}</strong>
                {" · "}
                Source:{" "}
                <a href={barcodeResult.product.sourceUrl} target="_blank" rel="noreferrer">
                  {barcodeResult.product.sourceName}
                </a>
              </p>
            </div>
            <p className="score-chip barcode-value">{barcodeResult.barcode}</p>
          </div>

          <div className="content-grid source-panel">
            <article className="info-panel">
              <h2>Product details</h2>
              <ul>
                <li>Product name: {barcodeResult.product.productName}</li>
                <li>Brand text: {barcodeResult.product.brandText || "Not available"}</li>
                <li>Quantity: {barcodeResult.product.quantity || "Not available"}</li>
                <li>
                  Product page:{" "}
                  <a href={barcodeResult.product.productUrl} target="_blank" rel="noreferrer">
                    Open record
                  </a>
                </li>
              </ul>
            </article>

            <article className="info-panel">
              <h2>Company resolution</h2>
              {barcodeResult.matchedCompany ? (
                <ul>
                  <li>Resolved company: {barcodeResult.matchedCompany}</li>
                  <li>Matched from: {barcodeResult.matchedInput}</li>
                  <li>Matched via: {formatMatchType(barcodeResult.matchedBy)}</li>
                  <li>Confidence: {formatConfidence(barcodeResult.confidence)}</li>
                </ul>
              ) : (
                <>
                  <p className="helper-copy">
                    The product record was found, but the current local brand catalog could not confidently map it to a parent company.
                  </p>
                  {barcodeResult.alternatives?.length ? (
                    <p className="helper-copy">
                      Nearby local companies: {barcodeResult.alternatives.join(", ")}.
                    </p>
                  ) : null}
                </>
              )}
            </article>
          </div>
        </section>
      ) : null}

      <ScoreDetails
        title="Score From Barcode Match"
        scoreResult={barcodeResult?.scoreResult || null}
      />
    </main>
  );
}

export default App;
