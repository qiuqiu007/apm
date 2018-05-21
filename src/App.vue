<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  html,body{
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
  body{
    position: fixed;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #999;
  width: 7.5rem;
  height: 100%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
}
  .green-confirm-btn{
    color: #51C332!important;
  }
</style>
