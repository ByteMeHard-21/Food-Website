import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Coupons from "./components/coupons";
import BusinessPlan from "./pages/business-plan";
import Help from "./pages/Help";

// Shared Components & Pages
import NotFound from "pages/NotFound";
import Homepage from './pages/homepage';
import UserDashboard from './pages/user-dashboard';
import AuthPage from "./components/AuthPage"; 

// App Specific Pages (from File 1)
import SubscriptionTiers from './pages/subscription-tiers';
import NewAnalysis from './pages/new-analysis';
import PaymentProcessing from './pages/payment-processing';
import AnalysisResults from './pages/analysis-results';
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>

          {/* 1. PUBLIC ROUTES */}
          <Route path="/" element={<Homepage />} />
          <Route path="/coupons" element={<Coupons />} />
          {/* Local dataset flows remain available without a hosted backend. */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/subscription-tiers" element={<SubscriptionTiers />} />
            <Route path="/new-analysis" element={<NewAnalysis />} />
            <Route path="/payment-processing" element={<PaymentProcessing />} />
            <Route path="/analysis-results" element={<AnalysisResults />} />
          <Route path="/business-plan" element={<BusinessPlan />} />
          <Route path="/help" element={<Help />} />

          {/* 3. REDIRECTS & ERROR HANDLING */}
          {/* Redirects /homepage to the dashboard to avoid duplicate content/routes */}
          <Route path="/homepage" element={<Navigate to="/" replace />} />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
