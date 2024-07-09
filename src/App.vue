<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <KonvaComponent />
    <!-- <KonvaComponentGroup/> -->
    <!-- <ParentIframe /> -->
</template>

<script>
// import ParentIframe from './components/ParentIframe.vue'
import KonvaComponent from './components/KonvaComponent.vue'
// import KonvaComponentGroup from './components/KonvaComponentGroup.vue'

export default {
  name: 'App',
  components: {
    KonvaComponent
    // KonvaComponentGroup
    // ParentIframe
  },
}
</script>

<style>
body{
  margin:0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
