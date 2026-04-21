import { siteConfig } from '@/lib/config';

interface JsonLdProps {
  data?: any;
}

export default function JsonLd({ data }: JsonLdProps) {
  // Eğer veri verilmemişse varsayılan site SEO verilerini kullanalım
  const ldData = data || {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/logo.png`,
    "description": siteConfig.description
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ldData) }}
    />
  );
}
