import React from 'react';
import appDevImg from '../../assets/images/banner.jpeg';
// Replace with your actual main image path
import appDevCodingImg from '../../assets/images/app-dev-coding.jpg';
// Replace with a secondary image if you wish

/**
 * A state-of-the-art “App Development” marketing segment
 * highlighting LogaXP’s specialized solutions.
 */
const AppDevelopmentSegment: React.FC = () => {
  return (
    <section className="relative overflow-hidden text-white">
      {/* Top wave background (SVG) */}
      <div className="absolute top-0 left-0 w-full pointer-events-none opacity-90 z-0">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#waveGradient)"
            fillOpacity="1"
            d="M0,192L40,170.7C80,149,160,107,240,117.3C320,128,400,192,480,208C560,224,640,192,720,170.7C800,149,880,139,960,144C1040,149,1120,171,1200,170.7C1280,171,1360,149,1400,138.7L1440,128L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff00d4" />
              <stop offset="50%" stopColor="#a51ce3" />
              <stop offset="100%" stopColor="#6125f5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main gradient background behind everything */}
      <div className="relative bg-gradient-to-br from-pink-700 via-purple-800 to-blue-900 pt-24 pb-16 px-6 md:px-12 z-10">
        {/* Main container */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* LEFT: content */}
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Next-Level <span className="text-lime-400">App Development</span> with LogaXP
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              Leverage modern frameworks, intuitive UX, and powerful backend 
              integrations—unleashing your vision across mobile, web, and beyond.
              Our mission:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Design pixel-perfect interfaces that captivate users.</li>
              <li>Incorporate AI-driven insights to boost app performance.</li>
              <li>Automate testing &amp; deployment for rapid iteration.</li>
              <li>Ensure scalable architecture that grows with your market.</li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed">
              Whether it’s a consumer-facing mobile app or an enterprise suite, 
              LogaXP’s specialized development process ensures quality, innovation, 
              and speed-to-market—turning your ideas into world-class digital solutions.
            </p>

            <button className="relative inline-block bg-lime-400 text-gray-900 font-semibold px-6 py-3 rounded-md shadow-lg transition transform hover:scale-105 hover:shadow-2xl">
              Launch Your App with Us
            </button>
          </div>

          {/* RIGHT: fancy image card */}
          <div className="flex-1 relative">
            {/* Card background */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-xl p-4 md:p-6">
              <div className="flex flex-col gap-4">
                <img
                  src={appDevImg}
                  alt="App Development Hero"
                  className="rounded-md shadow-md w-full h-60 object-cover"
                />
                <div>
                  <h3 className="text-2xl font-bold text-lime-300 mb-2">
                    Why LogaXP for Apps?
                  </h3>
                  <p className="text-sm md:text-base text-gray-100">
                    From concept to launch, we combine user-centric design, 
                    cutting-edge tech, and agile methodologies to deliver 
                    stunning apps that delight your audience and drive growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Optional secondary image (floating) */}
            <div className="hidden lg:block absolute -bottom-10 -right-10 w-40 h-40 rotate-12 transform shadow-xl">
              <img
                src={appDevCodingImg}
                alt="Coding Visualization"
                className="w-full h-full object-cover rounded-xl ring-4 ring-purple-500 ring-opacity-80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave (SVG) */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 rotate-180">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#waveGradient2)"
            fillOpacity="1"
            d="M0,192L30,197.3C60,203,120,213,180,186.7C240,160,300,96,360,96C420,96,480,160,540,186.7C600,213,660,203,720,176C780,149,840,107,900,101.3C960,96,1020,128,1080,122.7C1140,117,1200,75,1260,53.3C1320,32,1380,32,1410,32L1440,32L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          />
          <defs>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff00d4" />
              <stop offset="50%" stopColor="#a51ce3" />
              <stop offset="100%" stopColor="#6125f5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default AppDevelopmentSegment;
