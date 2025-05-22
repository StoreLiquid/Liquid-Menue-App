import React from 'react';
import Head from 'next/head';

interface HeaderProps {
  isPwa: boolean;
  title?: string;
  description?: string;
}

/**
 * Header-Komponente für die App
 * Enthält Meta-Tags, Titel und SEO-Informationen
 */
const Header: React.FC<HeaderProps> = ({ 
  isPwa, 
  title = "Liquid Menü", 
  description = "E-Liquid Produktkatalog" 
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content={isPwa ? "#3a2a5a" : "#1A1820"} />
        <meta name="background-color" content={isPwa ? "#3a2a5a" : "#1A1820"} />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      
      <div className="flex flex-col items-center justify-center mb-8">
        {/* Logo mit Cache-Busting-Parameter */}
        <img 
          src={`/Liquid-Menue.svg?v=${new Date().getTime()}`}
          alt="Liquid Menü Logo"
          className="w-64 h-40 mb-4 filter drop-shadow-xl"
        />
        <p className="text-gray-300 text-center mb-2">
          {description}
        </p>
      </div>
    </>
  );
};

export default Header; 