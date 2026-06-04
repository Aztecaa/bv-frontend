<template>
  <div
    class="fixed inset-0 bg-black/70 flex items-center overflow-hidden justify-center z-50"
  >
    <div
      class="bg-white w-full mx-8 max-h-[90vh] overflow-y-auto rounded-2xl p-2 shadow-2xl flex"
    >
      <!-- PANEL IZQUIERDO -->
      <div class="bg-stone-950 rounded-lg text-white p-6 flex flex-col">
        <h2 class="text-3xl font-bold mb-6">
          {{ form.marca || "Marca" }}
          {{ form.modelo || "Modelo" }}
        </h2>

        <!-- PREVIEW -->
        <div
          class="flex-1 rounded-xl overflow-hidden bg-stone-800 flex items-center justify-center"
        >
          <img
            v-if="previewImage"
            :src="previewImage"
            class="w-full h-full object-cover"
          />

          <div v-else class="text-stone-400 text-center">Sin imagen</div>
        </div>

        <!-- DRAG DROP -->
        <label
          class="mt-6 border-2 border-dashed border-stone-600 rounded-xl p-6 text-center cursor-pointer hover:border-white transition"
        >
          <input
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleImage"
          />

          <p class="font-semibold">Arrastrar imagen o hacer click</p>

          <p class="text-sm text-stone-400 mt-2">JPG, PNG, WEBP</p>
        </label>
      </div>

      <!-- PANEL DERECHO -->
      <div class="w-[60%] flex flex-col gap-4 p-8 overflow-y-auto">
        <h2 class="text-2xl font-bold">
          {{ modoEdicion ? "Editar Auto" : "Agregar Auto" }}
        </h2>

        <!-- GRID -->
        <div class="grid grid-cols-2 gap-4">
          <input v-model="form.marca" placeholder="Marca" class="input" />

          <input v-model="form.modelo" placeholder="Modelo" class="input" />

          <input v-model="form.version" placeholder="Versión" class="input" />

          <input
            v-model="form.anio"
            type="number"
            placeholder="Año"
            class="input"
          />

          <input
            v-model="form.precio"
            type="number"
            placeholder="Precio"
            class="input"
          />

          <input
            v-model="form.offerPrice"
            type="number"
            placeholder="Precio Oferta"
            class="input"
          />

          <input
            v-model="form.kilometraje"
            type="number"
            placeholder="Kilómetros"
            class="input"
          />

          <input
            v-model="form.location"
            placeholder="Ubicación"
            class="input"
          />
        </div>

        <!-- SELECTS -->
        <div class="grid grid-cols-2 gap-4">
          <select v-model="form.condicion" class="input">
            <option disabled value="">Estado</option>

            <option value="NUEVO">Nuevo</option>

            <option value="USADO">Usado</option>
          </select>

          <select v-model="form.combustible" class="input">
            <option disabled value="">Combustible</option>

            <option>Nafta</option>

            <option>Diésel</option>

            <option>Híbrido</option>

            <option>Eléctrico</option>
          </select>

          <select v-model="form.transmision" class="input">
            <option disabled value="">Transmisión</option>

            <option>Manual</option>

            <option>Automática</option>
          </select>

          <select v-model="form.categoryId" class="input">
            <option disabled value="">Categoría</option>

            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <select v-model="form.saleType" class="input">
            <option disabled value="">Tipo de venta</option>
            <option value="CONTADO">Contado</option>
            <option value="FINANCIADO">Financiado</option>
            <option value="AMBOS">Ambos</option>
          </select>
        </div>

        <!-- DESCRIPCIONES -->
        <textarea
          v-model="form.shortDesc"
          placeholder="Descripción corta"
          class="input min-h-[90px]"
        />

        <textarea
          v-model="form.description"
          placeholder="Descripción completa"
          class="input min-h-[160px]"
        />

        <!-- CHECKBOXES -->
        <div class="grid grid-cols-3 gap-4 mt-2">
          <label class="checkbox">
            <input type="checkbox" v-model="form.featured" />
            Destacado
          </label>

          <label class="checkbox">
            <input type="checkbox" v-model="form.uniqueOwner" />
            Único dueño
          </label>

          <label class="checkbox">
            <input type="checkbox" v-model="form.transferable" />
            Transferible
          </label>

          <label class="checkbox">
            <input type="checkbox" v-model="form.acceptsTrade" />
            Permuta
          </label>

          <label class="checkbox">
            <input type="checkbox" v-model="form.visible" />
            Visible
          </label>

          <label class="checkbox">
            <input type="checkbox" v-model="form.reserved" />
            Reservado
          </label>
        </div>

        <!-- BOTONES -->
        <div class="flex gap-4 mt-6 pb-2">
          <button
            @click="guardar"
            class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
          >
            Guardar
          </button>

          <button
            @click="$emit('close')"
            class="flex-1 bg-stone-300 py-3 rounded-xl"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  auto: Object,
  modoEdicion: Boolean,
  categories: Array,
});

const emit = defineEmits(["close", "saved"]);

const previewImage = ref("");

const form = ref({
  brand: "",
  model: "",
  version: "",

  year: "",

  price: "",
  offerPrice: "",

  kilometers: "",

  location: "",
  condition: "",
  fuelType: "",
  transmission: "",

  description: "",
  shortDesc: "",

  uniqueOwner: false,
  transferable: true,
  acceptsTrade: false,

  saleType: "",

  featured: false,

  categoryId: "",

  images: [],
});

watch(
  () => props.auto,
  (newAuto) => {
    if (newAuto) {
      form.value = {
        ...newAuto,
      };

      previewImage.value = newAuto.imagen || newAuto.images?.[0]?.url || null;
    }
  },
  { immediate: true },
  console.log("📄 AUTO RECIBIDO EN MODAL:"),
  console.dir(newAuto, { depth: null }),
);

function handleImage(event) {
  const file = event.target.files[0];

  if (!file) return;

  previewImage.value = URL.createObjectURL(file);

  form.value.images = [file];
}

function guardar() {
  emit("saved", form.value);
}
</script>

<style scoped>
.input {
  border: 1px solid #d6d3d1;

  border-radius: 12px;

  padding: 12px;

  outline: none;
}

.input:focus {
  border-color: #44403c;
}

.checkbox {
  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 14px;

  font-weight: 500;
}
</style>
