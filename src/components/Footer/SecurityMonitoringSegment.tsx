
import React from 'react';
import securityImg from '../../assets/images/security-monitoring.jpg';
// Replace with your actual image path

/**
 * A powerful, static “Security & Monitoring” marketing segment
 * highlighting LogaXP’s specialized solutions.
 */
const SecurityMonitoringSegment: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-purple-700 via-purple-800 to-gray-900 text-white py-16 px-6 md:px-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-25">
        <img
          src={securityImg}
          alt="Security & Monitoring Background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
        {/* Left (Textual Content) */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Fortify Your <span className="text-pink-300">Security &amp; Monitoring</span> with LogaXP
          </h2>

          <p className="text-base md:text-lg leading-relaxed">
            Protect digital assets, detect threats early, and maintain compliance 
            in an ever-evolving landscape. LogaXP’s Security &amp; Monitoring 
            solutions help you:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Implement real-time intrusion detection &amp; prevention.</li>
            <li>Leverage AI-driven threat intelligence.</li>
            <li>Monitor app performance &amp; health around the clock.</li>
            <li>Identify vulnerabilities before they become breaches.</li>
          </ul>

          <p className="text-base md:text-lg leading-relaxed">
            From on-prem data centers to multi-cloud environments, LogaXP’s 
            comprehensive suite ensures resilience, mitigates risks, and maintains 
            uptime—so you can focus on growth without compromise.
          </p>

          <button className="inline-block bg-pink-400 hover:bg-pink-300 text-gray-900 font-semibold px-6 py-2 rounded-md transition-transform transform hover:-translate-y-0.5">
            Discover Security Solutions
          </button>
        </div>

        {/* Right (Image/Card) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white bg-opacity-10 rounded-lg p-4 md:p-6 shadow-xl backdrop-blur-md">
            <img
              src={securityImg}
              alt="Showcase for Security & Monitoring"
              className="rounded-md shadow-md w-full h-56 object-cover"
            />
            <h3 className="text-xl font-bold mt-4 mb-2 text-pink-300">
              Why LogaXP for Security?
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Our solutions blend real-time analytics, advanced encryption, and 
              proactive monitoring to safeguard your entire tech ecosystem 
              from malicious threats and costly downtime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityMonitoringSegment;
