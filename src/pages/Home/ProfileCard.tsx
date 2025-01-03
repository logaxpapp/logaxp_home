// src/components/TabsWithStyledCard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Decorations, { Decoration } from "./Decorations";
import Integrity from "../../assets/images/four.png";
import Trust from "../../assets/images/data.png";
import Security from "../../assets/images/banner.jpeg";

interface Detail {
  label: string;
  value: string;
}

interface Help {
  linkText: string;
  link: string;
  description: string;
}

interface TabContent {
  title: string;
  text: string;
  details: Detail[];
  help: Help;
  image: string;
  bgColor: string;
}

interface TabContents {
  integrity: TabContent;
  scalability: TabContent;
  dependability: TabContent;
}

const TabsWithStyledCard: React.FC = () => {
  // Define the possible tabs as a union type
  type TabKey = "integrity" | "scalability" | "dependability";

  const [activeTab, setActiveTab] = useState<TabKey>("integrity");

  const tabs: { id: TabKey; label: string }[] = [
    { id: "integrity", label: "Integrity" },
    { id: "scalability", label: "Scalability" },
    { id: "dependability", label: "Dependability" },
  ];

  const tabContent: TabContents = {
    integrity: {
      title: "Integrity",
      text: `At LogaXP, integrity is at the core of everything we do. We ensure that our applications are built with the highest standards, providing reliable and trustworthy solutions for managing SaaS applications.`,
      details: [
        { label: "Commitment", value: "Honest and Transparent Practices" },
        { label: "Security", value: "Robust Data Protection" },
        { label: "Compliance", value: "Adherence to Industry Standards" },
      ],
      help: {
        linkText: "Learn About Our Integrity",
        link: "#",
        description:
          "Discover how LogaXP maintains the highest levels of integrity in all our services and solutions.",
      },
      image: Integrity,
      bgColor: "bg-gray-300",
    },
    scalability: {
      title: "Scalability",
      text: `LogaXP's solutions are designed to grow with your business. Our scalable architectures ensure that as your user base expands, your applications remain efficient and responsive.`,
      details: [
        { label: "Architecture", value: "Modular and Flexible Design" },
        { label: "Performance", value: "Optimized for High Load" },
        { label: "Growth", value: "Seamless Expansion Capabilities" },
      ],
      help: {
        linkText: "Explore Our Scalability",
        link: "#",
        description:
          "Learn how LogaXP's scalable solutions can support your business's growth and evolving needs.",
      },
      image: Trust,
      bgColor: "bg-blue-50",
    },
    dependability: {
      title: "Dependability",
      text: `Dependability is key to our client relationships. LogaXP ensures that our applications are always available, minimizing downtime and providing consistent performance for mission-critical operations.`,
      details: [
        { label: "Uptime", value: "99.99% Availability" },
        { label: "Support", value: "24/7 Customer Assistance" },
        { label: "Reliability", value: "Consistent Performance Metrics" },
      ],
      help: {
        linkText: "Our Dependability Standards",
        link: "#",
        description:
          "Understand how LogaXP guarantees dependable services to keep your business operations running smoothly.",
      },
      image: Security,
      bgColor: "bg-slate-100",
    },
  };

  const currentContent = tabContent[activeTab];

  // Define decorations with many stars
  const decorations: Decoration[] = Array.from({ length: 100 }, (_, i) => ({
    type: "star",
    top: `${Math.random() * 20}%`, // Constrained to the top 20% of the component
    left: `${Math.random() * 300}%`,
    size: `h-${Math.floor(Math.random() * 8) + 3} w-${Math.floor(Math.random() * 8) + 3}`,
    opacity: `opacity-${Math.floor(Math.random() * 80) + 20}`,
  }));

  return (
    <div className="bg- min-h-screen relative">
      {/* Dynamic Background Section */}
      <div
        className={`${
          activeTab === "integrity"
            ? "bg-gray-50"
            : activeTab === "scalability"
            ? "bg-slate-50"
            : "bg-green-50"
        } text-gray-800 dark:bg-gray-700 py-1 px-5 relative overflow-hidden h-scroll-smooth transition-opacity duration-300 h-[520px] md:h-[500px] lg:h-[600px]`}>
      
        {/* Decorative Stars Spread Across the Top */}
        <Decorations decorations={decorations} />

        {/* Header and Main Content Positioned Above Decorations */}
        <div className="relative z-10 max-w-6xl mx-auto text-center mb-16 pt-4">
          <h2 className="text-4xl md:text-6xl font-bold mt-2 mb-8 dark:text-white text-center font-primary">
            Everything You Need
          </h2>

          {/* Tabs */}
          <div className="flex justify-center space-x-8 font-secondary">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-t-lg font-semibold transition-colors duration-300 shadow-lg mb-12 ${
                  activeTab === tab.id
                    ? "bg-white border border-lemonGreen-light text-gray-800"
                    : "bg-lemonGreen text-gray-50 hover:bg-gray-400"
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlapping Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto -mt-80 max-w-6xl bg-gray-100 text-gray-800 p-12 md:p-16 rounded-lg shadow-xl flex flex-col md:flex-row z-20"
      >
        {/* Decorative Badge */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 border border-blue-950 text-gray-800 px-6 py-2 rounded-full shadow-lg flex items-center space-x-3">
          <InformationCircleIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">{currentContent.title}</span>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <p className="mt-4 md:mt-0 text-lg leading-relaxed">{currentContent.text}</p>

          {/* Details Table */}
          <div className="mt-8">
            <h4 className="text-2xl font-semibold mb-4">Key Features</h4>
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <tbody>
                {currentContent.details.map((detail: Detail, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-2 font-medium text-gray-700 text-lg">{detail.label}</td>
                    <td className="px-6 py-2 text-lg">{detail.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Help Section */}
          <div className="mt-2">
            <p className="font-semibold text-lg">Need More Information?</p>
            <a
              href={currentContent.help.link}
              className="text-teal-600 font-semibold underline flex items-center space-x-2 mt-2 text-lg"
            >
              <span>{currentContent.help.linkText}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {currentContent.help.description}
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="relative mt-12 md:mt-0 md:ml-12 flex-shrink-0">
          <motion.img
            src={currentContent.image}
            alt={currentContent.title}
            className="w-60 h-60 object-cover rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Explore Button */}
      <div className="text-center mt-16">
        <button className="bg-lemonGreen text-white font-extrabold border border-lemonGreen px-8 py-4 rounded-lg hover:bg-lemonGreen-light hover:text-white transition-colors duration-200 text-xl">
          Explore
        </button>
      </div>
    </div>
  );
};

export default TabsWithStyledCard;
