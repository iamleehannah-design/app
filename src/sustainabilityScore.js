const COMPANY_FIXTURES = [
  {
    canonicalName: "Unilever",
    countryCode: "GBR",
    sector: "consumer-goods",
    brands: [
      "dove",
      "hellmanns",
      "hellmann's",
      "ben & jerrys",
      "ben and jerrys",
      "knorr",
      "tresemme",
      "vaseline",
      "axe",
      "degree",
      "suave",
      "ponds",
      "pond's",
      "simple",
    ],
    aliases: ["unilever", "unilever plc", "unilever uk", "unilever group"],
    sdgFocus: ["12", "13"],
  },
  {
    canonicalName: "Nestle",
    countryCode: "CHE",
    sector: "food",
    brands: [
      "nescafe",
      "kitkat",
      "kit kat",
      "purina",
      "nesquik",
      "maggi",
      "perrier",
      "smarties",
      "gerber",
      "coffee mate",
      "stouffers",
      "stouffer's",
      "san pellegrino",
      "s pellegrino",
    ],
    aliases: ["nestle", "nestle sa", "nestle s.a.", "societe des produits nestle"],
    sdgFocus: ["2", "12", "13"],
  },
  {
    canonicalName: "Procter & Gamble",
    countryCode: "USA",
    sector: "consumer-goods",
    brands: [
      "gillette",
      "tide",
      "pantene",
      "always",
      "head & shoulders",
      "head and shoulders",
      "oral b",
      "oral-b",
      "downy",
      "crest",
      "charmin",
      "bounty",
      "pampers",
      "febreze",
      "dawn",
    ],
    aliases: ["p&g", "pg", "procter and gamble", "procter & gamble", "procter gamble"],
    sdgFocus: ["3", "12"],
  },
  {
    canonicalName: "L'Oreal",
    countryCode: "FRA",
    sector: "beauty",
    brands: [
      "garnier",
      "maybelline",
      "cerave",
      "lancome",
      "kiehls",
      "kiehl's",
      "vichy",
      "redken",
      "loreal paris",
      "l'oreal paris",
      "essie",
      "nyx",
      "la roche posay",
      "la roche-posay",
    ],
    aliases: ["loreal", "l'oreal", "l oreal", "loreal sa", "loreal groupe"],
    sdgFocus: ["5", "12", "13"],
  },
  {
    canonicalName: "PepsiCo",
    countryCode: "USA",
    sector: "food",
    brands: [
      "pepsi",
      "gatorade",
      "lays",
      "lay's",
      "quaker",
      "doritos",
      "tropicana",
      "mountain dew",
      "cheetos",
      "fritos",
      "rold gold",
      "aquafina",
      "sun chips",
      "sunchips",
    ],
    aliases: ["pepsico", "pepsi co", "pepsi-cola", "pepsi cola company"],
    sdgFocus: ["2", "12", "13"],
  },
  {
    canonicalName: "Coca-Cola",
    countryCode: "USA",
    sector: "beverages",
    brands: [
      "coca-cola",
      "coke",
      "sprite",
      "fanta",
      "minute maid",
      "powerade",
      "dasani",
      "smartwater",
      "fairlife",
      "simply",
      "vitaminwater",
      "topo chico",
      "honest tea",
    ],
    aliases: ["coca cola", "coca-cola", "the coca cola company", "the coca-cola company"],
    sdgFocus: ["6", "12", "13"],
  },
  {
    canonicalName: "Mondelez International",
    countryCode: "USA",
    sector: "food",
    brands: [
      "oreo",
      "cadbury",
      "trident",
      "belvita",
      "belvita biscuits",
      "toblerone",
      "ritz",
      "chips ahoy",
      "chips ahoy!",
      "sour patch kids",
      "milka",
      "halls",
      "wheat thins",
    ],
    aliases: ["mondelez", "mondelez international", "mdlz", "mondelez intl"],
    sdgFocus: ["2", "8", "12"],
  },
  {
    canonicalName: "Danone",
    countryCode: "FRA",
    sector: "food",
    brands: ["evian", "activia", "aptamil", "alpro", "silk", "oikos", "dannon", "danonino", "stok"],
    aliases: ["danone", "groupe danone"],
    sdgFocus: ["2", "3", "12"],
  },
  {
    canonicalName: "Colgate-Palmolive",
    countryCode: "USA",
    sector: "consumer-goods",
    brands: ["colgate", "palmolive", "elmex", "hello", "ajax", "softsoap", "tom's of maine", "toms of maine"],
    aliases: ["colgate palmolive", "colgate-palmolive", "colgate", "colgate palmolive company"],
    sdgFocus: ["3", "6", "12"],
  },
  {
    canonicalName: "Kimberly-Clark",
    countryCode: "USA",
    sector: "consumer-goods",
    brands: ["huggies", "kleenex", "cottonelle", "scott", "u by kotex", "depend", "poise"],
    aliases: ["kimberly clark", "kimberly-clark", "kmb"],
    sdgFocus: ["3", "6", "12"],
  },
  {
    canonicalName: "Henkel",
    countryCode: "DEU",
    sector: "consumer-goods",
    brands: ["persil", "all", "dial", "snuggle", "loctite", "got2b", "purex", "schwarzkopf"],
    aliases: ["henkel", "henkel ag", "henkel ag & co", "henkel ag and co"],
    sdgFocus: ["8", "12", "13"],
  },
  {
    canonicalName: "Mars",
    countryCode: "USA",
    sector: "food",
    brands: ["m&ms", "m and ms", "snickers", "twix", "pedigree", "whiskas", "ben's original", "kind", "skittles"],
    aliases: ["mars", "mars incorporated", "mars inc", "mars incorporated usa"],
    sdgFocus: ["2", "12", "15"],
  },
  {
    canonicalName: "Kraft Heinz",
    countryCode: "USA",
    sector: "food",
    brands: [
      "heinz",
      "kraft",
      "philadelphia",
      "jell-o",
      "capri sun",
      "velveeta",
      "oscar mayer",
      "planters",
      "kool-aid",
      "maxwell house",
    ],
    aliases: ["kraft heinz", "the kraft heinz company", "kraft-heinz"],
    sdgFocus: ["2", "12", "13"],
  },
  {
    canonicalName: "Ferrero",
    countryCode: "ITA",
    sector: "food",
    brands: ["nutella", "ferrero rocher", "kinder", "kinder bueno", "tic tac", "tic tac mints"],
    aliases: ["ferrero", "ferrero spa", "ferrero group"],
    sdgFocus: ["2", "12", "13"],
  },
  {
    canonicalName: "Reckitt",
    countryCode: "GBR",
    sector: "consumer-goods",
    brands: ["lysol", "finish", "air wick", "mucinex", "clearasil", "durex"],
    aliases: ["reckitt", "reckitt benckiser", "reckitt plc", "rb"],
    sdgFocus: ["3", "12", "13"],
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

const OPEN_FACTS_PRODUCT_FIELDS = [
  "code",
  "product_name",
  "product_name_en",
  "brands",
  "brands_tags",
  "brand_owner",
  "ecoscore_score",
  "environmental_score_score",
  "packaging_tags",
  "ingredients_text",
  "packaging_text",
  "categories",
  "categories_tags",
  "quantity",
  "image_front_url",
  "url",
];

const PUBLIC_FACTS_SOURCES = [
  {
    id: "openFoodFacts",
    name: "Open Food Facts",
    baseUrl: "https://world.openfoodfacts.org",
    docsUrl: "https://openfoodfacts.github.io/openfoodfacts-server/api/",
    supportsEnvironmentalScore: true,
    supportsIngredients: true,
  },
  {
    id: "openBeautyFacts",
    name: "Open Beauty Facts",
    baseUrl: "https://world.openbeautyfacts.org",
    docsUrl:
      "https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/scanning-cosmetics-pet-food-and-other-products/",
    supportsEnvironmentalScore: false,
    supportsIngredients: true,
  },
  {
    id: "openProductsFacts",
    name: "Open Products Facts",
    baseUrl: "https://world.openproductsfacts.org",
    docsUrl:
      "https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/scanning-cosmetics-pet-food-and-other-products/",
    supportsEnvironmentalScore: false,
    supportsIngredients: false,
  },
];

const UNIFIED_SCORING_RUBRIC = {
  version: "v2-unified-open-data-rubric",
  productSignals: {
    traceabilityWeights: {
      productName: 25,
      brand: 25,
      category: 20,
      image: 15,
      packaging: 15,
    },
    disclosureWeights: {
      ingredients: 30,
      packagingText: 25,
      packagingTags: 15,
      category: 10,
      brand: 10,
      image: 10,
    },
    environmentalWeights: {
      environmentalLabel: 70,
      packagingSignal: 30,
    },
  },
  companyScoreWeights: {
    environmental: 0.45,
    social: 0.25,
    governance: 0.3,
  },
  dimensionWeights: {
    environmental: {
      productEnvironmental: 0.75,
      carbon: 0.1,
      renewable: 0.1,
      land: 0.05,
    },
    social: {
      productDisclosure: 0.7,
      evidenceCoverage: 0.1,
      sdg: 0.2,
    },
    governance: {
      productTraceability: 0.45,
      productDisclosure: 0.3,
      evidenceCoverage: 0.15,
      sdg: 0.1,
    },
  },
};

const SOURCE_CONSENSUS_RULES = {
  outlierTolerance: 8,
  outlierRange: 28,
  minimumWeightFactor: 0.25,
  disagreementWarningSpread: 18,
  disagreementHighSpread: 30,
};

const WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php";
const WIKIDATA_IRRELEVANT_DESCRIPTION_TERMS = [
  "given name",
  "family name",
  "painting",
  "town",
  "city",
  "region",
  "goddess",
  "genus",
  "species",
  "street",
  "lake",
  "stadium",
  "ship",
  "audio track",
  "video game",
];
const WIKIDATA_RELEVANT_DESCRIPTION_TERMS = [
  "brand",
  "company",
  "corporation",
  "manufacturer",
  "products",
  "retailer",
  "food",
  "beverage",
  "cosmetic",
  "beauty",
  "personal care",
  "athletic equipment",
  "clothing",
  "consumer",
];

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

export function sanitizeBarcodeInput(input) {
  return String(input ?? "").replace(/\D/g, "");
}

function hasNumericValue(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

function scoreWeightedEvidence(entries) {
  const available = entries.filter((entry) => entry.available);
  if (!available.length) {
    return null;
  }

  const totalWeight = available.reduce((sum, entry) => sum + entry.weight, 0);
  if (!totalWeight) {
    return null;
  }

  const totalValue = available.reduce(
    (sum, entry) => sum + entry.weight * (entry.available ? 100 : 0),
    0,
  );

  return Number((totalValue / totalWeight).toFixed(1));
}

function uniqueValues(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function splitBrandText(brands) {
  if (!brands) {
    return [];
  }

  return brands
    .split(/[,/;|]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeBrandTag(tag) {
  return tag.replace(/^en:/, "").replace(/-/g, " ").trim();
}

function normalizeFactsTag(tag) {
  return tag.replace(/^[a-z]{2}:/i, "").replace(/-/g, " ").trim();
}

function getEvidenceTerms(company, evidenceHints = []) {
  return uniqueValues([
    company.canonicalName,
    ...company.aliases,
    ...company.brands,
    ...evidenceHints,
  ]);
}

function getPreferredFactsSearchTerms(company, evidenceHints = []) {
  return uniqueValues([
    ...evidenceHints,
    ...company.brands,
    company.canonicalName,
    ...company.aliases,
  ]).slice(0, 3);
}

function buildSearchText(product) {
  return normalizeForMatch(
    [
      product.product_name,
      product.product_name_en,
      product.brands,
      ...(Array.isArray(product.brands_tags) ? product.brands_tags.map(normalizeBrandTag) : []),
      product.brand_owner,
      product.categories,
      ...(Array.isArray(product.categories_tags)
        ? product.categories_tags.map(normalizeFactsTag)
        : []),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function productMatchesEvidence(product, evidenceTerms) {
  const searchText = buildSearchText(product);

  return evidenceTerms.some((term) => {
    const normalizedTerm = normalizeForMatch(term);
    return normalizedTerm.length >= 3 && searchText.includes(normalizedTerm);
  });
}

function getFactsSearchUrl(source, terms) {
  const searchTerms = encodeURIComponent(uniqueValues(terms).join(" "));
  return `${source.baseUrl}/cgi/search.pl?search_terms=${searchTerms}&search_simple=1&action=process&json=1&page_size=24`;
}

function getFactsProductUrl(source, barcode) {
  const fields = encodeURIComponent(OPEN_FACTS_PRODUCT_FIELDS.join(","));
  return `${source.baseUrl}/api/v2/product/${barcode}.json?fields=${fields}`;
}

function getProductCandidateTerms(product) {
  return uniqueValues([
    product.brand_owner || "",
    ...splitBrandText(product.brands),
    ...(Array.isArray(product.brands_tags) ? product.brands_tags.map(normalizeBrandTag) : []),
    product.product_name || "",
    product.product_name_en || "",
  ]);
}

function getProductTraceabilityScore(product) {
  const weights = UNIFIED_SCORING_RUBRIC.productSignals.traceabilityWeights;
  return scoreWeightedEvidence([
    {
      available: Boolean(product.product_name || product.product_name_en),
      weight: weights.productName,
    },
    {
      available: Boolean(product.brands || product.brand_owner),
      weight: weights.brand,
    },
    {
      available: Boolean(
        product.categories ||
          (Array.isArray(product.categories_tags) && product.categories_tags.length > 0),
      ),
      weight: weights.category,
    },
    {
      available: Boolean(product.image_front_url),
      weight: weights.image,
    },
    {
      available:
        Boolean(product.packaging_text) ||
        (Array.isArray(product.packaging_tags) && product.packaging_tags.length > 0),
      weight: weights.packaging,
    },
  ]);
}

function getProductDisclosureScore(product, source) {
  const weights = UNIFIED_SCORING_RUBRIC.productSignals.disclosureWeights;
  return scoreWeightedEvidence([
    {
      available: source.supportsIngredients ? Boolean(product.ingredients_text) : false,
      weight: source.supportsIngredients ? weights.ingredients : 0,
    },
    {
      available: Boolean(product.packaging_text),
      weight: weights.packagingText,
    },
    {
      available: Array.isArray(product.packaging_tags) && product.packaging_tags.length > 0,
      weight: weights.packagingTags,
    },
    {
      available: Boolean(
        product.categories ||
          (Array.isArray(product.categories_tags) && product.categories_tags.length > 0),
      ),
      weight: weights.category,
    },
    {
      available: Boolean(product.brands || product.brand_owner),
      weight: weights.brand,
    },
    {
      available: Boolean(product.image_front_url),
      weight: weights.image,
    },
  ]);
}

function getProductPackagingSignalScore(product) {
  if (Array.isArray(product.packaging_tags) && product.packaging_tags.length > 0) {
    return clamp(100 - product.packaging_tags.length * 8, 20, 100);
  }

  if (product.packaging_text) {
    return 65;
  }

  return null;
}

function getProductEnvironmentalSignalScore(product, source) {
  const weights = UNIFIED_SCORING_RUBRIC.productSignals.environmentalWeights;
  const environmentalLabelScore =
    source.supportsEnvironmentalScore && hasNumericValue(product.ecoscore_score)
      ? clamp(product.ecoscore_score, 0, 100)
      : source.supportsEnvironmentalScore && hasNumericValue(product.environmental_score_score)
        ? clamp(product.environmental_score_score, 0, 100)
        : null;

  return weightedAverage([
    { value: environmentalLabelScore, weight: weights.environmentalLabel / 100 },
    { value: getProductPackagingSignalScore(product), weight: weights.packagingSignal / 100 },
  ]);
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  if (!sorted.length) {
    return null;
  }

  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Number(((sorted[middle - 1] + sorted[middle]) / 2).toFixed(1))
    : sorted[middle];
}

function getFieldDisagreementStatus(spread) {
  if (spread >= SOURCE_CONSENSUS_RULES.disagreementHighSpread) {
    return "high";
  }

  if (spread >= SOURCE_CONSENSUS_RULES.disagreementWarningSpread) {
    return "moderate";
  }

  return "aligned";
}

function buildAgreementSummary(field, entries, consensusValue) {
  if (!entries.length) {
    return null;
  }

  const values = entries.map((entry) => entry.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const spread = Number((maximum - minimum).toFixed(1));

  return {
    field,
    sourceCount: entries.length,
    minimum: Number(minimum.toFixed(1)),
    maximum: Number(maximum.toFixed(1)),
    median: median(values),
    spread,
    consensus: consensusValue,
    status: entries.length < 2 ? "single-source" : getFieldDisagreementStatus(spread),
  };
}

function getConsensusWeight(baseWeight, distanceFromMedian) {
  if (distanceFromMedian <= SOURCE_CONSENSUS_RULES.outlierTolerance) {
    return baseWeight;
  }

  const overflow = distanceFromMedian - SOURCE_CONSENSUS_RULES.outlierTolerance;
  const penalty = clamp(
    1 - overflow / SOURCE_CONSENSUS_RULES.outlierRange,
    SOURCE_CONSENSUS_RULES.minimumWeightFactor,
    1,
  );

  return Number((baseWeight * penalty).toFixed(3));
}

function reconcileFieldConsensus(sources, field) {
  const entries = sources
    .map((source) => ({
      source: source.source,
      value: source[field],
      weight: source.productCount || 1,
    }))
    .filter((entry) => hasNumericValue(entry.value));

  if (!entries.length) {
    return {
      value: null,
      agreement: null,
    };
  }

  const medianValue = median(entries.map((entry) => entry.value));
  const adjustedEntries = entries.map((entry) => ({
    ...entry,
    adjustedWeight: getConsensusWeight(entry.weight, Math.abs(entry.value - medianValue)),
  }));

  const value = Number(
    (
      adjustedEntries.reduce((sum, entry) => sum + entry.value * entry.adjustedWeight, 0) /
      adjustedEntries.reduce((sum, entry) => sum + entry.adjustedWeight, 0)
    ).toFixed(1),
  );

  return {
    value,
    agreement: buildAgreementSummary(field, adjustedEntries, value),
  };
}

function buildDirectProductEvidence(product, barcode, source) {
  return {
    source: `${source.name} Direct Barcode Record`,
    productCount: 1,
    environmentalScore: getProductEnvironmentalSignalScore(product, source),
    packagingScore: getProductPackagingSignalScore(product),
    transparencyScore: getProductDisclosureScore(product, source),
    traceabilityScore: getProductTraceabilityScore(product),
    url: product.url || `${source.baseUrl}/product/${barcode}`,
  };
}

function combineEvidenceSources(sources, fields, label = "Combined product evidence") {
  const availableSources = sources.filter(Boolean);
  if (!availableSources.length) {
    return null;
  }

  const productCount = availableSources.reduce(
    (sum, source) => sum + (source.productCount ?? 0),
    0,
  );
  const merged = {
    source: label,
    productCount,
    url: availableSources[0]?.url,
    agreement: {},
  };

  for (const field of fields) {
    const consensus = reconcileFieldConsensus(availableSources, field);
    merged[field] = consensus.value;
    if (consensus.agreement) {
      merged.agreement[field] = consensus.agreement;
    }
  }

  return merged;
}

async function fetchJson(url) {
  const headers = {
    Accept: "application/json",
  };

  // Browsers cannot set User-Agent manually, so only attach it in non-browser runtimes.
  if (typeof window === "undefined") {
    headers["User-Agent"] = "app-challenge/0.1.0 (demo@example.com)";
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

async function fetchFactsSignals(source, searchTerms, matchTerms) {
  const matchedProductsByKey = new Map();

  for (const searchTerm of uniqueValues(searchTerms).slice(0, 3)) {
    const data = await fetchJson(getFactsSearchUrl(source, [searchTerm]));
    const products = Array.isArray(data.products) ? data.products : [];

    for (const product of products) {
      if (!productMatchesEvidence(product, matchTerms)) {
        continue;
      }

      const productKey =
        product.code || `${product.product_name || product.product_name_en || "unknown"}:${product.brands || ""}`;
      matchedProductsByKey.set(productKey, product);
    }

    if (matchedProductsByKey.size >= 8) {
      break;
    }
  }

  const matchedProducts = [...matchedProductsByKey.values()];

  const environmentalScores = [];
  const packagingSignals = [];
  const transparencySignals = [];
  const traceabilitySignals = [];

  for (const product of matchedProducts) {
    const environmentalSignal = getProductEnvironmentalSignalScore(product, source);
    if (hasNumericValue(environmentalSignal)) {
      environmentalScores.push(environmentalSignal);
    }

    const packagingSignal = getProductPackagingSignalScore(product);
    if (hasNumericValue(packagingSignal)) {
      packagingSignals.push(packagingSignal);
    }

    const disclosureSignal = getProductDisclosureScore(product, source);
    if (hasNumericValue(disclosureSignal)) {
      transparencySignals.push(disclosureSignal);
    }

    const traceabilitySignal = getProductTraceabilityScore(product);
    if (hasNumericValue(traceabilitySignal)) {
      traceabilitySignals.push(traceabilitySignal);
    }
  }

  return {
    source: source.name,
    productCount: matchedProducts.length,
    environmentalScore: average(environmentalScores),
    packagingScore: average(packagingSignals),
    transparencyScore: average(transparencySignals),
    traceabilityScore: average(traceabilitySignals),
    candidateTerms: uniqueValues(
      matchedProducts.flatMap((product) => getProductCandidateTerms(product)),
    ),
    url: source.docsUrl,
  };
}

async function lookupProductByBarcodeFromSource(source, barcode) {
  const payload = await fetchJson(getFactsProductUrl(source, barcode));

  if (payload.status !== 1 || !payload.product) {
    return null;
  }

  const product = payload.product;
  const brandOwnerCandidates = uniqueValues([product.brand_owner || ""]);
  const brandCandidates = uniqueValues([
    ...brandOwnerCandidates,
    ...splitBrandText(product.brands),
    ...(Array.isArray(product.brands_tags) ? product.brands_tags.map(normalizeBrandTag) : []),
  ]);
  const productName = product.product_name || product.product_name_en || "Unknown product";

  return {
    barcode,
    productName,
    brandText: product.brands || brandCandidates.join(", "),
    brandOwner: product.brand_owner || "",
    brandCandidates,
    directEvidence: buildDirectProductEvidence(product, barcode, source),
    quantity: product.quantity || "",
    imageUrl: product.image_front_url || "",
    productUrl: product.url || `${source.baseUrl}/product/${barcode}`,
    sourceName: source.name,
    sourceUrl: source.docsUrl,
    lookupTerms: uniqueValues([...brandOwnerCandidates, ...brandCandidates, productName]),
  };
}

export async function lookupProductByBarcode(rawBarcode) {
  const barcode = sanitizeBarcodeInput(rawBarcode);

  if (barcode.length < 8) {
    const error = new Error("Enter at least 8 digits from a UPC or EAN barcode.");
    error.code = "invalid_barcode";
    throw error;
  }

  for (const source of PUBLIC_FACTS_SOURCES) {
    try {
      const product = await lookupProductByBarcodeFromSource(source, barcode);
      if (product) {
        return product;
      }
    } catch (error) {
      if (!String(error?.message || "").includes("404")) {
        throw error;
      }
    }
  }

  const error = new Error(
    "No public Open Food Facts, Open Beauty Facts, or Open Products Facts record was found for that barcode.",
  );
  error.code = "barcode_not_found";
  throw error;
}

async function resolveCompanyFromBarcodeProduct(product) {
  const candidateTerms = [
    ...(product.brandOwner ? [{ value: product.brandOwner, source: "brand-owner", bonus: 0.18 }] : []),
    ...product.brandCandidates.map((value) => ({ value, source: "brand", bonus: 0.12 })),
    { value: product.productName, source: "product-name", bonus: 0.04 },
  ];

  const ranked = candidateTerms
    .map((candidate) => {
      const resolution = resolveCompanyEntity(candidate.value);
      if (!resolution.resolvedCompany) {
        return null;
      }

      return {
        ...candidate,
        resolution,
        weightedConfidence: clamp(resolution.confidence + candidate.bonus, 0, 1),
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.weightedConfidence - left.weightedConfidence);

  if (ranked[0]) {
    return ranked[0];
  }

  for (const candidate of candidateTerms.slice(0, 3)) {
    const resolution = await resolveCompanyProfile(candidate.value);
    if (!resolution?.resolvedCompany) {
      continue;
    }

    return {
      ...candidate,
      resolution,
      weightedConfidence: clamp(resolution.confidence + candidate.bonus, 0, 1),
    };
  }

  return null;
}

export async function getBarcodeSustainabilityScore(rawBarcode) {
  const product = await lookupProductByBarcode(rawBarcode);
  const bestMatch = await resolveCompanyFromBarcodeProduct(product);

  if (!bestMatch) {
    return {
      barcode: product.barcode,
      product,
      matchedCompany: null,
      matchedInput: null,
      matchedBy: "none",
      confidence: 0,
      scoreResult: null,
      alternatives: COMPANY_FIXTURES.map((company) => company.canonicalName).slice(0, 5),
    };
  }

  const scoreResult = await getCompanySustainabilityScore(
    bestMatch.resolution.resolvedCompany.canonicalName,
    {
      evidenceHints: [
        bestMatch.value,
        product.brandOwner,
        ...product.brandCandidates,
        product.productName,
      ],
      directProductEvidence: product.directEvidence,
    },
  );

  return {
    barcode: product.barcode,
    product,
    matchedCompany: bestMatch.resolution.resolvedCompany.canonicalName,
    matchedInput: bestMatch.value,
    matchedBy: bestMatch.resolution.matchedBy,
    confidence: bestMatch.resolution.confidence,
    alternatives: bestMatch.resolution.alternatives,
    scoreResult,
  };
}

async function fetchWikidataAction(params) {
  const query = new URLSearchParams({
    format: "json",
    language: "en",
    languages: "en",
    uselang: "en",
    origin: "*",
    ...params,
  });

  return fetchJson(`${WIKIDATA_API_URL}?${query.toString()}`);
}

function extractWikidataEntityIds(entity, property) {
  const claims = entity?.claims?.[property] ?? [];
  return claims
    .map(
      (claim) =>
        claim?.mainsnak?.datavalue?.value?.id ??
        claim?.mainsnak?.datavalue?.value ??
        null,
    )
    .filter((value) => typeof value === "string");
}

function getEntityLabel(entity) {
  return entity?.labels?.en?.value || "";
}

function getEntityAliases(entity) {
  return uniqueValues((entity?.aliases?.en ?? []).map((alias) => alias.value || ""));
}

function inferSectorFromText(text) {
  const normalized = normalizeForMatch(text || "");

  if (/(food|beverage|snack|restaurant|juice|drink|coffee|grocery|pet food)/.test(normalized)) {
    return "food";
  }

  if (/(beauty|cosmetic|skin care|skincare|personal care|hair care|haircare|fragrance)/.test(normalized)) {
    return "beauty";
  }

  if (/(apparel|clothing|footwear|athletic|sport|fashion)/.test(normalized)) {
    return "consumer-goods";
  }

  return "consumer-goods";
}

function inferSdgFocusFromSector(sector) {
  if (sector === "food") {
    return ["2", "12", "13"];
  }

  if (sector === "beauty") {
    return ["3", "12"];
  }

  return ["8", "12", "13"];
}

function scoreWikidataSearchResult(result, normalizedInput) {
  const normalizedLabel = normalizeForMatch(result.label || "");
  const normalizedDescription = normalizeForMatch(result.description || "");
  let score = 0;

  if (normalizedLabel === normalizedInput) {
    score += 0.75;
  } else if (
    normalizedLabel.startsWith(normalizedInput) ||
    normalizedInput.startsWith(normalizedLabel)
  ) {
    score += 0.5;
  } else {
    score += jaccardScore(normalizedInput, normalizedLabel) * 0.45;
  }

  if (
    WIKIDATA_RELEVANT_DESCRIPTION_TERMS.some((term) =>
      normalizedDescription.includes(normalizeForMatch(term)),
    )
  ) {
    score += 0.3;
  }

  if (
    WIKIDATA_IRRELEVANT_DESCRIPTION_TERMS.some((term) =>
      normalizedDescription.includes(normalizeForMatch(term)),
    )
  ) {
    score -= 0.5;
  }

  return Number(clamp(score, 0, 1.4).toFixed(2));
}

function buildResolvedProfileResult(input, company, matchedBy, confidence, sourceEntry) {
  return {
    originalInput: input,
    normalizedInput: normalizeForMatch(input),
    resolvedCompany: company,
    confidence,
    matchedBy,
    alternatives: [],
    publicSource: sourceEntry || null,
  };
}

async function resolveCompanyProfileViaWikidata(input) {
  const normalizedInput = normalizeForMatch(input);
  if (!normalizedInput) {
    return null;
  }

  const searchPayload = await fetchWikidataAction({
    action: "wbsearchentities",
    search: input,
    limit: "8",
  });

  const rankedSearchResults = (searchPayload.search ?? [])
    .map((result) => ({
      ...result,
      score: scoreWikidataSearchResult(result, normalizedInput),
    }))
    .filter((result) => result.score >= 0.35)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  if (!rankedSearchResults.length) {
    return null;
  }

  const detailPayload = await fetchWikidataAction({
    action: "wbgetentities",
    ids: rankedSearchResults.map((result) => result.id).join("|"),
    props: "labels|aliases|descriptions|claims",
  });

  const detailedCandidates = rankedSearchResults
    .map((result) => ({
      result,
      entity: detailPayload.entities?.[result.id] ?? null,
    }))
    .filter((candidate) => candidate.entity);

  const bestCandidate = detailedCandidates[0];
  if (!bestCandidate) {
    return null;
  }

  const brandOwnerId = extractWikidataEntityIds(bestCandidate.entity, "P127")[0] ?? null;
  const companyEntityId = brandOwnerId || bestCandidate.result.id;

  const relatedIds = uniqueValues([
    companyEntityId,
    ...extractWikidataEntityIds(bestCandidate.entity, "P17"),
    ...extractWikidataEntityIds(bestCandidate.entity, "P159"),
  ]);

  const relatedPayload = relatedIds.length
    ? await fetchWikidataAction({
        action: "wbgetentities",
        ids: relatedIds.join("|"),
        props: "labels|aliases|descriptions|claims",
      })
    : { entities: {} };

  const companyEntity =
    relatedPayload.entities?.[companyEntityId] ??
    detailPayload.entities?.[companyEntityId] ??
    bestCandidate.entity;

  if (!companyEntity) {
    return null;
  }

  const headquartersId = extractWikidataEntityIds(companyEntity, "P159")[0] ?? null;
  const countryId =
    extractWikidataEntityIds(companyEntity, "P17")[0] ??
    extractWikidataEntityIds(relatedPayload.entities?.[headquartersId], "P17")[0] ??
    extractWikidataEntityIds(bestCandidate.entity, "P17")[0] ??
    null;

  let countryCode = null;
  if (countryId) {
    const countryPayload = await fetchWikidataAction({
      action: "wbgetentities",
      ids: countryId,
      props: "labels|claims",
    });
    const countryEntity = countryPayload.entities?.[countryId];
    countryCode =
      extractWikidataEntityIds(countryEntity, "P298")[0] ??
      countryEntity?.claims?.P298?.[0]?.mainsnak?.datavalue?.value ??
      null;
  }

  const description = [
    bestCandidate.result.description || "",
    companyEntity?.descriptions?.en?.value || "",
  ]
    .filter(Boolean)
    .join(" ");
  const sector = inferSectorFromText(description);
  const canonicalName = getEntityLabel(companyEntity) || bestCandidate.result.label || input;

  return buildResolvedProfileResult(
    input,
    {
      canonicalName,
      countryCode,
      sector,
      brands: uniqueValues([input, bestCandidate.result.label || "", getEntityLabel(bestCandidate.entity)]),
      aliases: uniqueValues([canonicalName, ...getEntityAliases(companyEntity)]),
      sdgFocus: inferSdgFocusFromSector(sector),
    },
    brandOwnerId ? "wikidata-owner" : "wikidata-company",
    Number(clamp(bestCandidate.result.score / 1.1, 0.45, 0.92).toFixed(2)),
    {
      source: "Wikidata",
      url: "https://www.wikidata.org/wiki/Wikidata:Data_access",
    },
  );
}

export async function resolveCompanyProfile(input) {
  const catalogResolution = resolveCompanyEntity(input);

  if (catalogResolution.resolvedCompany) {
    return {
      ...catalogResolution,
      publicSource: null,
    };
  }

  try {
    return (await resolveCompanyProfileViaWikidata(input)) ?? catalogResolution;
  } catch (error) {
    return catalogResolution;
  }
}

async function fetchOpenFoodFactsSignals(company, evidenceHints = []) {
  const evidenceTerms = getEvidenceTerms(company, evidenceHints);
  return fetchFactsSignals(
    PUBLIC_FACTS_SOURCES[0],
    getPreferredFactsSearchTerms(company, evidenceHints),
    evidenceTerms,
  );
}

async function fetchOpenBeautyFactsSignals(company, evidenceHints = []) {
  const evidenceTerms = getEvidenceTerms(company, evidenceHints);
  return fetchFactsSignals(
    PUBLIC_FACTS_SOURCES[1],
    getPreferredFactsSearchTerms(company, evidenceHints),
    evidenceTerms,
  );
}

async function fetchOpenProductsFactsSignals(company, evidenceHints = []) {
  const evidenceTerms = getEvidenceTerms(company, evidenceHints);
  return fetchFactsSignals(
    PUBLIC_FACTS_SOURCES[2],
    getPreferredFactsSearchTerms(company, evidenceHints),
    evidenceTerms,
  );
}

async function fetchWorldBankContext(company) {
  const countryCode = company.countryCode;
  if (!countryCode) {
    return null;
  }

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
  if (!Array.isArray(company.sdgFocus) || !company.sdgFocus.length) {
    return null;
  }

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

function getEvidenceCoverageScore(productEvidenceCount) {
  if (!productEvidenceCount) {
    return null;
  }

  return clamp(30 + productEvidenceCount * 6, 30, 100);
}

function summarizeSourceAgreement(agreementMap = {}) {
  const fields = Object.values(agreementMap).filter(Boolean);

  if (!fields.length) {
    return {
      detected: false,
      status: "not-applicable",
      penalty: 0,
      signals: [],
      message: "Not enough overlapping source scores to compare agreement.",
    };
  }

  const comparedFields = fields.filter((field) => field.sourceCount >= 2);
  if (!comparedFields.length) {
    return {
      detected: false,
      status: "single-source",
      penalty: 0,
      signals: [],
      message: "Only one scoring source contributed to each comparable signal.",
    };
  }

  const conflictingFields = comparedFields.filter((field) => field.status !== "aligned");
  const highConflict = conflictingFields.filter((field) => field.status === "high");
  const status = highConflict.length
    ? "high"
    : conflictingFields.length
      ? "moderate"
      : "aligned";

  return {
    detected: status !== "aligned",
    status,
    penalty: status === "high" ? 0.18 : status === "moderate" ? 0.08 : 0,
    signals: comparedFields.map((field) => ({
      field: field.field,
      spread: field.spread,
      status: field.status,
    })),
    message:
      status === "high"
        ? "Some sources disagree materially, so the app downweights outlier scores and lowers confidence."
        : status === "moderate"
          ? "Some sources disagree moderately, so the app blends them with a lighter confidence penalty."
          : "Comparable source scores are reasonably aligned.",
  };
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
export async function getCompanySustainabilityScore(companyName, options = {}) {
  const resolution = await resolveCompanyProfile(companyName);

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
  const evidenceHints = uniqueValues([companyName, ...(options.evidenceHints || [])]);
  const directProductEvidence = options.directProductEvidence || null;
  const settled = await Promise.allSettled([
    fetchOpenFoodFactsSignals(company, evidenceHints),
    fetchOpenBeautyFactsSignals(company, evidenceHints),
    fetchOpenProductsFactsSignals(company, evidenceHints),
    fetchWorldBankContext(company),
    fetchSdgMetadata(company),
  ]);

  const [foodFacts, beautyFacts, productsFacts, benchmarkContext, sdgContext] = settled.map(
    (result) => (result.status === "fulfilled" ? result.value : null),
  );

  const mergedProductEvidence = combineEvidenceSources(
    [foodFacts, beautyFacts, productsFacts, directProductEvidence],
    [
      "environmentalScore",
      "packagingScore",
      "transparencyScore",
      "traceabilityScore",
    ],
    "Unified product evidence",
  );

  const productEvidenceCount =
    (foodFacts?.productCount ?? 0) +
    (beautyFacts?.productCount ?? 0) +
    (productsFacts?.productCount ?? 0) +
    (directProductEvidence ? 1 : 0);
  const evidenceCoverageScore = getEvidenceCoverageScore(productEvidenceCount);
  const sourceAgreement = summarizeSourceAgreement(mergedProductEvidence?.agreement);
  const hasCompanySpecificEvidence =
    productEvidenceCount > 0 ||
    hasNumericValue(mergedProductEvidence?.environmentalScore) ||
    hasNumericValue(mergedProductEvidence?.packagingScore) ||
    hasNumericValue(mergedProductEvidence?.transparencyScore) ||
    hasNumericValue(mergedProductEvidence?.traceabilityScore);

  const contextEvidenceCount = [
    benchmarkContext?.carbonScore,
    benchmarkContext?.renewableScore,
    benchmarkContext?.landScore,
    sdgContext?.sdgAlignmentScore,
  ].filter(hasNumericValue).length;

  const environmentalWeights = UNIFIED_SCORING_RUBRIC.dimensionWeights.environmental;
  const environmentalScore = weightedAverage([
    {
      value: mergedProductEvidence?.environmentalScore,
      weight: environmentalWeights.productEnvironmental,
    },
    { value: benchmarkContext?.carbonScore, weight: environmentalWeights.carbon },
    { value: benchmarkContext?.renewableScore, weight: environmentalWeights.renewable },
    { value: benchmarkContext?.landScore, weight: environmentalWeights.land },
  ]);

  const socialWeights = UNIFIED_SCORING_RUBRIC.dimensionWeights.social;
  const socialScore = weightedAverage([
    {
      value: mergedProductEvidence?.transparencyScore,
      weight: socialWeights.productDisclosure,
    },
    { value: evidenceCoverageScore, weight: socialWeights.evidenceCoverage },
    { value: sdgContext?.sdgAlignmentScore, weight: socialWeights.sdg },
  ]);

  const governanceWeights = UNIFIED_SCORING_RUBRIC.dimensionWeights.governance;
  const governanceScore = weightedAverage([
    {
      value: mergedProductEvidence?.traceabilityScore,
      weight: governanceWeights.productTraceability,
    },
    {
      value: mergedProductEvidence?.transparencyScore,
      weight: governanceWeights.productDisclosure,
    },
    { value: evidenceCoverageScore, weight: governanceWeights.evidenceCoverage },
    { value: sdgContext?.sdgAlignmentScore, weight: governanceWeights.sdg },
  ]);

  const companyWeights = UNIFIED_SCORING_RUBRIC.companyScoreWeights;
  const score = weightedAverage([
    { value: environmentalScore, weight: companyWeights.environmental },
    { value: socialScore, weight: companyWeights.social },
    { value: governanceScore, weight: companyWeights.governance },
  ]);

  const scoreConfidence = Number(
    clamp(
      (hasCompanySpecificEvidence ? 0.55 : 0) +
        clamp(productEvidenceCount / 12, 0, 0.25) +
        clamp(contextEvidenceCount / 4, 0, 0.2) -
        sourceAgreement.penalty,
      0,
      1
    ).toFixed(2)
  );

  const hasContextualEstimate = typeof score === "number";
  const finalScore = hasCompanySpecificEvidence ? score : hasContextualEstimate ? score : null;
  const scoreStatus = hasCompanySpecificEvidence
    ? "scored"
    : hasContextualEstimate
      ? "contextual-estimate"
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
      "One internal rubric is used for every company. External APIs only supply raw evidence signals, which are normalized into the same 0-100 product-environmental, disclosure, traceability, and context inputs before the final score is computed. When sources disagree, the app uses a median-centered consensus blend that downweights outliers instead of averaging them blindly.",
    rubricVersion: UNIFIED_SCORING_RUBRIC.version,
    breakdown: {
      environmental: environmentalScore,
      social: socialScore,
      governance: governanceScore,
      productCoverage: mergedProductEvidence?.productCount ?? 0,
      beautyCoverage: beautyFacts?.productCount ?? 0,
      productsCoverage: productsFacts?.productCount ?? 0,
      evidenceCoverage: evidenceCoverageScore,
      disclosure: mergedProductEvidence?.transparencyScore,
      traceability: mergedProductEvidence?.traceabilityScore,
      productEnvironmental: mergedProductEvidence?.environmentalScore,
      packaging: mergedProductEvidence?.packagingScore,
      sdgGoals: sdgContext?.goals ?? [],
    },
    sourceAgreement,
    sourceAvailability: {
      openFoodFacts: {
        available: Boolean(foodFacts),
        productCount: foodFacts?.productCount ?? 0,
      },
      openBeautyFacts: {
        available: Boolean(beautyFacts),
        productCount: beautyFacts?.productCount ?? 0,
      },
      openProductsFacts: {
        available: Boolean(productsFacts),
        productCount: productsFacts?.productCount ?? 0,
      },
      directBarcodeProduct: {
        available: Boolean(directProductEvidence),
      },
      worldBank: {
        available: Boolean(benchmarkContext),
      },
      sdg: {
        available: Boolean(sdgContext),
      },
      wikidata: {
        available: Boolean(resolution.publicSource),
      },
    },
    sources: [
      foodFacts,
      beautyFacts,
      productsFacts,
      directProductEvidence,
      benchmarkContext,
      sdgContext,
      resolution.publicSource,
    ].filter(Boolean),
    notes: [
      "Original user input is preserved. Matching uses an internal normalized version only.",
      "Scores are composite estimates built from open data, not official ESG ratings.",
      "Brand-to-company matching can come from the local catalog or public Wikidata ownership data.",
      "All product APIs are converted into the same internal rubric before scoring, so no API gets to define the final grade on its own.",
      "When comparable source scores disagree, the app uses a median-centered consensus blend and reduces score confidence.",
      "The final score always comes from the same environmental, social, and governance formula, regardless of which source provided the evidence.",
      "If company-specific product evidence is missing, the app still labels the result as a contextual estimate instead of presenting it as a verified company score.",
    ],
  };
}

export const demoCompanies = COMPANY_FIXTURES.map((company) => company.canonicalName);
