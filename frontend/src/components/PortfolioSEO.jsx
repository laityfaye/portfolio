/**
 * Met à jour les meta tags dynamiquement pour chaque portfolio.
 * Permet aux moteurs de recherche (et aux robots qui exécutent le JS) d'afficher
 * le nom du propriétaire dans les résultats de recherche.
 */
import { useEffect } from 'react';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/p`;
  }
  return 'https://innosft.com/p';
};

const PortfolioSEO = ({ data, slug }) => {
  const portfolio = data?.data || data || {};
  const displayName = portfolio.display_name || portfolio.user?.first_name || 'Portfolio';
  const jobTitle = portfolio.job_title || '';
  const description = portfolio.hero_description || portfolio.about_paragraph_1 || '';
  const profileImage = portfolio.profile_image;

  const fullName = typeof displayName === 'string' && displayName
    ? displayName
    : `${portfolio.user?.first_name || ''} ${portfolio.user?.last_name || ''}`.trim() || 'Portfolio';

  const metaDescription = description
    ? `${description.slice(0, 155)}${description.length > 155 ? '...' : ''}`
    : `Portfolio de ${fullName}${jobTitle ? ` - ${jobTitle}` : ''}. Découvrez les projets et compétences.`;

  const baseUrl = getBaseUrl();
  const pageTitle = `${fullName}${jobTitle ? ` - ${jobTitle}` : ''} | Portfolio InnoSoft`;
  const pageUrl = slug ? `${baseUrl}/${slug}` : baseUrl;
  const ogImage = profileImage || `${baseUrl}/images/INNOSOFT%20CREATION.png`;

  useEffect(() => {
    document.title = pageTitle;

    const setMeta = (attr, value, content) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr === 'name' ? 'name' : 'property', value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', metaDescription);
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', metaDescription);
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:type', 'profile');
    setMeta('property', 'twitter:card', 'summary_large_image');
    setMeta('property', 'twitter:title', pageTitle);
    setMeta('property', 'twitter:description', metaDescription);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);

    // JSON-LD Person pour le référencement par nom
    let jsonLd = document.getElementById('portfolio-jsonld');
    if (jsonLd) jsonLd.remove();
    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: fullName,
      jobTitle: jobTitle || undefined,
      description: metaDescription,
      url: pageUrl,
      image: ogImage,
    };
    jsonLd = document.createElement('script');
    jsonLd.id = 'portfolio-jsonld';
    jsonLd.type = 'application/ld+json';
    jsonLd.textContent = JSON.stringify(personSchema);
    document.head.appendChild(jsonLd);

    return () => {
      document.title = 'InnoSoft Portfolio – Créer votre portfolio en ligne en quelques minutes';
      const el = document.getElementById('portfolio-jsonld');
      if (el) el.remove();
    };
  }, [pageTitle, metaDescription, pageUrl, ogImage, fullName, jobTitle]);

  return null;
};

export default PortfolioSEO;
