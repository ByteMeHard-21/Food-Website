import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AuthenticatedSidebar from "../../components/ui/AuthenticatedSidebar";
import NavigationBreadcrumbs from "../../components/ui/NavigationBreadcrumbs";
import UserContextMenu from "../../components/ui/UserContextMenu";

import SuccessProbabilityCard from "./components/SuccessProbabilityCard";
import InteractiveMapSection from "./components/InteractiveMapSection";
import CuisineDemandChart from "./components/CuisineDemandChart";
import CompetitorPricingChart from "./components/CompetitorPricingChart";
import RevenuePredictionChart from "./components/RevenuePredictionChart";
import AIRecommendationsSection from "./components/AIRecommendationsSection";
import ExportActionsBar from "./components/ExportActionsBar";
import ProUpgradePrompt from "./components/ProUpgradePrompt";

import { loadRestaurants } from "../../utils/dataLoader";

/** ---------------------------
 * Helper: normalize text
 --------------------------- */
const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/** ---------------------------
 * Helper: haversine distance
 --------------------------- */
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

import { getReports } from '../../lib/storage';
import { exportCSV, exportPDF } from '../../lib/exports';
import { revenueProjection } from '../../lib/scoring';

const AnalysisResults = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();

  const [isSidebarCollapsed] = useState(false);

  // ✅ read analysis result coming from NewAnalysis page
  const report = useMemo(() => locationHook.state?.analysisResult ? locationHook.state : getReports()[0] || null, [locationHook.state]);
  const analysisInput = report?.analysisInput || null;
  const analysisResult = report?.analysisResult || null;

  // ✅ If user directly opens /analysis-results without submitting form
  useEffect(() => {
    if (!analysisResult) {
      // redirect back (prevents crashes)
      navigate("/new-analysis");
    }
  }, [analysisResult, navigate]);

  /** ---------------------------
   * ✅ REAL DATA (from backend)
   --------------------------- */
  const analysisData = useMemo(() => {
    // fallback safe values
    const fallback = {
      probability: 0,
      riskLevel: "Medium",
      keyFactors: [],
      location: {
        area: analysisInput?.location || "Unknown",
        city: "Mumbai",
        lat: analysisResult?.coordinates?.lat || 19.076, // fallback Mumbai coordinates
        lng: analysisResult?.coordinates?.lng || 72.8777,
      },
      demographics: {
        footTraffic: "N/A",
        growthRate: 0,
      },
    };

    if (!analysisResult) return fallback;

    return {
      probability: analysisResult?.successRate ?? 0,
      riskLevel: analysisResult?.riskLevel ?? "Medium",

      // backend keyFactors -> SuccessProbabilityCard format
      keyFactors: (analysisResult?.keyFactors || []).map((k) => ({
        title: k?.title,
        description: k?.desc,
      })),

      // use selected locality name in UI
      location: {
        area: analysisResult?.locality || analysisInput?.location || "Unknown",
        city: "Mumbai",
        lat: analysisResult?.coordinates?.lat || 19.076,
        lng: analysisResult?.coordinates?.lng || 72.8777,
      },

      demographics: {
        footTraffic: analysisResult?.metrics?.demandScore
          ? `Demand Score: ${analysisResult.metrics.demandScore}/100`
          : "N/A",
        growthRate: analysisResult?.metrics?.opportunityScore ?? 0,
      },
    };
  }, [analysisInput, analysisResult]);

  /** ---------------------------
   * Global Data: restaurants.csv
   --------------------------- */
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);

  /** ---------------------------
   * Shared Filters
   --------------------------- */
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedCuisine, setSelectedCuisine] = useState("ALL");

  /** ---------------------------
   * ✅ Layer Lock State (IMPORTANT)
   --------------------------- */
  const [activeLayer, setActiveLayer] = useState("heatmap");

  /** ---------------------------
   * Load restaurants from CSV
   --------------------------- */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {

        setRestaurantsLoading(true);
        const rows = await loadRestaurants();
        if (!mounted) return;

        setRestaurants(rows || []);
      } catch (err) {
        console.error("❌ Failed to load restaurants:", err);
      } finally {
        if (mounted) setRestaurantsLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  /** ---------------------------
   * Filter restaurants for charts + list
   --------------------------- */
  const filteredRestaurants = useMemo(() => {
    if (!restaurants.length) return [];

    return restaurants.filter((r) => {
      const areaOk =
        selectedArea === "ALL" ||
        normalize(r.area_name) === normalize(selectedArea);

      const cuisineOk =
        selectedCuisine === "ALL" || r.primary_category === selectedCuisine;

      return areaOk && cuisineOk;
    });
  }, [restaurants, selectedArea, selectedCuisine]);

  /** ---------------------------
   * Real Competitors: distance-based list
   --------------------------- */
  const competitors = useMemo(() => {
    if (!restaurants.length) return [];

    const tLat = analysisData.location.lat;
    const tLng = analysisData.location.lng;

    const areaNorm = normalize(selectedArea);

    const candidates = restaurants.filter((r) => {
      const hasCoords = typeof r.lat === "number" && typeof r.lng === "number";
      if (!hasCoords) return false;

      const areaOk =
        selectedArea === "ALL" || normalize(r.area_name) === areaNorm;

      const cuisineOk =
        selectedCuisine === "ALL" || r.primary_category === selectedCuisine;

      return areaOk && cuisineOk;
    });

    const mapped = candidates.map((r) => {
      const dist = getDistanceFromLatLonInKm(tLat, tLng, r.lat, r.lng);

      return {
        ...r,
        distance: Number(dist.toFixed(2)),
      };
    });

    return mapped.sort((a, b) => a.distance - b.distance).slice(0, 25);
  }, [
    restaurants,
    analysisData.location.lat,
    analysisData.location.lng,
    selectedArea,
    selectedCuisine,
  ]);

  /** ---------------------------
   * ✅ Pie Chart Data (real + reactive)
   --------------------------- */
  const cuisineDemandData = useMemo(() => {
    if (!filteredRestaurants.length) return [];

    const counts = new Map();

    for (const r of filteredRestaurants) {
      const c = String(r.primary_category || "Others").trim() || "Others";
      counts.set(c, (counts.get(c) || 0) + 1);
    }

    const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;

    const arr = Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
      value: Math.round((count / total) * 100),
    }));

    arr.sort((a, b) => b.count - a.count);

    const TOP_N = 5;
    if (arr.length <= TOP_N) return arr.map(({ count, ...x }) => x);

    const top = arr.slice(0, TOP_N);
    const rest = arr.slice(TOP_N);

    const restCount = rest.reduce((s, x) => s + x.count, 0);
    const restPercent = Math.max(
      1,
      100 - top.reduce((s, x) => s + x.value, 0)
    );

    return [
      ...top.map(({ count, ...x }) => x),
      { name: "Others", value: restPercent },
    ];
  }, [filteredRestaurants]);

  /** ---------------------------
   * Other charts (keep same for now)
   --------------------------- */
  const competitorPricingData = [
    { category: "Starters", yourPrice: 180, competitorAvg: 220 },
    { category: "Main Course", yourPrice: 280, competitorAvg: 320 },
    { category: "Breads", yourPrice: 45, competitorAvg: 55 },
    { category: "Desserts", yourPrice: 120, competitorAvg: 140 },
    { category: "Beverages", yourPrice: 80, competitorAvg: 95 },
  ];

  const revenueData = revenueProjection(analysisInput, analysisResult);
  const monsoonData = revenueData.map((row, index) => ({ ...row, revenue: Math.round(row.revenue * (index >= 5 && index <= 8 ? .8 : 1)) }));

  // ✅ Convert backend keyFactors into "recommendations" UI format (simple + honest)
  const recommendations = useMemo(() => {
  if (!analysisResult?.metrics) return [];

  const m = analysisResult.metrics;

  const demand = Number(m.demandScore ?? 0);
  const opp = Number(m.opportunityScore ?? 0);
  const comp = Number(m.competitionScore ?? 0);
  const rating = Number(m.ratingScore ?? 0);
  const budgetFit = Number(m.budgetFitScore ?? 0);

  const cuisineCount = Number(m.cuisineCount ?? 0);
  const cuisineAvgRating = Number(m.cuisineAvgRating ?? 0);
  const cuisineTotalReviews = Number(m.cuisineTotalReviews ?? 0);

  const nearMetro = Boolean(m.nearMetro);

  const recs = [];

  // 1) Demand Strength / Market fit
  if (demand >= 65) {
    recs.push({
      category: "Marketing",
      title: "Leverage High Demand with Strong Launch Campaign",
      description: `This locality has strong demand signals (Demand Score ${demand}/100). Run an aggressive launch campaign to capture initial momentum.`,
      revenueImpact: 18,
      implementationCost: 25000,
      expectedROI: 2.5,
      actionSteps: [
        "Run 7-day launch offers (limited time)",
        "Target Instagram + Google Business profile",
        "Partner with delivery platforms for first-month visibility",
      ],
    });
  } else {
    recs.push({
      category: "Operations",
      title: "Improve Local Market Fit Before Big Investment",
      description: `Demand Score is ${demand}/100 which indicates moderate/low demand. Consider a smaller setup first or optimize cuisine selection.`,
      revenueImpact: 10,
      implementationCost: 0,
      expectedROI: 1.5,
      actionSteps: [
        "Start with limited menu and observe traction",
        "Focus on delivery-first strategy initially",
        "Adjust cuisine positioning based on competitor gaps",
      ],
    });
  }

  // 2) Competition Strategy
  if (comp <= 40 || cuisineCount >= 8) {
    recs.push({
      category: "Menu",
      title: "Differentiate Menu to Beat High Competition",
      description: `Competition is high (Competition Score ${comp}/100). There are already ${cuisineCount} similar outlets in this locality, so differentiation is critical.`,
      revenueImpact: 16,
      implementationCost: 15000,
      expectedROI: 2.1,
      actionSteps: [
        "Introduce 2–3 signature dishes not offered nearby",
        "Highlight quality + hygiene + consistency",
        "Offer combos for fast decision-making customers",
      ],
    });
  } else {
    recs.push({
      category: "Pricing",
      title: "Exploit Low Competition with Smart Pricing",
      description: `Competition is relatively low (Competition Score ${comp}/100). You can quickly capture market share with strong pricing + reviews strategy.`,
      revenueImpact: 14,
      implementationCost: 5000,
      expectedROI: 2.0,
      actionSteps: [
        "Keep entry prices slightly lower than premium competitors",
        "Push review generation from day 1",
        "Maintain consistent portion size and packaging",
      ],
    });
  }

  // 3) Customer Trust / Rating signals
  if (rating >= 75 || cuisineTotalReviews >= 8000) {
    recs.push({
      category: "Operations",
      title: "Invest in Customer Experience & Reviews",
      description: `The locality shows strong customer engagement (Avg Cuisine Rating ${cuisineAvgRating || "—"}, Total Reviews ${cuisineTotalReviews}). Focus on service + experience to earn repeat customers.`,
      revenueImpact: 15,
      implementationCost: 12000,
      expectedROI: 2.2,
      actionSteps: [
        "Standardize staff greeting + service flow",
        "Ask for Google reviews after each visit/delivery",
        "Add quick feedback QR on bills & packaging",
      ],
    });
  } else {
    recs.push({
      category: "Marketing",
      title: "Build Trust Fast with Reviews & Influencer Proof",
      description: `Customer trust signals are still developing. Improve credibility using reviews and small influencer promotions.`,
      revenueImpact: 12,
      implementationCost: 10000,
      expectedROI: 1.8,
      actionSteps: [
        "Offer review-based incentives (ethical)",
        "Invite 3–5 micro influencers from nearby locality",
        "Post behind-the-scenes hygiene/kitchen content",
      ],
    });
  }

  // 4) Location advantage (Metro / Access)
  if (nearMetro) {
    recs.push({
      category: "Operations",
      title: "Optimize for Metro Footfall (Quick Service Wins)",
      description:
        "Near-metro locations benefit from high footfall. Build a fast ordering + quick service system to maximize peak-hour conversions.",
      revenueImpact: 17,
      implementationCost: 8000,
      expectedROI: 2.4,
      actionSteps: [
        "Add quick-pickup items for commuters",
        "Use visible signage + short menu boards",
        "Optimize kitchen for fast throughput",
      ],
    });
  } else {
    recs.push({
      category: "Marketing",
      title: "Compensate Access Limitations with Delivery Focus",
      description:
        "This location is not metro-priority. Your growth will be stronger if delivery is optimized early.",
      revenueImpact: 13,
      implementationCost: 0,
      expectedROI: 1.7,
      actionSteps: [
        "Prioritize packaging & delivery ratings",
        "Run delivery-only weekday promotions",
        "Optimize delivery radius and peak hours",
      ],
    });
  }

  // Extra: budget fit tweak (slightly adjust impact)
  // (keeps recommendations “AI-like” and personalized)
  const adjust = budgetFit >= 70 ? 1.05 : 0.95;
  const final = recs
    .slice(0, 4)
    .map((r) => ({
      ...r,
      revenueImpact: Math.max(8, Math.round(r.revenueImpact * adjust)),
    }));

  return final;
}, [analysisResult]);


  /** ---------------------------
   * Export actions
   --------------------------- */
  const handleExportPDF = () => exportPDF(report);
  const handleExportCSV = () => exportCSV(report);

  const handleUpgrade = () => navigate("/subscription-tiers");
  const handleNewAnalysis = () => navigate("/new-analysis");

  // ✅ avoid rendering if redirected
  if (!analysisResult) return null;

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedSidebar isCollapsed={isSidebarCollapsed} />

      <div className="lg:ml-[280px] min-h-screen">
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-warm-sm">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
            <NavigationBreadcrumbs />
            <UserContextMenu />
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
          <p className="demo-notice">Dataset-based planning score · Revenue charts are illustrative scenarios, not guaranteed returns. Map tiles require an internet connection.</p>
          <SuccessProbabilityCard
            probability={analysisData.probability}
            riskLevel={analysisData.riskLevel}
            keyFactors={analysisData.keyFactors}
          />

          <ExportActionsBar
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            onUpgrade={handleUpgrade}
            onNewAnalysis={handleNewAnalysis}
          />

          <InteractiveMapSection
            location={analysisData.location}
            demographics={analysisData.demographics}
            restaurants={restaurants}
            competitors={competitors}
            loading={restaurantsLoading}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            selectedCuisine={selectedCuisine}
            setSelectedCuisine={setSelectedCuisine}
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CuisineDemandChart demandData={cuisineDemandData} />
            <CompetitorPricingChart pricingData={competitorPricingData} />
          </div>

          <RevenuePredictionChart revenueData={revenueData} monsoonData={monsoonData} />

          <AIRecommendationsSection recommendations={recommendations} />

          <ProUpgradePrompt />
        </main>

        <footer className="border-t border-border bg-card mt-12">
          <div className="px-4 md:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} OriginBite. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </a>
                <a href="#support" className="text-sm text-muted-foreground hover:text-foreground">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
  
};

export default AnalysisResults;