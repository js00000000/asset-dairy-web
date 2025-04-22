// Site-wide configuration for branding, navigation, and theme
export const siteConfig = {
  name: 'Asset Dairy',
  description: 'Your modern finance companion. Effortlessly log daily expenses, income, and transfers. Track your stock and crypto portfolios—all in one beautiful dashboard.',
  logoUrl: '', // Add your logo URL or icon component
  nav: [
    { label: 'Accounts', href: '/accounts' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Trades', href: '/trades' },
    // Add more navigation items as needed
  ],
  footer: {
    socials: [
      { label: 'Facebook', href: 'https://facebook.com/', icon: 'Facebook' },
      { label: 'Instagram', href: 'https://instagram.com/', icon: 'Instagram' },
      { label: 'Twitter', href: 'https://twitter.com/', icon: 'Twitter' },
      { label: 'Mail', href: 'mailto:info@example.com', icon: 'Mail' },
    ],
  },
  theme: {
    primaryColor: '#2563eb', // Tailwind blue-600
    secondaryColor: '#f59e42', // Tailwind orange-400
    // Add more theme variables as needed
  },
};

export default siteConfig;
