<script setup>
import Navbar from './components/Navbar.vue';
import { isAuthenticatedStore } from './stores/isAuthenticatedStore';
import { useAccountStore } from './stores/useAccountStore';

const store = isAuthenticatedStore();
const accountStore = useAccountStore();

</script>

<template>
  <div id="app">
    <router-view />
    <Navbar v-if="store.isAuthenticated && accountStore.accountsExist || accountStore.showNav " />
  </div>
</template>

<style lang="scss">
:root {
  --primary: #0C54DF;
  --dark1: #0A42B6;
  --dark2: #083291;
  --dark3: #06236D;
  --dark4: #051650;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: white;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 200,
  'GRAD' 0,
  'opsz' 48
}

body {
  background-color: var(--dark4);
  background-size: cover;
  font-family: "Nunito", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

#app {
  display: flex;
  width: 100%;
}

@media only screen and (min-width: 1600px) {
  body {
    width: 1600px;
    margin: 0 auto;
  }
}

</style>