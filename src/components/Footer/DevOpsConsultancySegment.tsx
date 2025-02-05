import React from 'react';
import devOpsImg from '../../assets/images/devops-consultancy.jpg';


/**
 * A powerful, static “DevOps Consultancy” marketing segment
 * highlighting LogaXP’s specialized solutions.
 */
const DevOpsConsultancySegment: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 text-white py-16 px-6 md:px-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-25">
        <img
          src={devOpsImg}
          alt="DevOps Consultancy Background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
        {/* Left (Textual Content) */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Elevate Your <span className="text-cyan-300">DevOps Strategy</span> with LogaXP
          </h2>

          <p className="text-base md:text-lg leading-relaxed">
            Streamline CI/CD pipelines, accelerate software delivery, and 
            foster a culture of collaboration. LogaXP’s DevOps Consultancy empowers you to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Automate infrastructure provisioning &amp; deployment.</li>
            <li>Enhance security &amp; compliance without slowing releases.</li>
            <li>Monitor systems proactively to reduce downtime.</li>
            <li>Continuously optimize workflows for agility &amp; performance.</li>
          </ul>

          <p className="text-base md:text-lg leading-relaxed">
            Whether you’re modernizing legacy apps or refining a microservices
            architecture, LogaXP’s DevOps expertise helps you deliver 
            software faster, safer, and more reliably than ever before.
          </p>

          <button className="inline-block bg-cyan-400 hover:bg-cyan-300 text-gray-900 font-semibold px-6 py-2 rounded-md transition-transform transform hover:-translate-y-0.5">
            Explore DevOps Services
          </button>
        </div>

        {/* Right (Image/Card) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white bg-opacity-10 rounded-lg p-4 md:p-6 shadow-xl backdrop-blur-md">
            <img
              src={devOpsImg}
              alt="Showcase for DevOps Consultancy"
              className="rounded-md shadow-md w-full h-56 object-cover"
            />
            <h3 className="text-xl font-bold mt-4 mb-2 text-cyan-300">
              Why LogaXP for DevOps?
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Our approach goes beyond simple automation, embedding 
              best practices for continuous integration, delivery, 
              and collaboration across your entire organization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevOpsConsultancySegment;
