const COMPANY_FIXTURES = [
  {
    canonicalName: "Unilever",
    countryCode: "GBR",
    sector: "consumer-goods",
    brands: ["dove", "hellmanns", "ben & jerrys", "knorr", "tresemme", "vaseline", "axe"],
    aliases: ["unilever", "unilever plc", "unilever uk"],
    sdgFocus: ["12", "13"],
  },
  {
    canonicalName: "Nestle",
    countryCode: "CHE",
    sector: "food",
    brands: ["nescafe", "kitkat", "purina", "nesquik", "maggi", "perrier", "smarties"],
    aliases: ["nestle", "nestle sa", "nestle s.a."],
    sdgFocus: ["2", "12", "13"],
  },
  {
    canonicalName: "Procter & Gamble",
    countryCode: "USA",
    sector: "consumer-goods",
    brands: ["gillette", "tide", "pantene", "always", "head & shoulders", "oral b", "downy"],
    aliases: ["p&g", "pg", "procter and gamble", "procter & gamble", "procter gamble"],
    sdgFocus: ["3", "12"],
  },
  {
    canonicalName: "L'Oreal",
    countryCode: "FRA",
    sector: "beauty",
    brands: ["garnier", "maybelline", "cerave", "lancome", "kiehls", "vichy", "redken"],
    aliases: ["loreal", "l'oreal", "l oreal", "loreal sa"],
    sdgFocus: ["5", "12", "13"],
  },
  {
    canonicalName: "PepsiCo",
    countryCode: "USA",
    sector: "food",
    brands: ["pepsi", "gatorade", "lays", "quaker", "doritos", "tropicana", "mountain dew"],
    aliases: ["pepsico", "pepsi co", "pepsi-cola"],
    sdgFocus: ["2", "12", "13"],
  },
  {
    canonicalName: "Coca-Cola",
    countryCode: "USA",
    sector: "beverages",
    brands: ["coca-cola", "sprite", "fanta", "minute maid", "powerade", "dasani", "smartwater"],
    aliases: ["coca cola", "coca-cola", "the coca cola company", "the coca-cola company"],
    sdgFocus: ["6", "12", "13"],
  },
  {
    canonicalName: "Mondelez International",
    countryCode: "USA",
    sector: "food",
    brands: ["oreo", "cadbury", "trident", "belvita", "toblerone", "ritz"],
    aliases: ["mondelez", "mondelez international", "mdlz"],
    sdgFocus: ["2", "8", "12"],
  },
  {
    canonicalName: "Danone",
    countryCode: "FRA",
    sector: "food",
    brands: ["evian", "activia", "aptamil", "alpro", "silk", "oikos"],
    aliases: ["danone", "groupe danone"],
    sdgFocus: ["2", "3", "12"],
  },
  {
    canonicalName: "Colgate-Palmolive",
    countryCode: "USA",
    sector: "consumer-goods",
    brands: ["colgate", "palmolive", "elmex", "hello", "ajax", "softsoap"],
    aliases: ["colgate palmolive", "colgate-palmolive", "colgate"],
    sdgFocus: ["3", "6", "12"],
  },
  {
    canonicalName: "Kimberly-Clark",
    countryCode: "USA",
    sector: "consumer-goods",
    brands: ["huggies", "kleenex", "cottonelle", "scott", "u by kotex"],
    aliases: ["kimberly clark", "kimberly-clark", "kmb"],
    sdgFocus: ["3", "6", "12"],
  },
  {
    canonicalName: "Henkel",
    countryCode: "DEU",
    sector: "consumer-goods",
    brands: ["persil", "all", "dial", "snuggle", "loctite", "got2b"],
    aliases: ["henkel", "henkel ag", "henkel ag & co"],
    sdgFocus: ["8", "12", "13"],
  },
  {
    canonicalName: "Mars",
    countryCode: "USA",
    sector: "food",
    brands: ["m&ms", "snickers", "twix", "pedigree", "whiskas", "ben's original"],
    aliases: ["mars", "mars incorporated", "mars inc"],
    sdgFocus: ["2", "12", "15"],
  },
  {
    canonicalName: "Kraft Heinz",
    countryCode: "USA",
    sector: "food",
    brands: ["heinz", "kraft", "philadelphia", "jell-o", "capri sun", "velveeta"],
    aliases: ["kraft heinz", "the kraft heinz company", "kraft-heinz"],
    sdgFocus: ["2", "12", "13"],
  },
];

const LEGAL_SUFFIXES = new Set([
  "inc",
  "incorporated",
  "corp",
  "corporation",
  "co",
  "company",
  "llc",
  "ltd",
  "limited",
  "plc",
  "sa",
  "ag",
  "nv",
  "group",
  "holdings",
]);

const WORLD_BANK_INDICATORS = {
  carbon: "EN.ATM.CO2E.PC",
  renewableEnergy: "EG.FEC.RNEW.ZS",
  protectedLand: "ER.LND.PTLD.ZS",
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function normalizeForMatch(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s&-]/g, " ")
    .replace(/&/g, " and ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !LEGAL_SUFFIXES.has(token))
    .join(" ");
}

function jaccardScore(a, b) {
  const left = new Set(a.split(" ").filter(Boolean));
  const right = new Set(b.split(" ").filter(Boolean));

  if (!left.size || !right.size) {
    return 0;
  }

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...left, ...right]).size;
  return intersection / union;
}

function scoreCandidate(normalizedInput, normalizedCandidate, candidateType) {
  if (!normalizedInput || !normalizedCandidate) {
    return 0;
  }

  if (normalizedInput === normalizedCandidate) {
    return candidateType === "brand-parent" ? 0.94 : 0.99;
  }

  if (normalizedCandidate.startsWith(normalizedInput) || normalizedInput.startsWith(normalizedCandidate)) {
    return candidateType === "brand-parent" ? 0.86 : 0.9;
  }

  const jaccard = jaccardScore(normalizedInput, normalizedCandidate);
  return candidateType === "brand-parent" ? jaccard * 0.92 : jaccard;
}

export function resolveCompanyEntity(input, catalog = COMPANY_FIXTURES) {
  const normalizedInput = normalizeForMatch(input);
  const rankedCandidates = [];

  for (const company of catalog) {
    const candidates = [
      { value: company.canonicalName, type: "canonical" },
      ...company.aliases.map((alias) => ({ value: alias, type: "alias" })),
      ...company.brands.map((brand) => ({ value: brand, type: "brand-parent" })),
    ];

    for (const candidate of candidates) {
      const normalizedCandidate = normalizeForMatch(candidate.value);
      const score = scoreCandidate(normalizedInput, normalizedCandidate, candidate.type);

      rankedCandidates.push({
        company,
        matchedBy: candidate.type,
        score,
        candidate: candidate.value,
      });
    }
  }

  rankedCandidates.sort((left, right) => right.score - left.score);
  const bestCandidate = rankedCandidates[0];
  const runnerUp = rankedCandidates.find(
    (candidate) => candidate.company.canonicalName !== bestCandidate?.company.canonicalName
  );

  if (!bestCandidate || bestCandidate.score < 0.45) {
    return {
      originalInput: input,
      normalizedInput,
      resolvedCompany: null,
      confidence: 0,
      matchedBy: "none",
      alternatives: catalog.map((company) => company.canonicalName).slice(0, 5),
    };
  }

  const bestMatch = bestCandidate.company;
  const ambiguityPenalty =
    runnerUp && bestCandidate.score - runnerUp.score < 0.12 ? 0.08 : 0;
  const confidence = Number(clamp(bestCandidate.score - ambiguityPenalty, 0, 1).toFixed(2));

  return {
    originalInput: input,
    normalizedInput,
    resolvedCompany: bestMatch,
    confidence,
    matchedBy: bestCandidate.matchedBy,
    alternatives: catalog
      .filter((company) => company.canonicalName !== bestMatch.canonicalName)
      .map((company) => company.canonicalName)
      .slice(0, 3),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "app-challenge/0.1.0 (demo@example.com)",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

async function fetchOpenFoodFactsSignals(company) {
  const searchTerms = encodeURIComponent([company.canonicalName, ...company.brands].join(" "));
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerms}&search_simple=1&action=process&json=1&page_size=24`;
  const data = await fetchJson(url);
  const products = Array.isArray(data.products) ? data.products : [];

  const scoredProducts = products.filter((product) => {
    const brandText = `${product.brands || ""} ${product.brands_tags?.join(" ") || ""}`.toLowerCase();
    return company.brands.some((brand) => brandText.includes(brand.toLowerCase())) ||
      brandText.includes(company.canonicalName.toLowerCase());
  });

  const greenScores = [];
  const packagingSignals = [];

  for (const product of scoredProducts) {
    const numericScore =
      product.ecoscore_score ??
      product.environmental_score_score ??
      null;

    if (typeof numericScore === "number") {
      greenScores.push(clamp(numericScore, 0, 100));
    }

    const packagingCount = Array.isArray(product.packaging_tags)
      ? product.packaging_tags.length
      : 0;
    packagingSignals.push(clamp(100 - packagingCount * 8, 20, 100));
  }

  return {
    source: "Open Food Facts",
    productCount: scoredProducts.length,
    environmentalScore: average(greenScores),
    packagingScore: average(packagingSignals),
    url: "https://openfoodfacts.github.io/openfoodfacts-server/api/",
  };
}

async function fetchOpenBeautyFactsSignals(company) {
  const searchTerms = encodeURIComponent([company.canonicalName, ...company.brands].join(" "));
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${searchTerms}&search_simple=1&action=process&json=1&page_size=24`;
  const data = await fetchJson(url);
  const products = Array.isArray(data.products) ? data.products : [];

  const matchedProducts = products.filter((product) => {
    const brandText = `${product.brands || ""} ${product.brands_tags?.join(" ") || ""}`.toLowerCase();
    return company.brands.some((brand) => brandText.includes(brand.toLowerCase())) ||
      brandText.includes(company.canonicalName.toLowerCase());
  });

  return {
    source: "Open Beauty Facts",
    productCount: matchedProducts.length,
    transparencyScore: matchedProducts.length
      ? clamp(
          average(
            matchedProducts.map((product) =>
              (product.ingredients_text ? 50 : 0) +
              (product.packaging_text ? 25 : 0) +
              (product.image_front_url ? 25 : 0)
            )
          ),
          0,
          100
        )
      : null,
    url: "https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/scanning-cosmetics-pet-food-and-other-products/",
  };
}

async function fetchWorldBankContext(company) {
  const countryCode = company.countryCode;

  const fetchIndicator = async (indicatorCode) => {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=5`;
    const payload = await fetchJson(url);
    const rows = Array.isArray(payload?.[1]) ? payload[1] : [];
    const latest = rows.find((row) => typeof row.value === "number");
    return latest?.value ?? null;
  };

  const [carbon, renewableEnergy, protectedLand] = await Promise.all([
    fetchIndicator(WORLD_BANK_INDICATORS.carbon),
    fetchIndicator(WORLD_BANK_INDICATORS.renewableEnergy),
    fetchIndicator(WORLD_BANK_INDICATORS.protectedLand),
  ]);

  const carbonScore = carbon == null ? null : clamp(100 - carbon * 6, 0, 100);
  const renewableScore = renewableEnergy == null ? null : clamp(renewableEnergy, 0, 100);
  const landScore = protectedLand == null ? null : clamp(protectedLand * 2.5, 0, 100);

  return {
    source: "World Bank Indicators API",
    countryCode,
    carbonScore,
    renewableScore,
    landScore,
    url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
  };
}

async function fetchSdgMetadata(company) {
  const goals = await fetchJson("https://unstats.un.org/SDGAPI/v1/sdg/Goal/List?includechildren=false");
  const focusedGoals = goals.filter((goal) => company.sdgFocus.includes(goal.code));

  return {
    source: "UN SDG API",
    goals: focusedGoals.map((goal) => ({
      code: goal.code,
      title: goal.title,
    })),
    sdgAlignmentScore: focusedGoals.length
      ? clamp(55 + focusedGoals.length * 12, 0, 100)
      : null,
    url: "https://unstats.un.org/SDGAPI/swagger/",
  };
}

function average(values) {
  const numericValues = values.filter((value) => typeof value === "number" && !Number.isNaN(value));
  if (!numericValues.length) {
    return null;
  }

  return Number((numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length).toFixed(1));
}

function weightedAverage(parts) {
  const available = parts.filter((part) => typeof part.value === "number");
  if (!available.length) {
    return null;
  }

  const totalWeight = available.reduce((sum, part) => sum + part.weight, 0);
  const totalValue = available.reduce((sum, part) => sum + part.value * part.weight, 0);
  return Number((totalValue / totalWeight).toFixed(1));
}

function getScoreConfidenceLabel(scoreConfidence) {
  if (scoreConfidence >= 0.8) {
    return "high";
  }
  if (scoreConfidence >= 0.5) {
    return "medium";
  }
  return "low";
}

/**
 * Compute a composite sustainability score for a typed company name while
 * preserving the original user input and using a normalized internal match key.
 */
export async function getCompanySustainabilityScore(companyName) {
  const resolution = resolveCompanyEntity(companyName);

  if (!resolution.resolvedCompany) {
    return {
      input: companyName,
      normalizedInput: resolution.normalizedInput,
      score: null,
      confidence: 0,
      matchedBy: "none",
      error: "Company could not be resolved confidently enough for scoring.",
      alternatives: resolution.alternatives,
      sources: [],
    };
  }

  const company = resolution.resolvedCompany;
  const settled = await Promise.allSettled([
    fetchOpenFoodFactsSignals(company),
    fetchOpenBeautyFactsSignals(company),
    fetchWorldBankContext(company),
    fetchSdgMetadata(company),
  ]);

  const [foodFacts, beautyFacts, worldBank, sdg] = settled.map((result) =>
    result.status === "fulfilled" ? result.value : null
  );

  const productEvidenceCount =
    (foodFacts?.productCount ?? 0) + (beautyFacts?.productCount ?? 0);
  const hasCompanySpecificEvidence =
    productEvidenceCount > 0 ||
    typeof foodFacts?.environmentalScore === "number" ||
    typeof foodFacts?.packagingScore === "number" ||
    typeof beautyFacts?.transparencyScore === "number";

  const contextEvidenceCount = [
    worldBank?.carbonScore,
    worldBank?.renewableScore,
    worldBank?.landScore,
    sdg?.sdgAlignmentScore,
  ].filter((value) => typeof value === "number").length;

  const environmentalScore = weightedAverage([
    { value: foodFacts?.environmentalScore, weight: 0.5 },
    { value: worldBank?.carbonScore, weight: 0.2 },
    { value: worldBank?.renewableScore, weight: 0.2 },
    { value: worldBank?.landScore, weight: 0.1 },
  ]);

  const socialScore = weightedAverage([
    { value: sdg?.sdgAlignmentScore, weight: 0.55 },
    { value: beautyFacts?.transparencyScore, weight: 0.45 },
  ]);

  const governanceScore = weightedAverage([
    { value: foodFacts?.packagingScore, weight: 0.4 },
    { value: beautyFacts?.transparencyScore, weight: 0.35 },
    { value: sdg?.sdgAlignmentScore, weight: 0.25 },
  ]);

  const score = weightedAverage([
    { value: environmentalScore, weight: 0.5 },
    { value: socialScore, weight: 0.2 },
    { value: governanceScore, weight: 0.3 },
  ]);

  const scoreConfidence = Number(
    clamp(
      (hasCompanySpecificEvidence ? 0.55 : 0) +
        clamp(productEvidenceCount / 12, 0, 0.25) +
        clamp(contextEvidenceCount / 4, 0, 0.2),
      0,
      1
    ).toFixed(2)
  );

  const finalScore = hasCompanySpecificEvidence ? score : null;
  const scoreStatus = hasCompanySpecificEvidence
    ? "scored"
    : "insufficient-company-specific-data";

  return {
    input: companyName,
    normalizedInput: resolution.normalizedInput,
    resolvedCompany: company.canonicalName,
    matchedBy: resolution.matchedBy,
    confidence: resolution.confidence,
    score: finalScore,
    scoreConfidence,
    scoreConfidenceLabel: getScoreConfidenceLabel(scoreConfidence),
    scoreStatus,
    scoringMethod:
      "Uniform rubric for every company: same weights, same source checks, and no final score unless company-specific evidence is present.",
    breakdown: {
      environmental: environmentalScore,
      social: socialScore,
      governance: governanceScore,
      productCoverage: foodFacts?.productCount ?? 0,
      beautyCoverage: beautyFacts?.productCount ?? 0,
      sdgGoals: sdg?.goals ?? [],
    },
    sourceAvailability: {
      openFoodFacts: {
        available: Boolean(foodFacts),
        productCount: foodFacts?.productCount ?? 0,
      },
      openBeautyFacts: {
        available: Boolean(beautyFacts),
        productCount: beautyFacts?.productCount ?? 0,
      },
      worldBank: {
        available: Boolean(worldBank),
      },
      sdg: {
        available: Boolean(sdg),
      },
    },
    sources: [foodFacts, beautyFacts, worldBank, sdg].filter(Boolean),
    notes: [
      "Original user input is preserved. Matching uses an internal normalized version only.",
      "Scores are composite estimates built from open data, not official ESG ratings.",
      "Every company now uses the same scoring rubric and the same evidence gate.",
      "If company-specific product evidence is missing, the function returns score: null instead of pretending a generic context score is a real company score.",
    ],
  };
}

export const demoCompanies = COMPANY_FIXTURES.map((company) => company.canonicalName);
