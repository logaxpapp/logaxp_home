import React from 'react';
import healthFitnessImg from '../../assets/images/health-fitness.jpg';
// Replace with your actual image path

/**
 * A powerful, static “Health & Fitness” marketing segment
 * highlighting LogaXP’s specialized solutions.
 */
const HealthFitnessSegment: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-gray-900 text-white py-16 px-6 md:px-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-25">
        <img
          src={healthFitnessImg}
          alt="Health & Fitness Background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
        {/* Left (Textual Content) */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Transform <span className="text-green-300">Health &amp; Fitness</span> Experiences with LogaXP
          </h2>

          <p className="text-base md:text-lg leading-relaxed">
            Empower individuals and communities to live healthier, stronger lives. 
            LogaXP’s Health &amp; Fitness solutions enable you to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Offer personalized workout &amp; nutrition plans.</li>
            <li>Track real-time biometrics via smart integrations.</li>
            <li>Engage users with gamified fitness challenges.</li>
            <li>Securely manage sensitive health data with HIPAA-grade compliance.</li>
          </ul>

          <p className="text-base md:text-lg leading-relaxed">
            From boutique fitness apps to enterprise wellness platforms, 
            LogaXP’s scalable technology fuels engagement, retains membership, and 
            optimizes user results—strengthening your brand every step of the way.
          </p>

          <button className="inline-block bg-green-400 hover:bg-green-300 text-gray-900 font-semibold px-6 py-2 rounded-md transition-transform transform hover:-translate-y-0.5">
            Learn About Our Fitness Tech
          </button>
        </div>

        {/* Right (Image/Card) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white bg-opacity-10 rounded-lg p-4 md:p-6 shadow-xl backdrop-blur-md">
            <img
              src={healthFitnessImg}
              alt="Showcase for Health & Fitness"
              className="rounded-md shadow-md w-full h-56 object-cover"
            />
            <h3 className="text-xl font-bold mt-4 mb-2 text-green-300">
              Why LogaXP for Wellness?
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              We combine secure data handling with cutting-edge 
              engagement strategies, ensuring your fitness or 
              health solution stands out, boosts motivation, 
              and scales seamlessly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthFitnessSegment;
