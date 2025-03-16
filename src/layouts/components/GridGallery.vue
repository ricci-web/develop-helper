<template>
  <div class="grid-gallery">
    <div v-for="n in 6" :key="n" class="grid-item">{{ n }}</div>
  </div>
</template>

<style scoped>
.grid-gallery {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
}

.grid-item {
  background: #ffd04b;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
}
</style>