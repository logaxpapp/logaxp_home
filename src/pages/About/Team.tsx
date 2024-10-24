import React from 'react';
import Chris from '../../assets/images/chris.png';
import Gerald from '../../assets/images/gerry.jpg';
import Rabi from '../../assets/images/rabi.png';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Christopher Adebajo',
    role: 'Founder',
    image: Chris,
    description: 'A seasoned IT expert specializing in DevOps and software development, driving innovation in the tech industry.',
  },
  {
    name: 'Gerald Emeka',
    role: 'Co-Founder',
    image: Gerald,
    description: 'Expert in cybersecurity and business analysis, shaping our security strategies.',
  },
  {
    name: 'Ndaisah Umar Rabi',
    role: 'Executive Director of Development',
    image: Rabi,
    description: 'Highly knowledgeable in designing scalable solutions that meet standards across web, mobile, and standalone platforms.',
  },
  // Add more team members as needed
];

const Team: React.FC = () => {
  return (
    <section className="mt-16 bg-white py-12 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-base text-lemonGreen-light font-semibold tracking-wide uppercase">Our Team</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold text-gray-900 dark:text-gray-100">
            Meet the People Behind LogaXP
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
            Our dedicated team works tirelessly to bring innovation and excellence to everything we do.
          </p>
        </div>

        {/* Team Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                className="mx-auto h-32 w-32 rounded-full object-cover border-2 border-lemonGreen-light"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{member.name}</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">{member.role}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
