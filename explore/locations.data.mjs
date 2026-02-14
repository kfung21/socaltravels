// explore/locations.data.mjs
// Collects all .md location pages in /explore/ at build time
import { createContentLoader } from 'vitepress'

export default createContentLoader('explore/*.md', {
  includeSrc: false,
  render: false,
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter(page => !page.url.endsWith('/explore/'))
      .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''))
  }
})
