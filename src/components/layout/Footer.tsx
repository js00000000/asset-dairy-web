import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import siteConfig from '../../config/site.config';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <Link to="/" className="flex items-center space-x-2">
          {siteConfig.logoUrl ? (
            <img src={siteConfig.logoUrl} alt={siteConfig.name} className="h-7 w-7 object-contain" />
          ) : (
            <LucideIcons.ShoppingBag className="h-7 w-7 text-primary-500" />
          )}
          <span className="text-xl font-bold tracking-tight">{siteConfig.name}</span>
        </Link>
        {siteConfig.description && (
          <p className="mt-2 text-sm text-gray-400 text-center max-w-lg">{siteConfig.description}</p>
        )}
        {siteConfig.footer?.socials?.length > 0 && (
          <div className="mt-4 flex space-x-4">
            {siteConfig.footer.socials.map((social) => {
              const iconMap: Record<string, React.ComponentType<LucideProps>> = {
                Facebook: LucideIcons.Facebook,
                Instagram: LucideIcons.Instagram,
                Twitter: LucideIcons.Twitter,
                Mail: LucideIcons.Mail,
              };
              const Icon = iconMap[social.icon.charAt(0).toUpperCase() + social.icon.slice(1)] || LucideIcons.Globe;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        )}
        <p className="mt-6 text-xs text-gray-500 text-center">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;