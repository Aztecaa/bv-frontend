<script setup>
import { ref, onMounted, computed } from 'vue'
import NavBar from './components/NavBar.vue'

const darkMode = ref(false)
const isDark = computed(() => darkMode.value)

const applyTheme = () => {
  document.documentElement.classList.toggle('dark', darkMode.value)
}

const toggleDark = () => {
  darkMode.value = !darkMode.value
  applyTheme()
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  darkMode.value = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme()
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-stone-800">
    <NavBar :isDark="isDark" @toggle-dark="toggleDark" />
    <main>
      <router-view />
    </main>
  </div>
</template>
