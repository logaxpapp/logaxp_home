import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="mt-16 bg-gradient-to-r from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 font-primary tracking-wide">
          About Us
        </h2>
        <div className="mt-8 space-y-8 text-gray-700 dark:text-gray-300 text-left leading-relaxed">
          {/* Paragraphs */}
          <p className="text-lg">
            In the vibrant year of 2021,{" "}
            <strong className="dark:text-white">
              Loga<span className="text-lemonGreen">XP</span>
            </strong>{" "}
            emerged as the brainchild of a dynamic young professional driven by a shared vision: to
            redefine and elevate the productivity landscape for businesses. Founded with a passion
            for innovation and a commitment to enhancing employee efficiency,{" "}
            <strong className="dark:text-white">
              Loga<span className="text-lemonGreen">XP</span>
            </strong>{" "}
            set out on a journey to revolutionize human resources productivity.
          </p>
          <p className="text-lg">
            What began as a visionary idea has now evolved into a thriving company with a team of
            over 10 dedicated professionals.{" "}
            <strong className="dark:text-white">
              Loga<span className="text-lemonGreen">XP</span>
            </strong>{" "}
            specializes in developing cutting-edge HR productivity applications tailored to meet the
            diverse needs of modern businesses. Our journey has been marked by relentless
            dedication, constant evolution, and a commitment to delivering solutions that empower
            organizations.
          </p>
          <p className="text-lg">
            As we continue to grow, innovate, and push boundaries,{" "}
            <strong className="dark:text-white">
              Loga<span className="text-lemonGreen">XP</span>
            </strong>{" "}
            is not just a company; it's a testament to the power of passion and the pursuit of
            excellence. With an additional 5 products in development, we are excited about the
            future and the impact our solutions will have on businesses globally.
          </p>
          <p className="text-lg">
            Join us on this journey of transformation and productivity.{" "}
            <strong className="dark:text-white">
              Loga<span className="text-lemonGreen">XP</span>
            </strong>{" "}
            - Where Innovation Meets Efficiency.
          </p>
        </div>

        {/* Decorative Line */}
        <div className="mt-12">
          <div className="h-1 w-40 mx-auto bg-lemonGreen-light dark:bg-lemonGreen rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
