// src/pages/Home/Home.tsx

import React from 'react';
import Hero from '../../components/Hero/Hero';
import Trusts from '../../components/Trusts/Trusts';
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts';
import Blogs from '../../components/Blogs/Blogs';
import FooterAction from '../../components/FooterAction/FooterAction';
import OurBusiness from '../../components/OurBusiness/OurBusiness';


const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
    
      <main className="flex-grow">
        <Hero />
        <Trusts />
        <FeaturedProducts />
        <OurBusiness />
        <Blogs />
        <FooterAction />
      </main>
     
    </div>
  );
};

export default Home;
