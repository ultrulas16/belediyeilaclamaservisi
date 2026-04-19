import { MetadataRoute } from 'next';
import { services } from '@/lib/services';
import { cities } from '@/lib/regions';
import { blogPosts } from '@/lib/blog-data';
import { siteConfig } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Manual main pages
  const routes = ['', '/hakkimizda', '/hizmetler', '/bolgeler', '/sss', '/kvkk', '/iletisim', '/blog'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  // Dynamic service pages
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/hizmetler/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic region pages
  const regionRoutes = cities.flatMap((city) => 
    city.districts.map((district) => ({
      url: `${baseUrl}/bolgeler/${district.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  // Dynamic blog pages
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...serviceRoutes, ...regionRoutes, ...blogRoutes];
}
