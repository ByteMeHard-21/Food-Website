# OriginEats local setup

Read [OriginEats.md](./OriginEats.md) for the complete project PRD and agent handoff: every page and Business Studio tab, user journeys, feature internals, scoring formulas, API/data contracts, implementation status, and remaining work. The current website brand is **OriginBite**.

See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for the blank-screen fix, `.env` values,
Supabase database/function prerequisites, and local run instructions.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
OriginEats
├─ eslint.config.js
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ postcss.config.cjs
├─ public
│  ├─ assets
│  │  ├─ favicon.ico
│  │  └─ images
│  │     └─ no_image.png
│  ├─ data
│  │  ├─ area_summary.csv
│  │  ├─ bmc_wards.geojson
│  │  ├─ refine.py
│  │  ├─ restaurants.csv
│  │  ├─ restaurants_min.csv
│  │  ├─ ward_opportunity.csv
│  │  └─ ward_summary.csv
│  ├─ favicon.svg
│  └─ icons.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ hero.png
│  │  ├─ react.svg
│  │  └─ vite.svg
│  ├─ components
│  │  ├─ AppIcon.jsx
│  │  ├─ AppImage.jsx
│  │  ├─ AuthPage.jsx
│  │  ├─ coupons.jsx
│  │  ├─ ErrorBoundary.jsx
│  │  ├─ homepage
│  │  │  └─ components
│  │  │     ├─ CTASection.jsx
│  │  │     └─ FAQAccordion.jsx
│  │  ├─ maps
│  │  │  ├─ HeatmapLayer.jsx
│  │  │  ├─ MapFlyTo.jsx
│  │  │  └─ OpportunityLayer.jsx
│  │  ├─ ScrollToTop.jsx
│  │  └─ ui
│  │     ├─ AuthenticatedSidebar.jsx
│  │     ├─ Button.jsx
│  │     ├─ Checkbox.jsx
│  │     ├─ Input.jsx
│  │     ├─ NavigationBreadcrumbs.jsx
│  │     ├─ PublicHeader.jsx
│  │     ├─ Select.jsx
│  │     └─ UserContextMenu.jsx
│  ├─ index.css
│  ├─ lib
│  │  └─ supabase.js
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ analysis-results
│  │  │  ├─ components
│  │  │  │  ├─ AIRecommendationsSection.jsx
│  │  │  │  ├─ CompetitorPricingChart.jsx
│  │  │  │  ├─ CuisineDemandChart.jsx
│  │  │  │  ├─ ExportActionsBar.jsx
│  │  │  │  ├─ InteractiveMapSection.jsx
│  │  │  │  ├─ ProUpgradePrompt.jsx
│  │  │  │  ├─ RevenuePredictionChart.jsx
│  │  │  │  └─ SuccessProbabilityCard.jsx
│  │  │  └─ index.jsx
│  │  ├─ homepage
│  │  │  ├─ components
│  │  │  │  ├─ CTASection.jsx
│  │  │  │  ├─ FAQAccordion.jsx
│  │  │  │  ├─ FeatureShowcase.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ HeroSection.jsx
│  │  │  │  ├─ InteractiveSimulation.jsx
│  │  │  │  ├─ TestimonialCarousel.jsx
│  │  │  │  └─ WorkflowVisualization.jsx
│  │  │  └─ index.jsx
│  │  ├─ new-analysis
│  │  │  ├─ components
│  │  │  │  ├─ AdditionalOptions.jsx
│  │  │  │  ├─ AnalysisForm.jsx
│  │  │  │  ├─ BudgetSlider.jsx
│  │  │  │  ├─ ContextualGuidance.jsx
│  │  │  │  ├─ CuisineSelector.jsx
│  │  │  │  └─ LocationSelector.jsx
│  │  │  └─ index.jsx
│  │  ├─ NotFound.jsx
│  │  └─ user-dashboard
│  │     ├─ components
│  │     │  ├─ AnalysisHistoryTable.jsx
│  │     │  ├─ MarketTrendsSnapshot.jsx
│  │     │  ├─ QuickActionCard.jsx
│  │     │  ├─ UserStatistics.jsx
│  │     │  └─ WelcomeSection.jsx
│  │     └─ index.jsx
│  ├─ Routes.jsx
│  ├─ styles
│  │  ├─ AuthPage.css
│  │  ├─ index.css
│  │  └─ tailwind.css
│  └─ utils
│     ├─ cn.js
│     └─ dataLoader.js
├─ tailwind.config.cjs
├─ vite.config.js
└─ vite.config.mjs

```
```
OriginEats
├─ eslint.config.js
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ postcss.config.cjs
├─ public
│  ├─ assets
│  │  ├─ favicon.ico
│  │  └─ images
│  │     └─ no_image.png
│  ├─ data
│  │  ├─ area_summary.csv
│  │  ├─ bmc_wards.geojson
│  │  ├─ refine.py
│  │  ├─ restaurants.csv
│  │  ├─ restaurants_min.csv
│  │  ├─ ward_opportunity.csv
│  │  └─ ward_summary.csv
│  ├─ favicon.ico
│  ├─ favicon.svg
│  ├─ icons.svg
│  ├─ manifest.json
│  ├─ robots.txt
│  └─ _redirects
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ hero.png
│  │  ├─ react.svg
│  │  └─ vite.svg
│  ├─ components
│  │  ├─ AppIcon.jsx
│  │  ├─ AppImage.jsx
│  │  ├─ AuthPage.jsx
│  │  ├─ coupons.jsx
│  │  ├─ ErrorBoundary.jsx
│  │  ├─ homepage
│  │  │  └─ components
│  │  │     ├─ CTASection.jsx
│  │  │     └─ FAQAccordion.jsx
│  │  ├─ maps
│  │  │  ├─ HeatmapLayer.jsx
│  │  │  ├─ MapFlyTo.jsx
│  │  │  └─ OpportunityLayer.jsx
│  │  ├─ ScrollToTop.jsx
│  │  └─ ui
│  │     ├─ AuthenticatedSidebar.jsx
│  │     ├─ Button.jsx
│  │     ├─ Checkbox.jsx
│  │     ├─ Input.jsx
│  │     ├─ NavigationBreadcrumbs.jsx
│  │     ├─ PublicHeader.jsx
│  │     ├─ Select.jsx
│  │     └─ UserContextMenu.jsx
│  ├─ index.css
│  ├─ index.jsx
│  ├─ lib
│  │  └─ supabase.js
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ analysis-results
│  │  │  ├─ components
│  │  │  │  ├─ AIRecommendationsSection.jsx
│  │  │  │  ├─ CompetitorPricingChart.jsx
│  │  │  │  ├─ CuisineDemandChart.jsx
│  │  │  │  ├─ ExportActionsBar.jsx
│  │  │  │  ├─ InteractiveMapSection.jsx
│  │  │  │  ├─ ProUpgradePrompt.jsx
│  │  │  │  ├─ RevenuePredictionChart.jsx
│  │  │  │  └─ SuccessProbabilityCard.jsx
│  │  │  └─ index.jsx
│  │  ├─ homepage
│  │  │  ├─ components
│  │  │  │  ├─ CTASection.jsx
│  │  │  │  ├─ FAQAccordion.jsx
│  │  │  │  ├─ FeatureShowcase.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ HeroSection.jsx
│  │  │  │  ├─ InteractiveSimulation.jsx
│  │  │  │  ├─ TestimonialCarousel.jsx
│  │  │  │  └─ WorkflowVisualization.jsx
│  │  │  └─ index.jsx
│  │  ├─ new-analysis
│  │  │  ├─ components
│  │  │  │  ├─ AdditionalOptions.jsx
│  │  │  │  ├─ AnalysisForm.jsx
│  │  │  │  ├─ BudgetSlider.jsx
│  │  │  │  ├─ ContextualGuidance.jsx
│  │  │  │  ├─ CuisineSelector.jsx
│  │  │  │  └─ LocationSelector.jsx
│  │  │  └─ index.jsx
│  │  ├─ NotFound.jsx
│  │  ├─ pages
│  │  │  ├─ analysis-results
│  │  │  │  ├─ components
│  │  │  │  │  ├─ AIRecommendationsSection.jsx
│  │  │  │  │  ├─ CompetitorPricingChart.jsx
│  │  │  │  │  ├─ CuisineDemandChart.jsx
│  │  │  │  │  ├─ ExportActionsBar.jsx
│  │  │  │  │  ├─ InteractiveMapSection.jsx
│  │  │  │  │  ├─ ProUpgradePrompt.jsx
│  │  │  │  │  ├─ RevenuePredictionChart.jsx
│  │  │  │  │  └─ SuccessProbabilityCard.jsx
│  │  │  │  └─ index.jsx
│  │  │  ├─ homepage
│  │  │  │  ├─ components
│  │  │  │  │  ├─ CTASection.jsx
│  │  │  │  │  ├─ FAQAccordion.jsx
│  │  │  │  │  ├─ FeatureShowcase.jsx
│  │  │  │  │  ├─ Footer.jsx
│  │  │  │  │  ├─ HeroSection.jsx
│  │  │  │  │  ├─ InteractiveSimulation.jsx
│  │  │  │  │  ├─ TestimonialCarousel.jsx
│  │  │  │  │  └─ WorkflowVisualization.jsx
│  │  │  │  └─ index.jsx
│  │  │  ├─ new-analysis
│  │  │  │  ├─ components
│  │  │  │  │  ├─ AdditionalOptions.jsx
│  │  │  │  │  ├─ AnalysisForm.jsx
│  │  │  │  │  ├─ BudgetSlider.jsx
│  │  │  │  │  ├─ ContextualGuidance.jsx
│  │  │  │  │  ├─ CuisineSelector.jsx
│  │  │  │  │  └─ LocationSelector.jsx
│  │  │  │  └─ index.jsx
│  │  │  ├─ NotFound.jsx
│  │  │  ├─ payment-processing
│  │  │  │  ├─ components
│  │  │  │  │  ├─ BillingInformationForm.jsx
│  │  │  │  │  ├─ CardPaymentForm.jsx
│  │  │  │  │  ├─ OrderSummary.jsx
│  │  │  │  │  ├─ PaymentConfirmation.jsx
│  │  │  │  │  ├─ PaymentMethodCard.jsx
│  │  │  │  │  ├─ TrustBadges.jsx
│  │  │  │  │  └─ UPIPaymentForm.jsx
│  │  │  │  └─ index.jsx
│  │  │  ├─ subscription-tiers
│  │  │  │  ├─ components
│  │  │  │  │  ├─ BillingToggle.jsx
│  │  │  │  │  ├─ FeatureComparison.jsx
│  │  │  │  │  ├─ PlanCard.jsx
│  │  │  │  │  ├─ SubscriptionFAQ.jsx
│  │  │  │  │  └─ TrustSignals.jsx
│  │  │  │  └─ index.jsx
│  │  │  └─ user-dashboard
│  │  │     ├─ components
│  │  │     │  ├─ AnalysisHistoryTable.jsx
│  │  │     │  ├─ MarketTrendsSnapshot.jsx
│  │  │     │  ├─ QuickActionCard.jsx
│  │  │     │  ├─ UserStatistics.jsx
│  │  │     │  └─ WelcomeSection.jsx
│  │  │     └─ index.jsx
│  │  ├─ payment-processing
│  │  │  ├─ components
│  │  │  │  ├─ BillingInformationForm.jsx
│  │  │  │  ├─ CardPaymentForm.jsx
│  │  │  │  ├─ OrderSummary.jsx
│  │  │  │  ├─ PaymentConfirmation.jsx
│  │  │  │  ├─ PaymentMethodCard.jsx
│  │  │  │  ├─ TrustBadges.jsx
│  │  │  │  └─ UPIPaymentForm.jsx
│  │  │  └─ index.jsx
│  │  ├─ subscription-tiers
│  │  │  ├─ components
│  │  │  │  ├─ BillingToggle.jsx
│  │  │  │  ├─ FeatureComparison.jsx
│  │  │  │  ├─ PlanCard.jsx
│  │  │  │  ├─ SubscriptionFAQ.jsx
│  │  │  │  └─ TrustSignals.jsx
│  │  │  └─ index.jsx
│  │  └─ user-dashboard
│  │     ├─ components
│  │     │  ├─ AnalysisHistoryTable.jsx
│  │     │  ├─ MarketTrendsSnapshot.jsx
│  │     │  ├─ QuickActionCard.jsx
│  │     │  ├─ UserStatistics.jsx
│  │     │  └─ WelcomeSection.jsx
│  │     └─ index.jsx
│  ├─ Routes.jsx
│  ├─ styles
│  │  ├─ AuthPage.css
│  │  ├─ index.css
│  │  └─ tailwind.css
│  └─ utils
│     ├─ cn.js
│     └─ dataLoader.js
├─ tailwind.config.cjs
├─ vite.config.js
└─ vite.config.mjs

```
