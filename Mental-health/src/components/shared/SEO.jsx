import React, { useEffect } from 'react';

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

  useEffect(() => {
    // Update document title
    document.title = pageTitle;
    
    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    
    // Open Graph tags
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', pageUrl, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:type', type, true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageUrl);
    
    // Article meta tags
    if (article && publishedDate) {
      updateMetaTag('article:published_time', publishedDate, true);
    }
    if (article && modifiedDate) {
      updateMetaTag('article:modified_time', modifiedDate, true);
    }
    
    // Schema.org structured data
    if (schema) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    }
  }, [pageTitle, description, keywords, author, pageUrl, image, type, article, publishedDate, modifiedDate, schema]);

  return null;
};

export default SEO;
