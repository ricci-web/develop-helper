<template>
  <div class="holy-grail">
    <header>Header</header>
    <div class="content">
      <nav>Nav</nav>
      <main>Main</main>
      <aside>Aside</aside>
    </div>
    <footer>Footer</footer>
  </div>
</template>

<style scoped>
.holy-grail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

header, footer {
  height: 30px;
  background: #4a9eff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.content {
  flex: 1;
  display: flex;
}

nav, aside {
  width: 100px;
  background: #67c23a;
  color: white;
  padding: 10px;
}

main {
  flex: 1;
  background: #f5f7fa;
  padding: 10px;
}
</style>