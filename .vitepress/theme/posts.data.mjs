import { createContentLoader } from 'vitepress'

export default createContentLoader('learnings/*.md', {
  includeSrc: false,
  render: false,
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter(page => !page.url.endsWith('/learnings/'))
      .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
  }
})
