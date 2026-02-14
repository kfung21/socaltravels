<script setup>
import { useData, useRoute } from 'vitepress'
import { ref, computed } from 'vue'

const { theme } = useData()
const route = useRoute()
const mobileOpen = ref(false)

const navLinks = computed(() => theme.value.nav || [])

function isActive(link) {
  if (link === '/') return route.path === '/' || route.path === '/index.html'
  return route.path.startsWith(link)
}
</script>

<template>
  <nav class="nct-navbar">
    <a href="/" class="nct-navbar-brand">
      <span class="icon material-symbols-outlined">wb_sunny</span>
      <span>SoCal Travels</span>
    </a>

    <button class="nct-navbar-mobile-toggle" @click="mobileOpen = !mobileOpen">
      <span class="material-symbols-outlined">{{ mobileOpen ? 'close' : 'menu' }}</span>
    </button>

    <ul class="nct-navbar-links" :class="{ open: mobileOpen }">
      <li v-for="link in navLinks" :key="link.link">
        <a :href="link.link" :class="{ active: isActive(link.link) }" @click="mobileOpen = false">{{ link.text }}</a>
      </li>
    </ul>
  </nav>
</template>
