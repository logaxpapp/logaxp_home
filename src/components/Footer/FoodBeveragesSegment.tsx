import React, { useState } from 'react';
// Example image path; replace with your actual file
import foodBeveragesImg from '../../assets/images/food-bev.jpg';

/**
 * A powerful “Food & Beverages” marketing segment highlighting LogaXP’s solutions.
 * Includes a "Learn More" button to reveal a detailed article below.
 */
const FoodBeveragesSegment: React.FC = () => {
  // State to track whether the detailed article is visible
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-900 text-white py-16 px-6 md:px-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src={foodBeveragesImg}
          alt="Food & Beverages Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* Main container */}
      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
        {/* Left (Intro Text) */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Empowering <span className="text-yellow-300">Food &amp; Beverages</span> 
            Industry with LogaXP
          </h2>

          <p className="text-base md:text-lg leading-relaxed">
            From farm-to-fork tracking to real-time inventory management, 
            LogaXP delivers robust digital solutions for the Food &amp; Beverages 
            sector. Our platform helps you:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Optimize supply chains with smart inventory tools.</li>
            <li>Enhance brand loyalty via data-driven marketing.</li>
            <li>Ensure regulatory compliance with precise traceability.</li>
            <li>Scale globally without compromising quality or flavor.</li>
          </ul>

          <p className="text-base md:text-lg leading-relaxed">
            Whether you manage a single artisan eatery or a multinational 
            distribution network, LogaXP’s innovative technology accelerates 
            productivity, streamlines operations, and enriches customer 
            experiences—one delicious dish at a time.
          </p>

          {/* Learn More Button => toggles extended article */}
          {!showDetails && (
            <button
              onClick={() => setShowDetails(true)}
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-2 rounded-md transition-transform transform hover:-translate-y-0.5"
            >
              Learn More
            </button>
          )}
        </div>

        {/* Right (Showcase Card) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white bg-opacity-10 rounded-lg p-4 md:p-6 shadow-xl backdrop-blur-md">
            <img
              src={foodBeveragesImg}
              alt="Showcase for Food & Beverages"
              className="rounded-md shadow-md w-full h-56 object-cover"
            />
            <h3 className="text-xl font-bold mt-4 mb-2 text-yellow-300">
              Why LogaXP for Food &amp; Beverages?
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Our solutions are tailor-made for the unique 
              challenges of the food industry—ensuring freshness, 
              safety, and customer satisfaction at scale.
            </p>
          </div>
        </div>
      </div>

      {/* Expanding Detailed Article */}
      <ExtendedFoodBevArticle visible={showDetails} onClose={() => setShowDetails(false)} />
    </section>
  );
};

/**
 * A collapsible sub-component that appears when the user clicks "Learn More."
 * It displays a more in-depth article about LogaXP's Food & Beverages solutions.
 */
interface ExtendedFoodBevArticleProps {
  visible: boolean;
  onClose: () => void;
}

const ExtendedFoodBevArticle: React.FC<ExtendedFoodBevArticleProps> = ({ visible, onClose }) => {
  return (
    // Outer wrapper for transitions
    // We use "overflow-hidden" + "max-h-0" -> "max-h-[9999px]" trick
    // and "opacity-0" -> "opacity-100" for a simple fade+slide reveal.
    <div
      className={`
        relative mt-4 transition-all duration-700 ease-in-out 
        ${visible ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'} 
        overflow-hidden px-2 md:px-0
      `}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* The actual article content */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 md:p-8 text-white shadow-lg max-w-6xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-4">
          In-Depth: Transforming Food &amp; Beverage Operations with LogaXP
        </h3>

        <p className="mb-4 text-sm md:text-base leading-relaxed">
          Today’s Food &amp; Beverage industry demands agility, transparency, 
          and a commitment to consumer satisfaction. With LogaXP’s advanced 
          platform, businesses can unify their supply chain data, streamline 
          day-to-day tasks, and gain real-time insights into inventory levels 
          and consumer trends. 
        </p>

        <h4 className="text-xl font-semibold text-yellow-300 mt-6 mb-2">
          1. Global Supply Chain Visibility
        </h4>
        <p className="mb-4 text-sm md:text-base leading-relaxed">
          Manage multiple distribution centers across continents with 
          unified dashboards, predictive re-ordering, and integrated shipping 
          logistics to maintain freshness and efficiency.
        </p>

        <h4 className="text-xl font-semibold text-yellow-300 mt-6 mb-2">
          2. Real-Time Data &amp; Analytics
        </h4>
        <p className="mb-4 text-sm md:text-base leading-relaxed">
          Leverage AI-driven analytics to forecast demand spikes, adjust 
          production, and prevent waste. Use interactive reports to 
          identify best-selling products, reduce spoilage, and optimize 
          marketing strategies.
        </p>

        <h4 className="text-xl font-semibold text-yellow-300 mt-6 mb-2">
          3. End-to-End Traceability
        </h4>
        <p className="mb-4 text-sm md:text-base leading-relaxed">
          From raw ingredient sourcing to finished goods, LogaXP ensures 
          compliance with FDA, EU, or other local regulations. Maintain 
          an auditable record of every step, guaranteeing safety and 
          consumer trust.
        </p>

        <h4 className="text-xl font-semibold text-yellow-300 mt-6 mb-2">
          4. Customer-Centric Innovation
        </h4>
        <p className="mb-4 text-sm md:text-base leading-relaxed">
          Use integrated loyalty programs, personalized promotions, 
          and real-time feedback loops to attract and retain a modern 
          customer base that expects on-demand service and premium quality.
        </p>

        <div className="bg-yellow-300 bg-opacity-10 border-l-4 border-yellow-300 p-4 mt-6 rounded shadow-inner">
          <p className="text-sm md:text-base italic text-yellow-100">
            <strong>Pro Tip:</strong> Combine LogaXP’s marketing automation 
            with loyalty data to drive brand engagement. Segment your 
            audience based on purchase patterns, and deliver targeted 
            campaigns for higher ROI.
          </p>
        </div>

        <h4 className="text-xl font-semibold text-yellow-300 mt-6 mb-2">
          Ready to Serve the Future
        </h4>
        <p className="mb-4 text-sm md:text-base leading-relaxed">
          LogaXP is built to adapt to rapidly changing consumer preferences 
          and market conditions. Future-proof your supply chain, scale 
          effortlessly, and guarantee the authenticity of every bite 
          or sip your customers enjoy.
        </p>

        <p className="mb-4 text-sm md:text-base leading-relaxed">
          With an all-in-one platform supporting analytics, compliance, 
          customer engagement, and global logistics, the Food &amp; 
          Beverage industry can confidently innovate, expand, and 
          delight consumers on a massive scale.
        </p>

        {/* Close button */}
        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-5 py-2 rounded-md transition-transform transform hover:-translate-y-0.5"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodBeveragesSegment;
