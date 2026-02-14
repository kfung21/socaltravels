import Layout from './Layout.vue'
import './style.css'
import BlogFilter from './components/BlogFilter.vue'
import LocationFilter from './components/LocationFilter.vue'

/** @type {import('vitepress').Theme} */
export default {
  Layout,
  enhanceApp({ app }) {
    app.component('BlogFilter', BlogFilter)
    app.component('LocationFilter', LocationFilter)
  }
}
