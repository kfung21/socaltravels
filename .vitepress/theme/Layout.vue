<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="nct-app">
    <NavBar />
    <main class="nct-page">
      <Content />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.nct-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main { flex: 1; }
</style>
