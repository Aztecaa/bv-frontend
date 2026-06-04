<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api.js";
import AdminSidebar from "../components/admin/AdminSidebar.vue";
import CarsGrid from "../components/admin/CarsGrid.vue";
import CarFormModal from "../components/admin/CarFormModal.vue";

const autos = ref([]);
const categories = ref([]);
const modalOpen = ref(false);
const modoEdicion = ref(false);
const selectedCar = ref(null);

const abrirAgregar = () => {
  modoEdicion.value = false;
  selectedCar.value = null;
  modalOpen.value = true;
};

const fetchAutos = async () => {
  try {
    const { data } = await api.get("/autos");
    
    autos.value = data;
    console.log("📥 RESPONSE AUTOS:");
    console.log(data.value);

  } catch (error) {
    console.error("Error cargando autos", error);
  }
};

const guardarAuto = async (formData) => {
  const payload = {
    ...form.value,

    year: Number(form.value.year),

    kilometers: Number(form.value.kilometers),

    price: Number(form.value.price),

    offerPrice: form.value.offerPrice ? Number(form.value.offerPrice) : null,

    categoryId: Number(form.value.categoryId),
  };

  try {
    if (modoEdicion.value) {
      await api.put(`/autos/${selectedCar.value.id}`, formData, {
        withCredentials: true,
      });
    } else {
      await api.post("/autos", formData, { withCredentials: true });
    }

    modalOpen.value = false;

    fetchAutos();
  } catch (error) {
    console.error("Error guardando auto", error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await api.get("/categories");
    categories.value = response.data;
  } catch (err) {
    console.error("Error cargando categorías", err);
  }
};

const abrirEditar = (auto) => {
  console.log("🛠 AUTO A EDITAR:");
  console.dir(auto, { depth: null });

  modoEdicion.value = true;

  selectedCar.value = {
    id: auto.id,

    brand: auto.brand,
    model: auto.model,
    version: auto.version,

    year: auto.year,

    price: auto.price,
    offerPrice: auto.offerPrice,

    kilometers: auto.kilometers,

    transmission: auto.transmission,
    fuelType: auto.fuelType,

    condition: auto.condition,

    description: auto.description,
    shortDesc: auto.shortDesc,

    location: auto.location,

    uniqueOwner: auto.uniqueOwner,

    transferable: auto.transferable,

    acceptsTrade: auto.acceptsTrade,

    saleType: auto.saleType,

    featured: auto.featured,

    visible: auto.visible,

    sold: auto.sold,

    reserved: auto.reserved,

    categoryId: auto.categoryId,

    images: auto.images || [],

    imagen: auto.imagen || auto.images?.[0]?.url || null,
  };

  modalOpen.value = true;
};

const cerrarModal = () => {
  modalOpen.value = false;

  selectedCar.value = null;
};

const filteredAutos = computed(() => {
  return autos.value;
});

onMounted(() => {
  fetchAutos();

  fetchCategories();
});
</script>
<template>
  <div class="flex min-h-screen pt-20">
    <AdminSidebar />

    <main class="flex-1 p-6">
      <CarsGrid
        :autos="filteredAutos"
        @add="abrirAgregar"
        @edit="abrirEditar"
      />

      <CarFormModal
        v-if="modalOpen"
        :auto="selectedCar"
        :modoEdicion="modoEdicion"
        :categories="categories"
        @close="cerrarModal"
        @saved="guardarAuto"
      />
    </main>
  </div>
</template>
