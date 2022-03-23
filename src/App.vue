<template>
  <img alt="search image" src="./assets/searchimg.png" />
  <SearchMany />
</template>

<script>
import SearchMany from "./components/SearchMany.vue";

export default {
  name: "App",
  components: {
    SearchMany,
  },
};
</script>

<style>
#app {
  background-color: #e7e2d3;
  font-family: Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #625d8e;
}
</style>
