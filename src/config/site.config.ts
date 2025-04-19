// Site-wide configuration for branding, navigation, and theme
export const siteConfig = {
  name: 'Elite',
  description: 'A reusable template for any website',
  logoUrl: '', // Add your logo URL or icon component
  nav: [
    { label: 'Home', href: '/' },
    // Add more navigation items as needed
  ],
  footer: {
    sections: [
      {
        label: 'Shop',
        links: [
          { label: 'All Products', href: '/shop' },
          { label: 'Categories', href: '/categories' },
          { label: 'Featured Products', href: '/featured' },
          { label: 'New Arrivals', href: '/new-arrivals' },
          { label: 'Special Deals', href: '/deals' },
        ],
      },
      {
        label: 'Account',
        links: [
          { label: 'Sign In', href: '/login' },
          { label: 'Create Account', href: '/register' },
          { label: 'Orders', href: '/orders' },
          { label: 'Wishlist', href: '/wishlist' },
          { label: 'Profile', href: '/account' },
        ],
      },
      {
        label: 'Help',
        links: [
          { label: 'FAQ', href: '/faq' },
          { label: 'Shipping', href: '/shipping' },
          { label: 'Returns', href: '/returns' },
          { label: 'Contact Us', href: '/contact' },
          { label: 'Privacy Policy', href: '/privacy' },
        ],
      },
      {
        label: 'Legal',
        links: [
          { label: 'Terms', href: '/terms' },
          { label: 'Privacy', href: '/privacy' },
          { label: 'Cookies', href: '/cookies' },
        ],
      },
    ],
    socials: [
      { label: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
      { label: 'Instagram', href: 'https://instagram.com/', icon: 'instagram' },
      { label: 'Twitter', href: 'https://twitter.com/', icon: 'twitter' },
      { label: 'Mail', href: 'mailto:info@example.com', icon: 'mail' },
    ],
  },
  theme: {
    primaryColor: '#2563eb', // Tailwind blue-600
    secondaryColor: '#f59e42', // Tailwind orange-400
    // Add more theme variables as needed
  },
};

export default siteConfig;
