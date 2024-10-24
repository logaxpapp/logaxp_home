import React from 'react';
import Banner from './Banner';
import MissionVision from './MissionVision';
import AboutUs from './AboutUs';
import Team from './Team';

const About: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen dark:bg-gray-800">
      {/* Banner Section */}
      <Banner />

      {/* Mission and Vision Sections */}
      <MissionVision />

      {/* About Us Section */}
      <AboutUs />

      {/* Team Section */}
      <Team />
    </div>
  );
};

export default About;
