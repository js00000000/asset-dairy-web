import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import siteConfig from '../../config/site.config';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              {siteConfig.logoUrl ? (
                <img src={siteConfig.logoUrl} alt={siteConfig.name} className="h-7 w-7 object-contain" />
              ) : (
                <LucideIcons.ShoppingBag className="h-7 w-7 text-primary-500" />
              )}
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex space-x-4">
              {/* Type-safe icon mapping to avoid TS errors */}
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
          </div>
          {/* Dynamically render all footer sections from config */}
          {siteConfig.footer.sections.map((section) => (
            <div key={section.label}>
              <h3 className="text-sm font-semibold uppercase tracking-wider">{section.label}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              {siteConfig.footer.sections
                .find((section) => section.label === 'Legal')?.links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;