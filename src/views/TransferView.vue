<script setup>
import { useAccountStore } from '@/stores/useAccountStore';
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useAccountStore()

if (store.accountNumber.account_number === 9000) {
  router.push('/accounts')
}
</script>

<template>
  <section :class="['transfer-container']">
    <h1>Transfer features coming soon!</h1>
  </section>
</template>

<style lang="scss" scoped>
.transfer-container {
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
