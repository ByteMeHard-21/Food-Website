import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/new-analysis');
  };

  const handleViewPricing = () => {
    navigate('/subscription-tiers');
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 md:mb-8">
          <Icon name="Sparkles" size={16} color="#FFFFFF" />
          <span className="text-sm md:text-base font-medium text-white">
            Join 500+ Mumbai Restaurateurs
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 md:mb-6">
          Ready to Make Data-Driven Restaurant Decisions?
        </h2>

        <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-10 lg:mb-12 max-w-3xl mx-auto">
          Start your free analysis today and discover why Mumbai's smartest restaurateurs trust OriginBite for location intelligence and revenue predictions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleGetStarted}
            iconName="ArrowRight"
            iconPosition="right"
            className="w-full sm:w-auto"
          >
            Start Free Analysis
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleViewPricing}
            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          >
            View Pricing Plans
          </Button>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          <div className="flex flex-col items-center gap-2">
            <Icon name="CheckCircle2" size={32} color="#FFFFFF" />
            <div className="text-sm md:text-base text-white/90">No credit card required</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Zap" size={32} color="#FFFFFF" />
            <div className="text-sm md:text-base text-white/90">Results in 2 minutes</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Shield" size={32} color="#FFFFFF" />
            <div className="text-sm md:text-base text-white/90">100% data privacy</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;