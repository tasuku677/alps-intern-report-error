<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <KonvaComponent />
</template>

<script>
// import ParentOfIframe from './components/ParentOfIframe.vue'
import KonvaComponent from './components/KonvaComponent.vue'

export default {
  name: 'App',
  components: {
    KonvaComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
