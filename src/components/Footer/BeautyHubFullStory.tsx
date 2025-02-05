import React from 'react';

const BeautyHubFullStory: React.FC = () => {
  return (
    <article className="min-h-screen bg-gradient-to-b from-[#6d1a1a] via-[#5c1414] to-[#3e0d0d] text-white px-6 md:px-12 py-16">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover BeautyHub</h1>
        <p className="text-sm md:text-base leading-relaxed">
          At <strong>BeautyHub</strong>, we believe in a world where self-care is
          accessible, enjoyable, and flawlessly orchestrated. Our story began
          with a simple observation: the beauty industry was vast, but fragmented. 
          Clients had to juggle multiple apps, calls, and booking methods just to 
          secure a single appointment. Meanwhile, talented beauticians and 
          stylists struggled to manage their schedules and payments effectively.
        </p>
        <p className="text-sm md:text-base leading-relaxed">
          From this challenge, our <em>all-in-one SaaS platform</em> was born. 
          With BeautyHub, professionals can showcase their portfolios, set up 
          services, and streamline bookings—while clients explore, compare, and 
          book with just a few taps. We handle the complexities of 
          <strong> secure payments</strong>, <strong>auto-confirmation</strong>, 
          and even a <strong>no-show fee</strong> policy to protect your 
          valuable time.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mt-8">Key Features</h2>
        
        <div className="space-y-4">
          <section>
            <h3 className="text-xl font-semibold text-pink-200">1. Unified Marketplace</h3>
            <p className="text-sm md:text-base leading-relaxed">
              Explore a curated selection of hairstylists, nail artists, 
              estheticians, and more—all in one place. Filter by specialty, 
              location, or price point to find your ideal match.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-pink-200">2. Seamless Bookings</h3>
            <p className="text-sm md:text-base leading-relaxed">
              Real-time calendar sync ensures that both clients and pros 
              can see availability at a glance. Book instantly—no back-and-forth 
              phone calls needed.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-pink-200">3. Secure Payments &amp; No-Show Fees</h3>
            <p className="text-sm md:text-base leading-relaxed">
              Worry less about last-minute cancellations. Clients place 
              card details on file, with built-in deposit or no-show fee 
              options. All transactions are secured with best-in-class 
              encryption.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-pink-200">4. Automated Reminders &amp; Reviews</h3>
            <p className="text-sm md:text-base leading-relaxed">
              Never miss an appointment again. Automatic notifications 
              keep everyone updated, while post-service reviews help 
              users discover top-rated professionals in the community.
            </p>
          </section>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mt-8">Our Vision</h2>
        <p className="text-sm md:text-base leading-relaxed">
          BeautyHub is more than a scheduling tool—it’s a vibrant 
          ecosystem where individuality and creativity are celebrated. 
          By connecting clients to passionate beauty experts, we foster 
          an environment of shared inspiration and growth. Our commitment 
          to continuous improvement drives us to integrate advanced 
          technologies, from AI-driven personalization to live streaming 
          tutorials, all in pursuit of one goal: reimagining how people 
          discover, experience, and enjoy beauty services.
        </p>

        <p className="text-sm md:text-base leading-relaxed">
          Join us on this journey. Whether you’re a professional seeking 
          to expand your clientele or a self-care enthusiast in search 
          of the perfect glow, <strong>BeautyHub</strong> is your trusted 
          companion—empowering every individual to shine their way.
        </p>

        <div className="mt-10">
          <a
            href="/"
            className="inline-block bg-gray-100 text-gray-900 font-semibold px-5 py-2 rounded-md shadow hover:bg-gray-200 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    </article>
  );
};

export default BeautyHubFullStory;
