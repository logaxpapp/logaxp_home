// src/routing/routes.ts

const routes = {
  home: '/', // Route for Home component
  allProducts: '/all-products', // Route for AllProducts component
  allPosts: '/all-posts', // Route for AllPosts component
  blogs: (id: number) => `/blogs/${id}`, // Dynamic route for individual blogs
  blogsList: '/blogs', // Route for Blogs listing
  contact: '/contact', // Route for Contact page

  // **New Service Routes**
  services: '/services', // Route for Services listing (optional)
  serviceDetail: (id: string) => `/services/${id}`, // Dynamic route for individual service details
};

export default routes;
