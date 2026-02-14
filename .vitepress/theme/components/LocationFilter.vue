<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { data as locations } from '../../../explore/locations.data.mjs'

const filterOpen = ref(false)
const searchQuery = ref('')
const selectedRegion = ref('')
const selectedType = ref('')
const selectedTags = ref([])
const sortBy = ref('title-asc')
const initialized = ref(false)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('q')) searchQuery.value = params.get('q')
  if (params.get('region')) selectedRegion.value = params.get('region')
  if (params.get('type')) selectedType.value = params.get('type')
  if (params.get('tags')) selectedTags.value = params.get('tags').split(',').filter(Boolean)
  if (params.get('sort')) sortBy.value = params.get('sort')
  if (hasActiveFilters.value) filterOpen.value = true
  initialized.value = true
})

function updateURL() {
  if (!initialized.value) return
  const params = new URLSearchParams()
  if (searchQuery.value) params.set('q', searchQuery.value)
  if (selectedRegion.value) params.set('region', selectedRegion.value)
  if (selectedType.value) params.set('type', selectedType.value)
  if (selectedTags.value.length) params.set('tags', selectedTags.value.join(','))
  if (sortBy.value !== 'title-asc') params.set('sort', sortBy.value)
  const qs = params.toString()
  const url = window.location.pathname + (qs ? '?' + qs : '')
  window.history.replaceState({}, '', url)
}

watch([searchQuery, selectedRegion, selectedType, selectedTags, sortBy], updateURL, { deep: true })

const allRegions = computed(() => {
  const r = new Set()
  locations.forEach(loc => { if (loc.frontmatter.region) r.add(loc.frontmatter.region) })
  return [...r].sort()
})

const allTypes = computed(() => {
  const t = new Set()
  locations.forEach(loc => { if (loc.frontmatter.type) t.add(loc.frontmatter.type) })
  return [...t].sort()
})

const allTags = computed(() => {
  const tags = new Set()
  locations.forEach(loc => {
    if (loc.frontmatter.tags) loc.frontmatter.tags.forEach(t => tags.add(t))
  })
  return [...tags].sort()
})

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) selectedTags.value.splice(idx, 1)
  else selectedTags.value.push(tag)
}

function clearFilters() {
  searchQuery.value = ''
  selectedRegion.value = ''
  selectedType.value = ''
  selectedTags.value = []
  sortBy.value = 'title-asc'
}

const hasActiveFilters = computed(() =>
  searchQuery.value || selectedRegion.value || selectedType.value || selectedTags.value.length
)

const activeFilterCount = computed(() => {
  let c = 0
  if (searchQuery.value) c++
  if (selectedRegion.value) c++
  if (selectedType.value) c++
  c += selectedTags.value.length
  return c
})

const filteredLocations = computed(() => {
  let result = [...locations]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(loc =>
      loc.frontmatter.title?.toLowerCase().includes(q) ||
      loc.frontmatter.description?.toLowerCase().includes(q) ||
      loc.frontmatter.region?.toLowerCase().includes(q) ||
      loc.frontmatter.type?.toLowerCase().includes(q) ||
      loc.frontmatter.tags?.some(t => t.toLowerCase().includes(q))
    )
  }
  if (selectedRegion.value) result = result.filter(loc => loc.frontmatter.region === selectedRegion.value)
  if (selectedType.value) result = result.filter(loc => loc.frontmatter.type === selectedType.value)
  if (selectedTags.value.length > 0) {
    result = result.filter(loc =>
      loc.frontmatter.tags && selectedTags.value.every(t => loc.frontmatter.tags.includes(t))
    )
  }
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'title-asc': return (a.frontmatter.title || '').localeCompare(b.frontmatter.title || '')
      case 'title-desc': return (b.frontmatter.title || '').localeCompare(a.frontmatter.title || '')
      case 'region': return (a.frontmatter.region || '').localeCompare(b.frontmatter.region || '')
      default: return 0
    }
  })
  return result
})

function regionClass(region) {
  if (!region) return ''
  return `nct-region-${region.toLowerCase().replace(/\s+/g, '-')}`
}

const regionGradients = {
  'Los Angeles': 'linear-gradient(135deg, #d4603b 0%, #e07850 100%)',
  'San Diego': 'linear-gradient(135deg, #21767a 0%, #3db0b5 100%)',
  'Desert': 'linear-gradient(135deg, #b89460 0%, #ccab7c 100%)',
  'Coast': 'linear-gradient(135deg, #3db0b5 0%, #6dcdd1 100%)',
  'Inland Empire': 'linear-gradient(135deg, #8b6b3a 0%, #a88a55 100%)',
  'Central Coast': 'linear-gradient(135deg, #1a5c5e 0%, #289196 100%)',
  'Channel Islands': 'linear-gradient(135deg, #21767a 0%, #3db0b5 100%)',
}
function getGradient(region) { return regionGradients[region] || 'linear-gradient(135deg, #d4603b, #3db0b5)' }

const regionIcons = {
  'Los Angeles': 'location_city', 'San Diego': 'beach_access', 'Desert': 'wb_sunny',
  'Coast': 'waves', 'Inland Empire': 'terrain', 'Central Coast': 'sailing', 'Channel Islands': 'island',
}
function getIcon(region) { return regionIcons[region] || 'place' }
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
            <input v-model="searchQuery" type="text" class="nct-search-input" placeholder="Search destinations..." />
            <select v-model="selectedRegion" class="nct-select">
              <option value="">All Regions</option>
              <option v-for="r in allRegions" :key="r" :value="r">{{ r }}</option>
            </select>
            <select v-model="selectedType" class="nct-select">
              <option value="">All Types</option>
              <option v-for="t in allTypes" :key="t" :value="t">{{ t }}</option>
            </select>
            <select v-model="sortBy" class="nct-select">
              <option value="title-asc">Name A–Z</option>
              <option value="title-desc">Name Z–A</option>
              <option value="region">By Region</option>
            </select>
          </div>
          <div class="nct-filter-tags" v-if="allTags.length">
            <button v-for="tag in allTags" :key="tag" :class="['nct-filter-tag', { active: selectedTags.includes(tag) }]" @click="toggleTag(tag)">{{ tag }}</button>
            <button v-if="hasActiveFilters" class="nct-filter-tag" style="color: var(--sct-red); border-color: var(--sct-red);" @click="clearFilters">✕ Clear</button>
          </div>
        </div>
      </div>
    </div>

    <div class="nct-results-count">{{ filteredLocations.length }} destination{{ filteredLocations.length !== 1 ? 's' : '' }}</div>

    <div v-if="filteredLocations.length" class="nct-cards-grid">
      <a v-for="loc in filteredLocations" :key="loc.url" :href="loc.url" class="nct-location-card">
        <img v-if="loc.frontmatter.coverImage" :src="loc.frontmatter.coverImage" :alt="loc.frontmatter.title" class="nct-location-card-image" />
        <div v-else class="nct-location-card-image-placeholder" :style="{ background: getGradient(loc.frontmatter.region) }">
          <span class="material-symbols-outlined" style="font-size: 2.8rem;">{{ getIcon(loc.frontmatter.region) }}</span>
        </div>
        <div class="nct-location-card-body">
          <span :class="['nct-location-card-region', regionClass(loc.frontmatter.region)]">{{ loc.frontmatter.region }}</span>
          <div class="nct-location-card-title">{{ loc.frontmatter.title }}</div>
          <div class="nct-location-card-type">{{ loc.frontmatter.type }}</div>
          <div class="nct-location-card-desc">{{ loc.frontmatter.description }}</div>
          <div class="nct-location-card-tags" v-if="loc.frontmatter.tags">
            <span v-for="tag in loc.frontmatter.tags.slice(0, 3)" :key="tag" class="nct-tag">{{ tag }}</span>
          </div>
        </div>
      </a>
    </div>

    <div v-else class="nct-empty-state">
      <span class="icon material-symbols-outlined">search_off</span>
      <p>No destinations match your filters.</p>
    </div>
  </div>
</template>
