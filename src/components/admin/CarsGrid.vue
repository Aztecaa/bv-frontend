<template>
  <div>
    <div class="flex justify-between mb-6">
      <h1 class="text-3xl font-bold">Autos</h1>

      <button
        @click="$emit('add')"
        class="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Agregar Auto
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="auto in autos"
        :key="auto.id"
        @click="$emit('edit', auto)"
        class="bg-white rounded-xl shadow overflow-hidden cursor-pointer"
      >
        <img :src="auto.imagen" class="w-full h-52 object-cover" />

        <div class="p-4">
          <h2 class="font-bold text-lg">
            {{ auto.marca }}
            {{ auto.modelo }}
          </h2>

          <p class="text-gray-500">
            {{ auto.anio }}
          </p>

          <p class="font-semibold mt-2">USD {{ auto.precio }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  autos: Array,
});

defineEmits(["add", "edit"]);
</script>
