import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ userName }) => {
  const getCurrentDate = () => {
    const date = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date?.toLocaleDateString('en-IN', options);
  };

  const getGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="bg-gradient-to-r from-primary to-[#28765B] rounded-xl p-6 md:p-8 lg:p-10 text-white shadow-warm-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-sm md:text-base opacity-90 flex items-center gap-2">
            <Icon name="Calendar" size={18} />
            {getCurrentDate()}
          </p>
          <p className="text-sm md:text-base opacity-80 mt-3">
            Mumbai's restaurant market is showing strong growth trends this quarter
          </p>
        </div>
        <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white bg-opacity-20 rounded-full">
          <Icon name="TrendingUp" size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
