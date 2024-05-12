<script setup>
import { formatAmount } from '@/methods/AccountMethods'
import router from '@/router/router'
import { useAccountStore } from '@/stores/useAccountStore'

const props = defineProps({
  accounts: Array,
  accountNumber: Number,
  balance: Number,
  accountType: String
})

const store = useAccountStore()

const handleClick = () => {
  let data = {
    account_number: props.accountNumber
  }

  store.accountNumber = data

  router.push('/overview')
}
</script>

<template>
  <section @click="handleClick" :class="['card']">
    <h1>Account Number: {{ props.accountNumber }}</h1>
    <h1>Balance: {{ formatAmount(props.balance) }}</h1>
  </section>
</template>

<style lang="scss" scoped>
.card {
  background-color: var(--dark2);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;

  &:hover {
    border: 1px solid white;
    cursor: pointer;
  }
}
</style>
