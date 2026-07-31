import { useDeferredValue, useEffect, useState } from "react";

import {
  demoCompanies,
  getBarcodeSustainabilityScore,
  getCompanySustainabilityScore,
  normalizeForMatch,
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

const SITE_NAME = "BrandLens";

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

const RECENT_SEARCHES_KEY = "brandlens-recent-searches";
const MAX_RECENT_SEARCHES = 6;

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

function getScoreStateLabel(scoreResult) {
  if (!scoreResult) {
    return "No result";
  }

  if (scoreResult.scoreStatus === "scored") {
    return "Verified company score";
  }

  if (scoreResult.scoreStatus === "contextual-estimate") {
    return "Estimated from limited evidence";
  }

  if (scoreResult.scoreStatus === "insufficient-company-specific-data") {
    return "Not enough evidence yet";
  }

  return "Needs review";
}

function isWeakMatch(scoreResult) {
  if (!scoreResult) {
    return false;
  }

  if (!scoreResult.resolvedCompany) {
    return true;
  }

  if (scoreResult.confidence < 0.58) {
    return true;
  }

  if (scoreResult.scoreStatus !== "scored" && (scoreResult.sources?.length ?? 0) < 2) {
    return true;
  }

  return false;
}

function getTrustSummary(scoreResult) {
  if (!scoreResult) {
    return "";
  }

  if (isWeakMatch(scoreResult)) {
    return "This match is weak, so BrandLens is holding it more cautiously.";
  }

  if (scoreResult.scoreStatus === "scored") {
    return "BrandLens found direct company-specific evidence for this result.";
  }

  if (scoreResult.scoreStatus === "contextual-estimate") {
    return "BrandLens found the company, but this number still leans on public background context.";
  }

  return "BrandLens matched the company, but there is not enough direct evidence for a strong score yet.";
}

function getResultHowToImprove(scoreResult) {
  if (!scoreResult) {
    return "Try another search.";
  }

  if (scoreResult.scoreStatus === "scored" && !isWeakMatch(scoreResult)) {
    return "Try barcode or photo lookup if you want another way to confirm the same company.";
  }

  return "Try a barcode, a clearer logo photo, or the exact company name to get a stronger match.";
}

function buildRecentSearchEntry(type, label, query) {
  return {
    id: `${type}:${query.toLowerCase()}`,
    type,
    label,
    query,
    savedAt: new Date().toISOString(),
  };
}

function updateRecentSearches(entries, nextEntry) {
  const deduped = entries.filter((entry) => entry.id !== nextEntry.id);
  return [nextEntry, ...deduped].slice(0, MAX_RECENT_SEARCHES);
}

function extractPhotoCandidates(text) {
  const uniqueLines = [...new Set(
    String(text || "")
      .split(/\n+/)
      .map((line) =>
        line
          .replace(/[^\p{L}\p{N}&'\- ]/gu, " ")
          .replace(/\s+/g, " ")
          .trim(),
      )
      .filter(Boolean),
  )];

  return uniqueLines
    .map((line) => {
      const normalized = normalizeForMatch(line);
      const compactLength = normalized.replace(/\s+/g, "").length;
      const wordCount = normalized.split(" ").filter(Boolean).length;
      const localMatch = resolveCompanyEntity(line);

      let score = compactLength;
      if (wordCount >= 1 && wordCount <= 4) {
        score += 10;
      }
      if (!/\d{4,}/.test(line)) {
        score += 4;
      }
      if (localMatch.resolvedCompany) {
        score += 25 + localMatch.confidence * 20;
      }

      return {
        line,
        normalized,
        localMatch,
        score,
      };
    })
    .filter((candidate) => candidate.normalized.length >= 3)
    .sort((left, right) => right.score - left.score)
    .slice(0, 5);
}

function LookupQuickLinks() {
  return (
    <nav className="mini-link-strip" aria-label="Page links">
      <a className="mini-link" href="#home">Home</a>
      <a className="mini-link" href="#search">Search</a>
      <a className="mini-link" href="#photo">Photo</a>
      <a className="mini-link" href="#recent">Recent</a>
      <a className="mini-link" href="#about">About</a>
    </nav>
  );
}

function ScoringMethodTab() {
  return (
    <>
      <section className="hero-card logic-hero">
        <p className="eyebrow">{SITE_NAME} Logic</p>
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

function ScoreDetails({ title, scoreResult, compact = false, lookupLabel = "typed search" }) {
  if (!scoreResult) {
    return null;
  }

  const banner = getScoreBanner(scoreResult);
  const weakMatch = isWeakMatch(scoreResult);
  const stateLabel = getScoreStateLabel(scoreResult);
  const scoreChipLabel =
    weakMatch && scoreResult.scoreStatus !== "scored"
      ? "Needs review"
      : typeof scoreResult.score === "number"
      ? formatScore(scoreResult.score)
      : "No score yet";

  return (
    <section className={`results-panel${compact ? " results-panel-compact" : ""}`}>
      <div className="score-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>{scoreResult.resolvedCompany || scoreResult.input}</h2>
          <p className="result-state">{stateLabel}</p>
          <p className="result-summary">
            Match: <strong>{formatMatchType(scoreResult.matchedBy)}</strong>
            {" · "}
            Confidence: <strong>{formatConfidence(scoreResult.confidence)}</strong>
            {" · "}
            Score: <strong>{formatConfidence(scoreResult.scoreConfidence)}</strong>
          </p>
        </div>
        <p className={`score-chip${weakMatch ? " score-chip-muted" : ""}`}>{scoreChipLabel}</p>
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

      {weakMatch ? (
        <p className="status-banner status-banner-warning">
          This result matched weakly, so BrandLens is being cautious instead of acting fully confident.
        </p>
      ) : null}

      <div className="trust-strip">
        <article className="trust-card">
          <h3>Why you got this result</h3>
          <p>{getTrustSummary(scoreResult)}</p>
        </article>
        <article className="trust-card">
          <h3>What BrandLens used</h3>
          <p>
            {lookupLabel} → {scoreResult.resolvedCompany || "no resolved company"} →{" "}
            {scoreResult.sources?.length ?? 0} public source
            {scoreResult.sources?.length === 1 ? "" : "s"}.
          </p>
        </article>
        <article className="trust-card">
          <h3>How to strengthen it</h3>
          <p>{getResultHowToImprove(scoreResult)}</p>
        </article>
      </div>

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
          <p>Status: <strong>{stateLabel}</strong></p>
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
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [isInstallAvailable, setIsInstallAvailable] = useState(false);
  const [companyQuery, setCompanyQuery] = useState("");
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [photoCandidates, setPhotoCandidates] = useState([]);
  const [photoExtractedText, setPhotoExtractedText] = useState("");
  const [companyResult, setCompanyResult] = useState(null);
  const [barcodeResult, setBarcodeResult] = useState(null);
  const [photoResult, setPhotoResult] = useState(null);
  const [companyError, setCompanyError] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [isBarcodeLoading, setIsBarcodeLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [companyPreview, setCompanyPreview] = useState(null);
  const [isCompanyPreviewLoading, setIsCompanyPreviewLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

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

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallPromptEvent(event);
      setIsInstallAvailable(true);
    }

    function handleAppInstalled() {
      setInstallPromptEvent(null);
      setIsInstallAvailable(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch {
      // Ignore storage failures in private browsing or restricted environments.
    }
  }, [recentSearches]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  async function handleInstallApp() {
    if (!installPromptEvent) {
      return;
    }

    await installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    setInstallPromptEvent(null);
    setIsInstallAvailable(false);
  }

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
      setRecentSearches((current) =>
        updateRecentSearches(current, buildRecentSearchEntry("typed", trimmedQuery, trimmedQuery)),
      );
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
      setRecentSearches((current) =>
        updateRecentSearches(
          current,
          buildRecentSearchEntry(
            "barcode",
            nextResult.product?.productName || normalizedBarcode,
            normalizedBarcode,
          ),
        ),
      );
    } catch (error) {
      setBarcodeResult(null);
      setBarcodeError(getFriendlyBarcodeError(error));
    } finally {
      setIsBarcodeLoading(false);
    }
  }

  function handlePhotoFileChange(event) {
    const nextFile = event.target.files?.[0] || null;

    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setPhotoFile(nextFile);
    setPhotoPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : "");
    setPhotoCandidates([]);
    setPhotoExtractedText("");
    setPhotoError("");
    setPhotoResult(null);
  }

  async function scorePhotoCandidate(candidateLine, candidates, extractedText) {
    const scoreResult = await getCompanySustainabilityScore(candidateLine);

    setPhotoResult({
      extractedText,
      selectedQuery: candidateLine,
      candidates,
      scoreResult,
    });
    setRecentSearches((current) =>
      updateRecentSearches(current, buildRecentSearchEntry("photo", candidateLine, candidateLine)),
    );
  }

  async function handlePhotoSubmit(event) {
    event.preventDefault();

    if (!photoFile) {
      setPhotoError("Choose or take a photo first.");
      setPhotoResult(null);
      return;
    }

    setIsPhotoLoading(true);
    setPhotoError("");

    let worker;

    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker("eng");

      const recognition = await worker.recognize(photoFile);
      const extractedText = recognition.data.text?.trim() || "";
      const candidates = extractPhotoCandidates(extractedText);
      const bestCandidate =
        candidates.find((candidate) => candidate.localMatch.resolvedCompany) || candidates[0] || null;

      setPhotoExtractedText(extractedText);
      setPhotoCandidates(candidates);

      if (!bestCandidate) {
        setPhotoResult(null);
        setPhotoError("We could not detect the brand from this picture. Please type the product, brand, or company name into the text box instead.");
        return;
      }

      await scorePhotoCandidate(bestCandidate.line, candidates, extractedText);
    } catch (error) {
      setPhotoResult(null);
      setPhotoError("We could not detect the brand from this picture. Please type the product, brand, or company name into the text box instead.");
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setIsPhotoLoading(false);
    }
  }

  const barcodeScoreResult = barcodeResult?.scoreResult || null;
  const photoScoreResult = photoResult?.scoreResult || null;

  function applyRecentSearch(search) {
    if (search.type === "barcode") {
      setBarcodeQuery(search.query);
      setActiveTab("lookup");
      window.location.hash = "search";
      return;
    }

    setCompanyQuery(search.query);
    setActiveTab("lookup");
    window.location.hash = search.type === "photo" ? "photo" : "search";
  }

  function clearRecentSearches() {
    setRecentSearches([]);
  }

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
          <section className="hero-card homepage-hero" id="home">
            <div className="hero-copy">
              <p className="eyebrow">{SITE_NAME}</p>
              <h1>Look past the label.</h1>
              <p className="lede">
                A faster way to check the company behind a product from typed names, barcodes, or logo photos.
              </p>
              <p className="hero-note">
                Free public-data lookup with clearer score states, source links, and phone-friendly search.
              </p>
              <LookupQuickLinks />
              <div className="hero-actions">
                {isInstallAvailable ? (
                  <button className="secondary-button" type="button" onClick={handleInstallApp}>
                    Install app
                  </button>
                ) : (
                  <p className="install-copy">Install on phone or desktop from your browser menu.</p>
                )}
              </div>
            </div>

            <aside className="hero-aside" aria-label="BrandLens summary">
              <div className="hero-glow" aria-hidden="true" />
              <div className="hero-stat-card">
                <p className="hero-stat-label">BrandLens</p>
                <p className="hero-stat-value">3 ways to search</p>
                <p className="hero-stat-note">Typed name, barcode, or photo-based text detection.</p>
              </div>
              <div className="hero-pill-row" aria-label="Highlights">
                <span className="hero-pill">Public sources only</span>
                <span className="hero-pill">Phone-ready</span>
                <span className="hero-pill">Source-backed</span>
              </div>
            </aside>
          </section>

          <section className="lookup-grid">
            <article className="info-panel lookup-card" id="search">
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

              <ScoreDetails title="Typed result" scoreResult={companyResult} compact lookupLabel="typed search" />
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

              <ScoreDetails title="Barcode score" scoreResult={barcodeScoreResult} compact lookupLabel="barcode lookup" />
            </article>

            <article className="info-panel lookup-card" id="photo">
              <h2>Photo lookup (beta)</h2>
              <p className="input-hint">
                Take or upload a logo or package photo. The app reads visible text, then runs the normal brand lookup.
              </p>

              <form className="score-form" onSubmit={handlePhotoSubmit}>
                <label className="field-label" htmlFor="photo-search">
                  Take or upload a brand photo
                </label>
                <input
                  className="text-input photo-picker"
                  id="photo-search"
                  name="photo-search"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoFileChange}
                />

                <div className="hero-actions">
                  <button className="primary-button" type="submit" disabled={isPhotoLoading}>
                    {isPhotoLoading ? "Reading photo..." : "Read photo"}
                  </button>
                </div>
              </form>

              <p className="helper-copy">
                Best for clear front-facing logos. This is OCR-based, so it works better when the brand name is visible.
              </p>

              <ul className="photo-tip-list">
                <li>Center the logo or brand name.</li>
                <li>Use bright light and avoid glare.</li>
                <li>If the first choice looks wrong, tap another detected candidate below.</li>
              </ul>

              {photoPreviewUrl ? (
                <div className="photo-preview-wrap">
                  <img className="photo-preview" src={photoPreviewUrl} alt="Selected brand preview" />
                </div>
              ) : null}

              {photoError ? (
                <p className="status-banner status-banner-error lookup-status">{photoError}</p>
              ) : null}

              {isPhotoLoading ? (
                <p className="status-banner lookup-status">Reading text from the image...</p>
              ) : null}

              {photoResult ? (
                <section className="results-panel results-panel-compact">
                  <div className="score-header">
                    <div>
                      <p className="eyebrow">Photo result</p>
                      <h2>{photoScoreResult?.resolvedCompany || photoResult.selectedQuery}</h2>
                      <p className="result-summary">
                        OCR picked: <strong>{photoResult.selectedQuery}</strong>
                      </p>
                    </div>
                    <p className="score-chip">OCR</p>
                  </div>

                  <div className="compact-meta">
                    <p>Top candidates: <strong>{photoResult.candidates.map((candidate) => candidate.line).slice(0, 3).join(", ")}</strong></p>
                  </div>

                  {photoResult.extractedText ? (
                    <p className="helper-copy">
                      Text found: {photoResult.extractedText.replace(/\s+/g, " ").slice(0, 140)}
                      {photoResult.extractedText.replace(/\s+/g, " ").length > 140 ? "..." : ""}
                    </p>
                  ) : null}
                </section>
              ) : null}

              {photoCandidates.length ? (
                <div className="candidate-picker">
                  <p className="field-label">Detected candidates</p>
                  <div className="sample-chip-row">
                    {photoCandidates.map((candidate) => (
                      <button
                        key={candidate.line}
                        className={`sample-chip${
                          photoResult?.selectedQuery === candidate.line ? " sample-chip-active" : ""
                        }`}
                        type="button"
                        onClick={() => {
                          setPhotoError("");
                          setIsPhotoLoading(true);
                          scorePhotoCandidate(candidate.line, photoCandidates, photoExtractedText)
                            .catch(() => {
                              setPhotoError("We could not score that detected text. Please type the name into the text box instead.");
                            })
                            .finally(() => {
                              setIsPhotoLoading(false);
                            });
                        }}
                      >
                        {candidate.line}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <ScoreDetails title="Photo score" scoreResult={photoScoreResult} compact lookupLabel="photo OCR lookup" />
            </article>
          </section>

          <section className="content-grid" id="recent">
            <article className="info-panel">
              <h2>What this MVP proves</h2>
              <ul>
                <li>Typing works now.</li>
                <li>Barcode lookup uses the same company resolver.</li>
                <li>Photo lookup now uses OCR for visible brand text.</li>
              </ul>
            </article>

            <article className="info-panel">
              <h2>Recent searches</h2>
              {recentSearches.length ? (
                <>
                  <div className="recent-search-list">
                    {recentSearches.map((search) => (
                      <button
                        key={search.id}
                        className="recent-search-item"
                        type="button"
                        onClick={() => applyRecentSearch(search)}
                      >
                        <span className="recent-search-type">{search.type}</span>
                        <strong>{search.label}</strong>
                        <span>{search.query}</span>
                      </button>
                    ))}
                  </div>
                  <div className="hero-actions">
                    <button className="secondary-button" type="button" onClick={clearRecentSearches}>
                      Clear recent
                    </button>
                  </div>
                </>
              ) : (
                <p className="helper-copy">Your recent searches will appear here on this device.</p>
              )}
            </article>
          </section>

          <section className="content-grid">
            <article className="info-panel">
              <h2>Current catalog coverage</h2>
              <ul>
                <li>Local demo companies: {demoCompanies.join(", ")}.</li>
                <li>Best coverage: food, drinks, beauty, and household brands.</li>
                <li>Next gain: expand the brand catalog.</li>
              </ul>
            </article>

            <article className="info-panel" id="about">
              <h2>About BrandLens</h2>
              <ul>
                <li>BrandLens helps users look up the company behind a product.</li>
                <li>It accepts typed names, barcodes, and photo-based text detection.</li>
                <li>It uses free public sources only.</li>
                <li>It is not an official ESG rating service or legal certification.</li>
                <li>Some results are verified, some are estimates, and some are too weak to trust yet.</li>
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
