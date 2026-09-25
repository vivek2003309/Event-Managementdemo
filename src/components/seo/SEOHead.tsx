/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Dynamic SEO Head Management Component
 * Automatically synchronizes document title, meta description, OpenGraph cards,
 * Twitter cards, canonical URLs, and dynamic Schema.org JSON-LD structured data.
 */

import React, { useEffect } from 'react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string[];
  schemaMarkup?: Record<string, any> | Record<string, any>[];
  breadcrumbs?: BreadcrumbItem[];
}

const DEFAULT_OG_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhgCm9ZrEDg6KYSpAIRW97aUMXzF_MAI_kz1JBmuTVNtAUhFVQHyXWEo2H-Vyuem5DV0vbzLZnoSXsnObmjJKxZo97Aytz2ELGYGHHx0K80lyZOStW5lO6a5ABPht7YIG4_tQKVJbMtP-EhT15IIA-pITfdvhRtNWELUraLpoc-rSTyON9hth_1w8j-9HbmopU-bqvv_19qjyLILM_BXNRXsiiMwaVxDNTJ0MZe67wTIc-Esgn823I_w';

const SITE_NAME = 'The Wedding Dreams';
const DOMAIN = 'https://theweddingdreams.com';

function setMetaTag(selector: string, attributeName: string, attributeValue: string, content: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = [
    'luxury wedding planner',
    'destination weddings india',
    'udaipur palace wedding',
    'jaipur royal wedding',
    'bespoke scenography',
    'the wedding dreams',
  ],
  schemaMarkup,
  breadcrumbs,
}) => {
  useEffect(() => {
    // 1. Format branded document title
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    // 2. Primary Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));
    setMetaTag('meta[name="author"]', 'name', 'author', 'The Wedding Dreams Directorship');

    // 3. OpenGraph Social Tags
    const resolvedUrl =
      canonicalUrl || (typeof window !== 'undefined' ? window.location.href : DOMAIN);

    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', resolvedUrl);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', fullTitle);

    // 4. Twitter / X Social Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', twitterCard);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', '@theweddingdreams');
    setMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@theweddingdreams');

    // 5. Canonical Link
    setLinkTag('canonical', resolvedUrl);

    // 6. Dynamic Schema.org JSON-LD Markup
    const scriptId = 'dynamic-seo-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemasToInject: any[] = [];

    // Optional breadcrumb schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemasToInject.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: b.url.startsWith('http') ? b.url : `${DOMAIN}${b.url}`,
        })),
      });
    }

    // Specific custom schema markup (e.g. Service or Event)
    if (schemaMarkup) {
      if (Array.isArray(schemaMarkup)) {
        schemasToInject.push(...schemaMarkup);
      } else {
        schemasToInject.push(schemaMarkup);
      }
    }

    if (schemasToInject.length > 0) {
      scriptTag.textContent = JSON.stringify(
        schemasToInject.length === 1 ? schemasToInject[0] : schemasToInject
      );
    } else {
      scriptTag.textContent = '';
    }

    // Clean up dynamic schema when unmounting
    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType,
    twitterCard,
    keywords,
    schemaMarkup,
    breadcrumbs,
  ]);

  return null;
};
