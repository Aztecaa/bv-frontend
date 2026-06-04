<template>
  <div class="w-full">
    <div class="absolute w-full h-full bg-gray-300 overflow-hidden">
      <!-- Imagen -->
      <img
        v-if="autos.length"
        :src="autos[currentIndex].imagen"
        :alt="autos[currentIndex].modelo"
        @error="handleImgError"
        class="w-full h-full object-cover transition-opacity duration-500"
      />

      <!-- Info básica -->
      <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
        <h2 class="text-lg font-bold">
          {{ autos[currentIndex]?.marca }} {{ autos[currentIndex]?.modelo }}
        </h2>
        <p class="text-sm">
          ${{ autos[currentIndex]?.precio }} • {{ autos[currentIndex]?.anio }}
        </p>
      </div>

      <!-- Botón Anterior -->
      <button
        @click="prevSlide"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded hover:bg-black/70"
      >
        ‹
      </button>

      <!-- Botón Siguiente -->
      <button
        @click="nextSlide"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded hover:bg-black/70"
      >
        ›
      </button>

      <!-- Indicadores -->
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        <span
          v-for="(auto, index) in autos"
          :key="auto.id"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full cursor-pointer transition"
          :class="
            index === currentIndex
              ? 'bg-white scale-125'
              : 'bg-gray-400 hover:bg-white'
          "
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import api from "../services/api";

const autos = ref([]);
const currentIndex = ref(0);
let interval = null;

function handleImgError(event) {
  event.target.src =
    "https://via.placeholder.com/800x400/9ca3af/ffffff?text=Imagen+no+disponible";
}

/* --------------------------
   Mezclar array aleatoriamente
--------------------------- */
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* --------------------------
   Traer autos desde API
--------------------------- */
async function fetchAutos() {
  try {
    const { data } = await api.get("/autos");
    const mezclados = shuffleArray(data).slice(0, 10);
    autos.value = mezclados;
  } catch (error) {
    console.error("Error cargando autos", error);
  }
}

/* --------------------------
   Navegación manual
--------------------------- */
function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % autos.value.length;
  resetInterval();
}

function prevSlide() {
  currentIndex.value =
    (currentIndex.value - 1 + autos.value.length) % autos.value.length;
  resetInterval();
}

function goToSlide(index) {
  currentIndex.value = index;
  resetInterval();
}

/* --------------------------
   Auto Slide cada 3s
--------------------------- */
function startInterval() {
  interval = setInterval(() => {
    nextSlide();
  }, 3000);
}

function resetInterval() {
  clearInterval(interval);
  startInterval();
}

onMounted(async () => {
  await fetchAutos();
  startInterval();
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
