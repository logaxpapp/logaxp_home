import React from 'react';

interface SectionProps {
  title: string;
  content: string;
}

const Section: React.FC<SectionProps> = ({ title, content }) => (
  <div className="relative bg-gradient-to-r from-green-100 via-transparent to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
    {/* Icon Section */}
   
    {/* Content Section */}
    <div className="p-8 pt-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-300">{content}</p>
    </div>
  </div>
);

const MissionVision: React.FC = () => {
  return (
    <section className="mt-16 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
      <Section
        title="Our Mission"
        content="Our mission at LogaXP is to provide innovative, seamless solutions that enhance business operations and customer interactions. We strive to empower organizations across industries with tools that drive efficiency, foster collaboration, and deliver exceptional user experiences."
        
      />
      <Section
        title="Our Vision"
        content="Our vision is to be a global leader in digital solutions, continuously transforming the way businesses operate and connect with their customers. We aim to shape the future of business management by delivering adaptable, user-centric platforms that support sustainable growth and innovation."
       
      />
    </section>
  );
};

export default MissionVision;
