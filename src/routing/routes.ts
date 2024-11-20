// src/routing/routes.ts

const routes = {
    home: '/', // Route for Home component
    allProducts: '/all-products', // Route for AllProducts component
    allPosts: '/all-posts', // Route for AllPosts component
    blogs: (id: number) => `/blogs/${id}`, // Dynamic route for individual blogs
    blogsList: '/blogs', // Route for Blogs listing
    contact: '/contact',
    // Add other routes as needed
  };
  
  export default routes;
  