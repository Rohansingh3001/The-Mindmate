import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'The MindMates - Mental Health Support & Therapy Platform in India',
  description = 'The MindMates offers professional online mental health counseling, therapy, and peer support in India. Connect with licensed therapists, track your mood, and join supportive communities. Available 24/7 for anxiety, depression, stress management.',
  keywords = 'mental health India, online therapy India, counseling services, mental health support, depression help, anxiety treatment, online psychologist India, mental wellness, peer support, mood tracker, mental health app, teletherapy India, emotional wellbeing, stress management, therapy online',
  author = 'The MindMates',
  url = 'https://themindmates.in',
  image = 'https://themindmates.in/og-image.jpg',
  type = 'website',
  canonicalUrl,
  article = false,
  publishedDate,
  modifiedDate,
  schema,
}) => {
  const pageUrl = canonicalUrl || url;
  const pageTitle = title.includes('MindMates') ? title : `${title} | The MindMates`;

  // Default structured data for Organization
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The MindMates',
    url: 'https://themindmates.in',
    logo: 'https://themindmates.in/logo.svg',
    description: 'Professional mental health support and therapy platform in India',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      // Add your social media profiles here
      'https://www.facebook.com/themindmates',
      'https://twitter.com/themindmates',
      'https://www.instagram.com/themindmates',
      'https://www.linkedin.com/company/themindmates',
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="The MindMates" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />

      {article && publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {article && modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      {article && (
        <meta property="article:section" content="Mental Health" />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@themindmates" />
      <meta name="twitter:site" content="@themindmates" />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Geo Tags for India */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Mobile Optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#9333ea" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
