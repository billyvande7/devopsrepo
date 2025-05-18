<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';

body {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.app {
  padding: 20px;
}
</style> 