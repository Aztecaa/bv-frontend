/* store.vue */
<template>
  <div class="flex w-full overflow-hidden pt-20">
    <!-- Sidebar (Filtros) -->
    <aside class="w-64 bg-stone-900 text-white p-4 flex flex-col gap-4">
      <h2 class="text-lg font-semibold">Filtros</h2>

      <ul class="flex flex-col gap-2">
        <li
          @click="seleccionarCategoria('Auto')"
          class="cursor-pointer hover:bg-stone-700 px-3 py-2 rounded"
        >
          Autos
        </li>
        <li
          @click="seleccionarCategoria('Pickup')"
          class="cursor-pointer hover:bg-stone-700 px-3 py-2 rounded"
        >
          Pickup
        </li>
        <li
          @click="seleccionarCategoria('SUV')"
          class="cursor-pointer hover:bg-stone-700 px-3 py-2 rounded"
        >
          SUV
        </li>
        <li
          @click="seleccionarCategoria('Deportivo')"
          class="cursor-pointer hover:bg-stone-700 px-3 py-2 rounded"
        >
          Deportivos
        </li>
      </ul>
    </aside>

    <!-- Contenido principal -->
    <main class="flex flex-col flex-1 p-6 overflow-y-auto">
      <!-- Barra de búsqueda -->
      <div class="w-full mb-6 bg-stone-200 rounded-lg">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar autos..."
          class="w-full border border-gray-300 p-3 rounded-lg shadow-sm"
        />
      </div>

      <!-- CARRUSEL -->
      <div
        class="relative l-full h-[400px] bg-gray-300 overflow-hidden rounded-xl mb-10"
      >
        <img
          v-if="autos.length"
          :src="autos[currentIndex].imagen"
          :alt="autos[currentIndex].modelo"
          @error="handleImgError"
          class="w-full h-full object-cover transition-opacity duration-500"
        />

        <!-- Info -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4"
        >
          <h2 class="text-lg font-bold">
            {{ autos[currentIndex]?.marca }} {{ autos[currentIndex]?.modelo }}
          </h2>
          <p class="text-sm">
            ${{ autos[currentIndex]?.precio }} • {{ autos[currentIndex]?.anio }}
          </p>
        </div>

        <!-- Botones -->
        <button
          @click="prevSlide"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded hover:bg-black/70"
        >
          ‹
        </button>

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

      <!-- Cards de Autos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="auto in filteredAutos"
          :key="auto.id"
          class="border rounded-lg shadow bg-stone-300 hover:shadow-lg transition cursor-pointer"
        >
          <img
            :src="auto.imagen"
            alt="auto"
            class="w-full h-56 object-cover rounded-t-lg"
          />
          <div class="m-2">
            <h3 class="mt-3 text-lg font-semibold">
              {{ auto.marca }} {{ auto.modelo }}
            </h3>
            <p class="text-gray-600">{{ auto.anio }} - {{ auto.km }} km</p>
            <p class="font-bold mt-2">$ {{ auto.precio }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Modal vista -->
  <div v-if="showDetails"></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import api from "../services/api";

const showDetails = ref(false);
const autos = ref([]);
const filtroCategoria = ref(null);
const searchQuery = ref("");
const loading = ref(true);
const error = ref(null);

const seleccionarCategoria = (categoria) => {
  filtroCategoria.value = categoria;
};

const abrirModalDetails = () => {
  showDetails.value = true;
};

// 🔹 Obtener autos desde el backend
const fetchAutos = async () => {
  try {
    console.log("🛰️ Solicitando autos desde backend...");
    const response = await api.get("/autos");
    autos.value = response.data;
    console.log("✅ Autos cargados:", autos.value);
  } catch (err) {
    console.error("❌ Error al obtener autos:", err);
    error.value = "No se pudieron cargar los autos.";
  } finally {
    loading.value = false;
  }
};

// 🧠 Filtrado de autos
const filteredAutos = computed(() => {
  return autos.value.filter((auto) => {
    const coincideBusqueda = `${auto.marca} ${auto.modelo}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const coincideCategoria = filtroCategoria.value
      ? auto.categoria?.tipo?.toLowerCase() ===
          filtroCategoria.value.toLowerCase() ||
        auto.categoria?.segmento?.toLowerCase() ===
          filtroCategoria.value.toLowerCase()
      : true;

    return coincideBusqueda && coincideCategoria;
  });
});

// 🧩 Evento para depuración
const handleSearch = () => {
  console.log("🔍 Buscando:", searchQuery.value);
};

// 🚀 Cuando se monte el componente, cargamos los autos
onMounted(async () => {
  await fetchAutos();
  startInterval();
});

onUnmounted(() => clearInterval(interval));

const currentIndex = ref(0);
let interval = null;

function handleImgError(e) {
  e.target.src =
    "https://via.placeholder.com/800x400/9ca3af/ffffff?text=Imagen+no+disponible";
}

function nextSlide() {
  if (!autos.value.length) return;
  currentIndex.value = (currentIndex.value + 1) % autos.value.length;
  resetInterval();
}

function prevSlide() {
  if (!autos.value.length) return;
  currentIndex.value =
    (currentIndex.value - 1 + autos.value.length) % autos.value.length;
  resetInterval();
}

function goToSlide(index) {
  currentIndex.value = index;
  resetInterval();
}

function startInterval() {
  interval = setInterval(() => {
    if (autos.value.length) {
      currentIndex.value = (currentIndex.value + 1) % autos.value.length;
    }
  }, 3000);
}

function resetInterval() {
  clearInterval(interval);
  startInterval();
}
</script>

<style scoped>
/* Ajustes mínimos opcionales */
</style>
