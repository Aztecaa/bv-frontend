/* panel.vue */
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

      <!-- Cards de Autos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="auto in filteredAutos"
          :key="auto.id"
          @click="abrirModalEditar(auto)"
          class="border rounded-lg shadow bg-stone-300 hover:shadow-lg transition cursor-pointer"
        >
          <img
            :src="auto.imagen"
            alt="auto"
            class="w-full h-60 object-cover rounded-t-lg"
          />
          <div class="m-2">
            <h3 class="mt-3 text-lg font-semibold">{{ auto.marca }} {{ auto.modelo }}</h3>
            <p class="text-gray-600">{{ auto.anio }} - {{ auto.km }} km</p>
            <p class="font-bold mt-2">$ {{ auto.precio }}</p>
          </div>
        </div>
        <button
          v-if="userStore.role === 'supervisor'"
          @click="abrirModalAgregar"
          class="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:cursor-pointer"
        >
          + Agregar Auto
        </button>
      </div>
    </main>
  </div>

  <!-- Modal agregar auto -->
  <div
    v-if="modalAgregar"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white w-[900px] h-[520px] rounded-xl shadow-xl flex overflow-hidden">
      <!-- 🖼 LADO IZQUIERDO -->
      <div class="w-1/2 bg-stone-900 text-white flex flex-col">
        <div class="p-4 text-xl font-semibold border-b border-stone-700">
          {{ nuevoAuto.marca || "Marca" }} {{ nuevoAuto.modelo || "Modelo" }}
        </div>

        <div class="flex-1 flex items-center justify-center p-4">
          <img
            :src="
              nuevoAuto.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'
            "
            class="max-h-full object-contain rounded"
          />
        </div>

        <div class="p-4">
          <input
            v-model="nuevoAuto.imagen"
            placeholder="URL de la imagen"
            class="w-full p-2 rounded text-black"
          />
        </div>
      </div>

      <!-- 📋 LADO DERECHO -->
      <div class="w-1/2 p-6 flex flex-col gap-4 overflow-y-auto">
        <h2 class="text-2xl font-bold">
          {{ modoEdicion ? "Editar Auto" : "Agregar Auto" }}
        </h2>

        <input v-model="nuevoAuto.marca" placeholder="Marca" class="input" />
        <input v-model="nuevoAuto.modelo" placeholder="Modelo" class="input" />
        <input v-model="nuevoAuto.anio" placeholder="Año" class="input" />
        <input v-model="nuevoAuto.km" placeholder="Kilómetros" class="input" />
        <input v-model="nuevoAuto.precio" placeholder="Precio" class="input" />

        <select v-model="nuevoAuto.categoria" class="input">
          <option disabled value="">Categoría</option>
          <option>Auto</option>
          <option>Pickup</option>
          <option>SUV</option>
          <option>Deportivo</option>
        </select>

        <select v-model="nuevoAuto.combustible" class="input">
          <option disabled value="">Combustible</option>
          <option>Nafta</option>
          <option>Diésel</option>
          <option>Eléctrico</option>
          <option>Híbrido</option>
        </select>

        <select v-model="nuevoAuto.estado" class="input">
          <option disabled value="">Estado</option>
          <option>Nuevo</option>
          <option>Semi-nuevo</option>
          <option>Usado</option>
        </select>

        <div class="flex gap-3 mt-auto">
          <button
            @click="guardarAuto"
            class="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>

          <button
            v-if="modoEdicion"
            @click="abrirConfirmacionEliminar"
            class="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Eliminar
          </button>

          <button @click="modalAgregar = false" class="flex-1 bg-gray-300 p-2 rounded">
            Cancelar
          </button>
        </div>
        <div
          v-if="modalEliminar"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]"
        >
          <div class="bg-white w-[400px] p-6 rounded-lg shadow-lg text-center">
            <h3 class="text-lg font-bold mb-4">¿Eliminar este auto?</h3>
            <p class="text-sm text-gray-600 mb-6">Esta acción no se puede deshacer.</p>

            <div class="flex gap-4">
              <button
                @click="eliminarAuto"
                class="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                Sí, eliminar
              </button>
              <button
                @click="modalEliminar = false"
                class="flex-1 bg-gray-300 p-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../store/user";
import api from "../services/api.js";

const autos = ref([]);
const modalAgregar = ref(false);
const modoEdicion = ref(false);
const autoEditado = ref(null);
const modalEliminar = ref(false);
const filtroCategoria = ref(null);
const searchQuery = ref("");
const loading = ref(true);
const error = ref(null);

const nuevoAuto = ref({
  marca: "",
  modelo: "",
  anio: "",
  km: "",
  precio: "",
  imagen: "",
  categoria: "",
  combustible: "",
  estado: "",
});

const seleccionarCategoria = (categoria) => {
  filtroCategoria.value = categoria;
};

const userStore = useUserStore();

// 📡 URL del backend (ajustá si es local o Render)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const abrirModalAgregar = () => {
  modoEdicion.value = false;
  modalAgregar.value = true;
  nuevoAuto.value = {
    marca: "",
    modelo: "",
    anio: "",
    km: "",
    precio: "",
    imagen: "",
    categoria: "",
    combustible: "",
    estado: "",
  };
};

const abrirConfirmacionEliminar = () => {
  modalEliminar.value = true;
};

const guardarAuto = async () => {
  try {
    if (
      !nuevoAuto.value.categoria ||
      !nuevoAuto.value.combustible ||
      !nuevoAuto.value.estado
    ) {
      return alert("Completa categoría, combustible y estado");
    }

    if (modoEdicion.value) {
      await api.put(`${API_URL}/autos/${autoEditado.value.id}`, nuevoAuto.value, {
        withCredentials: true,
      });
      console.log("✏️ Auto actualizado");
    } else {
      await api.post(`${API_URL}/autos`, nuevoAuto.value, { withCredentials: true });
      console.log("🚗 Auto agregado");
    }

    modalAgregar.value = false;
    fetchAutos();
  } catch (err) {
    console.error("❌ Error guardando auto:", err);
    alert("Error guardando auto");
  }
};

// 🔹 Obtener autos desde el backend
const fetchAutos = async () => {
  try {
    console.log("🛰️ Solicitando autos desde backend...");
    const response = await api.get(`${API_URL}/autos`, {
      withCredentials: true,
    });
    autos.value = response.data;
    console.log("✅ Autos cargados:", autos.value);
  } catch (err) {
    console.error("❌ Error al obtener autos:", err);
    error.value = "No se pudieron cargar los autos.";
  } finally {
    loading.value = false;
  }
};

const abrirModalEditar = (auto) => {
  modoEdicion.value = true;
  modalAgregar.value = true;
  autoEditado.value = auto;

  nuevoAuto.value = { ...auto }; // clonar datos
};

const eliminarAuto = async () => {
  try {
    await api.delete(`${API_URL}/autos/${autoEditado.value.id}`, {
      withCredentials: true,
    });

    console.log("🗑️ Auto eliminado");

    modalEliminar.value = false;
    modalAgregar.value = false;

    fetchAutos(); // recargar lista
  } catch (err) {
    console.error("❌ Error eliminando auto:", err);
    alert("No se pudo eliminar el auto");
  }
};

// 🧠 Filtrado de autos
const filteredAutos = computed(() => {
  return autos.value.filter((auto) => {
    const coincideBusqueda = `${auto.marca} ${auto.modelo}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const coincideCategoria = filtroCategoria.value
      ? auto.categoria?.tipo?.toLowerCase() === filtroCategoria.value.toLowerCase() ||
        auto.categoria?.segmento?.toLowerCase() === filtroCategoria.value.toLowerCase()
      : true;

    return coincideBusqueda && coincideCategoria;
  });
});

// 🧩 Evento para depuración
const handleSearch = () => {
  console.log("🔍 Buscando:", searchQuery.value);
};

// 🚀 Cuando se monte el componente, cargamos los autos
onMounted(() => {
  fetchAutos();
});
</script>

<style scoped>
/* Ajustes mínimos opcionales */
</style>
