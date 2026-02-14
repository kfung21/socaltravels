// learnings/posts.data.mjs
// VitePress Content Loader - collects all .md posts in /learnings/ at build time
// These are then available to Vue components via `import { data } from './posts.data.mjs'`
import { createContentLoader } from 'vitepress'

export default createContentLoader('learnings/*.md', {
  // Include frontmatter and excerpt
  includeSrc: false,
  render: false,
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter(page => !page.url.endsWith('/learnings/')) // exclude index
      .sort((a, b) => {
        return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
      })
  }
})
