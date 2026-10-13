import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How accurate are the revenue predictions for Mumbai locations?",
      answer: "Our AI models achieve 92% accuracy by analyzing 50+ data points specific to Mumbai's food service market, including neighborhood demographics, foot traffic patterns, seasonal trends, and local competition. We continuously update our models with real-world data from Mumbai restaurants."
    },
    {
      question: "What Mumbai areas does OriginBite cover?",
      answer: "We provide comprehensive analysis for all major Mumbai areas including Bandra, Juhu, Colaba, Dadar, Powai, Lower Parel, Andheri, Malad, Borivali, and 40+ other neighborhoods. Our database includes granular data at the pin-code level for hyper-local insights."
    },
    {
      question: "How does the competitor analysis work?",
      answer: "Our Competitor Radar identifies every restaurant within 500m of your chosen location. We analyze their menu pricing, customer ratings, cuisine offerings, seating capacity, and market positioning. You'll see detailed comparisons and identify market gaps your restaurant can fill."
    },
    {
      question: "Can I analyze multiple locations before deciding?",
      answer: "Yes! Free users get 3 location analyses per month. Pro subscribers get unlimited analyses, allowing you to compare multiple Mumbai neighborhoods, test different cuisine types, and find the optimal location for your restaurant concept."
    },
    {
      question: "What\'s included in the AI-generated recommendations?",
      answer: "You receive specific, actionable recommendations including optimal menu pricing strategies, suggested cuisine modifications for local tastes, marketing approaches for your neighborhood, staffing requirements, and risk mitigation strategies specific to Mumbai's market conditions."
    },
    {
      question: "How current is the Mumbai market data?",
      answer: "We update our database monthly with the latest information on new restaurant openings, closures, pricing changes, and demographic shifts. Our AI models incorporate real-time data from food delivery platforms, review sites, and local business registrations."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Everything you need to know about OriginBite's Mumbai restaurant analytics
          </p>
        </div>

        <div className="space-y-4">
          {faqs?.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-warm"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-base md:text-lg font-semibold text-foreground pr-4">
                  {faq?.question}
                </span>
                <Icon
                  name={openIndex === index ? "ChevronUp" : "ChevronDown"}
                  size={20}
                  className="text-primary flex-shrink-0 transition-transform duration-300"
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {faq?.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;