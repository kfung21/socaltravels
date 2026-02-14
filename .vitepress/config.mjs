import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "SoCal Travels",
  description: "Everything to see in Southern California",

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap', rel: 'stylesheet' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300', rel: 'stylesheet' }],
  ],

  // ============================================================
  // ROUTING — File-based routing from project root
  //
  //   File Path                         →  URL Route
  //   ──────────────────────────────────────────────────
  //   index.md                          →  /
  //   about.md                          →  /about
  //   resources.md                      →  /resources
  //   explore/index.md                  →  /explore/
  //   explore/joshua-tree.md            →  /explore/joshua-tree
  //   learnings/index.md                →  /learnings/
  //   learnings/some-post.md            →  /learnings/some-post
  // ============================================================

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Explore', link: '/explore/' },
      { text: 'Learnings', link: '/learnings/' },
      { text: 'Resources', link: '/resources' },
      { text: 'About', link: '/about' },
    ],

    socialLinks: [
      { icon: 'instagram', link: 'https://www.instagram.com/thenorcaltraveler/' }
    ]
  },
})
