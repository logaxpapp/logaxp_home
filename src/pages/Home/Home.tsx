import React from 'react';
import Hero from '../../components/Hero/Hero';
import Trusts from '../../components/Trusts/Trusts';
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts';
import Blogs from '../../components/Blogs/Blogs';
import FooterAction from '../../components/FooterAction/FooterAction';
import OurBusiness from '../../components/OurBusiness/OurBusiness';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Page Content */}
      <main className="flex-grow space-y-2">
        {/* Hero Section */}
        <Hero />
        
        {/* Trusts Section */}
        <section id="trusts" className="bg-gray-100 dark:bg-gray-900 py-10">
          <Trusts />
        </section>

        {/* Featured Products Section */}
        <section id="featured-products" className="bg-gray-50 dark:bg-gray-800 py-16">
          <FeaturedProducts />
        </section>

        {/* Our Business Section */}
        <section id="our-business" className=" dark:bg-gray-900 py-16">
          <OurBusiness />
        </section>

        {/* Blogs Section */}
        <section id="blogs" className="dark:bg-gray-800 py-16">
          <Blogs />
        </section>

        {/* Footer Call-to-Action */}
        <section id="footer-action" className="bg-gray-100 dark:bg-gray-900 py-16">
          <FooterAction />
        </section>
      </main>
    </div>
  );
};

export default Home;
