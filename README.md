# SoCal Travels

Everything to see in Southern California.

A VitePress-powered destination guide covering beaches, deserts, mountains, islands, and cities across Southern California. Sister site to [NorCal Travels](https://norcaltravels.com).

**Instagram**: [@thenorcaltraveler](https://www.instagram.com/thenorcaltraveler/)  
**Powered by**: [PenPublic](https://www.penpublic.com)

---

## Quick Start

```bash
npm install
npm run dev      # dev server at localhost:5174
npm run build    # production build to .vitepress/dist/
npm run preview  # preview production build
```

---

## Project Structure

```
socaltravels/
├── .vitepress/
│   ├── config.mjs                  # Site config, nav, social links
│   └── theme/
│       ├── index.js                # Theme entry, registers Vue components
│       ├── Layout.vue              # Root layout (navbar + content + footer)
│       ├── style.css               # Beach & Desert palette
│       └── components/
│           ├── NavBar.vue          # Sticky top nav
│           ├── Footer.vue          # Footer with PenPublic credit
│           ├── LocationFilter.vue  # Explore page: filterable location grid
│           └── BlogFilter.vue      # Learnings page: filterable blog grid
│
├── explore/                        # LOCATION PAGES
│   ├── index.md                    # /explore/ — listing with LocationFilter
│   ├── locations.data.mjs          # Auto-collects location .md files
│   ├── joshua-tree.md              # Desert
│   ├── death-valley.md             # Desert
│   ├── palm-springs.md             # Desert
│   ├── anza-borrego.md             # Desert
│   ├── los-angeles.md              # Los Angeles
│   ├── malibu.md                   # Los Angeles
│   ├── san-diego.md                # San Diego
│   ├── la-jolla.md                 # San Diego
│   ├── santa-barbara.md            # Central Coast
│   ├── channel-islands.md          # Coast
│   └── big-bear.md                 # Inland Empire
│
├── learnings/                      # BLOG POSTS
│   ├── index.md                    # /learnings/ — listing with BlogFilter
│   ├── posts.data.mjs              # Auto-collects blog .md files
│   ├── joshua-tree-stargazing.md
│   ├── pch-road-trip.md
│   ├── death-valley-heat.md
│   ├── channel-islands-kayaking.md
│   ├── san-diego-tacos.md
│   └── anza-borrego-wildflowers.md
│
├── index.md                        # Home page
├── about.md                        # About page
├── resources.md                    # Resources + external links
└── README.md
```

---

## Adding Content

### New Location

Create a `.md` file in `/explore/`. Auto-appears in the listing.

```yaml
---
title: "Laguna Beach"
region: "Coast"                    # Los Angeles | San Diego | Desert | Coast | Inland Empire | Central Coast
type: "Beach Town"
tags: [beaches, art, tide-pools]
description: "Short card description."
coverImage: "https://r2.socaltravels.com/explore/laguna/hero.jpg"
alltrails_url: "https://www.alltrails.com/..."
---
```

**Regions**: Los Angeles, San Diego, Desert, Coast, Inland Empire, Central Coast

**Region badge classes**: `nct-region-los-angeles`, `nct-region-san-diego`, `nct-region-desert`, `nct-region-coast`, `nct-region-inland-empire`, `nct-region-central-coast`

### New Blog Post

Create a `.md` file in `/learnings/`. Auto-appears in the listing.

```yaml
---
title: "Post Title"
date: 2026-02-13
topic: Desert
location: "Joshua Tree"
tags: [desert, stargazing]
description: "Short card description."
image: "https://r2.socaltravels.com/blog/post-slug/cover.jpg"
---
```

---

## Images — Cloudflare R2

```
socaltravels-media/
├── explore/{location-slug}/hero.jpg, 01.jpg, 02.jpg...
├── blog/{post-slug}/cover.jpg, 01.jpg...
└── site/og-image.jpg, favicon.png
```

Image sizes: Card covers 800×500px (<200KB), gallery 1200×800px (<400KB).

---

## Theme

**Palette**: Beach & Desert — ocean teal, warm sand, sunset coral.

```css
--sct-teal-600: #21767a;     /* Primary teal */
--sct-coral-600: #d4603b;    /* Accent coral */
--sct-sand-100: #f5ede0;     /* Sand tones */
--sct-warm-50: #f8f7f4;      /* Background */
--sct-teal-900: #0c2e30;     /* Footer dark */
```

---

## Deployment

```bash
npm run build
# Deploy .vitepress/dist/ to Cloudflare Pages, Netlify, Vercel, etc.
```

---

## License

Content and photos © SoCal Travels. Site code MIT.
