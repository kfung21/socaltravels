<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { data as posts } from '../posts.data.mjs'

const filterOpen = ref(false)
const searchQuery = ref('')
const selectedTags = ref([])
const selectedTopic = ref('')
const sortBy = ref('date-desc')
const initialized = ref(false)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('q')) searchQuery.value = params.get('q')
  if (params.get('topic')) selectedTopic.value = params.get('topic')
  if (params.get('tags')) selectedTags.value = params.get('tags').split(',').filter(Boolean)
  if (params.get('sort')) sortBy.value = params.get('sort')
  if (hasActiveFilters.value) filterOpen.value = true
  initialized.value = true
})

function updateURL() {
  if (!initialized.value) return
  const params = new URLSearchParams()
  if (searchQuery.value) params.set('q', searchQuery.value)
  if (selectedTopic.value) params.set('topic', selectedTopic.value)
  if (selectedTags.value.length) params.set('tags', selectedTags.value.join(','))
  if (sortBy.value !== 'date-desc') params.set('sort', sortBy.value)
  const qs = params.toString()
  const url = window.location.pathname + (qs ? '?' + qs : '')
  window.history.replaceState({}, '', url)
}

watch([searchQuery, selectedTopic, selectedTags, sortBy], updateURL, { deep: true })

const allTags = computed(() => {
  const tags = new Set()
  posts.forEach(post => {
    if (post.frontmatter.tags) post.frontmatter.tags.forEach(t => tags.add(t))
  })
  return [...tags].sort()
})

const allTopics = computed(() => {
  const topics = new Set()
  posts.forEach(post => { if (post.frontmatter.topic) topics.add(post.frontmatter.topic) })
  return [...topics].sort()
})

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) selectedTags.value.splice(idx, 1)
  else selectedTags.value.push(tag)
}

function clearFilters() {
  searchQuery.value = ''
  selectedTags.value = []
  selectedTopic.value = ''
  sortBy.value = 'date-desc'
}

const hasActiveFilters = computed(() => searchQuery.value || selectedTags.value.length || selectedTopic.value)

const activeFilterCount = computed(() => {
  let c = 0
  if (searchQuery.value) c++
  if (selectedTopic.value) c++
  c += selectedTags.value.length
  return c
})

const filteredPosts = computed(() => {
  let result = [...posts]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.frontmatter.title?.toLowerCase().includes(q) ||
      p.frontmatter.description?.toLowerCase().includes(q) ||
      p.frontmatter.tags?.some(t => t.toLowerCase().includes(q)) ||
      p.frontmatter.topic?.toLowerCase().includes(q) ||
      p.frontmatter.location?.toLowerCase().includes(q)
    )
  }
  if (selectedTags.value.length > 0) {
    result = result.filter(p =>
      p.frontmatter.tags && selectedTags.value.every(t => p.frontmatter.tags.includes(t))
    )
  }
  if (selectedTopic.value) result = result.filter(p => p.frontmatter.topic === selectedTopic.value)
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc': return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
      case 'date-asc': return new Date(a.frontmatter.date) - new Date(b.frontmatter.date)
      case 'title-asc': return (a.frontmatter.title || '').localeCompare(b.frontmatter.title || '')
      case 'title-desc': return (b.frontmatter.title || '').localeCompare(a.frontmatter.title || '')
      default: return 0
    }
  })
  return result
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div>
    <button class="nct-filter-toggle" @click="filterOpen = !filterOpen">
      <span class="material-symbols-outlined" style="font-size: 1.1rem;">tune</span>
      Filter &amp; Sort
      <span v-if="activeFilterCount" style="background: var(--sct-teal-600); color: white; font-size: 0.7rem; padding: 0.1rem 0.45rem; border-radius: 10px; margin-left: 0.25rem;">{{ activeFilterCount }}</span>
      <span class="material-symbols-outlined chevron" :class="{ open: filterOpen }">expand_more</span>
    </button>

    <div class="nct-filter-collapse" :class="{ open: filterOpen }">
      <div class="nct-filter-collapse-inner">
        <div class="nct-filter-bar">
          <div class="nct-filter-row">
            <input v-model="searchQuery" type="text" class="nct-search-input" placeholder="Search posts..." />
            <select v-model="selectedTopic" class="nct-select">
              <option value="">All Topics</option>
              <option v-for="topic in allTopics" :key="topic" :value="topic">{{ topic }}</option>
            </select>
            <select v-model="sortBy" class="nct-select">
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
            </select>
          </div>
          <div class="nct-filter-tags" v-if="allTags.length">
            <button v-for="tag in allTags" :key="tag" :class="['nct-filter-tag', { active: selectedTags.includes(tag) }]" @click="toggleTag(tag)">{{ tag }}</button>
            <button v-if="hasActiveFilters" class="nct-filter-tag" style="color: var(--sct-red); border-color: var(--sct-red);" @click="clearFilters">✕ Clear</button>
          </div>
        </div>
      </div>
    </div>

    <div class="nct-results-count">{{ filteredPosts.length }} post{{ filteredPosts.length !== 1 ? 's' : '' }}</div>

    <div v-if="filteredPosts.length" class="nct-cards-grid">
      <a v-for="post in filteredPosts" :key="post.url" :href="post.url" class="nct-post-card">
        <img v-if="post.frontmatter.image" :src="post.frontmatter.image" :alt="post.frontmatter.title" class="nct-post-card-image" />
        <div v-else class="nct-post-card-image" style="display: flex; align-items: center; justify-content: center; color: var(--sct-teal-300);">
          <span class="material-symbols-outlined" style="font-size: 2.5rem;">article</span>
        </div>
        <div class="nct-post-card-body">
          <div class="nct-post-card-meta">
            <span>{{ formatDate(post.frontmatter.date) }}</span>
            <span v-if="post.frontmatter.topic" class="nct-tag nct-tag--topic">{{ post.frontmatter.topic }}</span>
          </div>
          <div class="nct-post-card-title">{{ post.frontmatter.title }}</div>
          <div class="nct-post-card-excerpt">{{ post.frontmatter.description }}</div>
          <div class="nct-post-card-tags" v-if="post.frontmatter.tags">
            <span v-for="tag in post.frontmatter.tags.slice(0, 3)" :key="tag" class="nct-tag">{{ tag }}</span>
          </div>
        </div>
      </a>
    </div>

    <div v-else class="nct-empty-state">
      <span class="icon material-symbols-outlined">search_off</span>
      <p>No posts match your filters.</p>
    </div>
  </div>
</template>
