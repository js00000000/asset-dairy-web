// Site-wide configuration for branding, navigation, and theme
export const siteConfig = {
  name: 'Asset Dairy',
  description: 'Your modern finance companion. Effortlessly log daily expenses, income, and transfers. Track your stock and crypto portfolios—all in one beautiful dashboard.',
  logoUrl: '', // Add your logo URL or icon component
  nav: [
    { label: 'Home', href: '/' },
    // Add more navigation items as needed
  ],
  footer: {
    sections: [
      {
        label: 'Home',
        links: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        label: 'Help',
        links: [
          { label: 'FAQ', href: '/faq' },
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
