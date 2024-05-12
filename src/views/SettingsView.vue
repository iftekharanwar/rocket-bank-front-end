<script setup></script>

<template>
  <section :class="['settings-container']">
    <h1>Settings feature coming soon!</h1>
  </section>
</template>

<style lang="scss" scoped>
.settings-container {
  height: 100vh;
  width: 100%;
  margin-left: 48px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (min-width: 1600px) {
        border-right: 1px solid white;
    }
}
</style>
