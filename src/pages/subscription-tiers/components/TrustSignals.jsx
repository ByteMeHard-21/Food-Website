import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignals = () => {
  const paymentMethods = [
  { name: 'UPI', icon: 'Smartphone' },
  { name: 'Credit Card', icon: 'CreditCard' },
  { name: 'Debit Card', icon: 'CreditCard' },
  { name: 'Net Banking', icon: 'Building2' }];


  const securityFeatures = [
  { icon: 'Shield', text: 'SSL Encrypted' },
  { icon: 'Lock', text: 'PCI Compliant' },
  { icon: 'CheckCircle', text: 'Razorpay Secured' },
  { icon: 'Award', text: 'ISO Certified' }];


  const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Owner, Spice Route Cafe',
    location: 'Bandra West',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1238dde92-1763293896347.png",
    imageAlt: 'Professional Indian woman with long black hair wearing white business attire smiling confidently',
    quote: 'The Pro plan paid for itself within the first month. The competitor radar helped me price my menu perfectly for Bandra\'s market.',
    rating: 5
  },
  {
    name: 'Rajesh Patel',
    role: 'Founder, Mumbai Bites',
    location: 'Lower Parel',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_12b9c2bb3-1763293370864.png",
    imageAlt: 'Professional Indian man with short black hair wearing navy blue suit and white shirt with warm smile',
    quote: 'The revenue predictions were spot-on. I expanded to Juhu based on OriginBite\'s analysis and we\'re already profitable.',
    rating: 5
  }];


  return (
    <div className="space-y-8 md:space-y-12">
      <div className="bg-card rounded-xl border border-border p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-6 text-center">
          Secure Payment Methods
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {paymentMethods?.map((method, index) =>
          <div key={index} className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border border-border">
              <Icon name={method?.icon} size={32} color="var(--color-primary)" />
              <span className="text-xs md:text-sm text-foreground font-medium">{method?.name}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {securityFeatures?.map((feature, index) =>
          <div key={index} className="flex items-center gap-2 justify-center">
              <Icon name={feature?.icon} size={18} color="var(--color-accent)" />
              <span className="text-xs md:text-sm text-muted-foreground">{feature?.text}</span>
            </div>
          )}
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-6 text-center">
          What Mumbai Restaurateurs Say
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials?.map((testimonial, index) =>
          <div key={index} className="bg-background rounded-lg p-6 border border-border">
              <div className="flex items-center gap-4 mb-4">
                <Image
                src={testimonial?.image}
                alt={testimonial?.imageAlt}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover" />

                <div className="flex-1">
                  <h4 className="text-sm md:text-base font-semibold text-foreground">{testimonial?.name}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">{testimonial?.role}</p>
                  <p className="text-xs text-accent">{testimonial?.location}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial?.rating)]?.map((_, i) =>
              <Icon key={i} name="Star" size={16} color="var(--color-accent)" />
              )}
              </div>

              <p className="text-sm md:text-base text-foreground leading-relaxed">
                "{testimonial?.quote}"
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-accent/10 rounded-xl border border-accent/20 p-6 md:p-8 text-center">
        <Icon name="Info" size={32} color="var(--color-accent)" className="mx-auto mb-4" />
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
          Transparent Pricing
        </h3>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          All prices shown are in Indian Rupees (INR) and include applicable taxes. No hidden fees, no surprise charges. What you see is what you pay.
        </p>
      </div>
    </div>);

};

export default TrustSignals;