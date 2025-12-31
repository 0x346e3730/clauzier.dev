import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../constants/site';

export async function GET(context) {
  // Fetch all published blog posts, sorted by date
  const posts = await getCollection('blog', ({ data }) => {
    // Filter out posts marked as draft
    return data.draft !== true;
  });

  // Sort posts by date in descending order (newest first)
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    // `<title>` field in output xml
    title: SITE_CONFIG.title,
    // `<description>` field in output xml
    description: SITE_CONFIG.description,
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Use external URL if available, otherwise use internal blog URL
      link: post.data.external?.url || `/blog/${post.slug}/`,
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`, // Set language if needed
  });
} 