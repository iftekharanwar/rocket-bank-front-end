<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { formatAmount } from '@/methods/AccountMethods';

defineProps({
  type: String,
  amount: Number,
  date: String
})

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}
</script>

<template>
  <section :class="['transaction']">
    <section :class="['symbol-type-wrapper']">
      <span :class="['material-symbols-outlined', 'negative']" v-if="type == 'DEBIT'"
        >call_received</span
      >
      <span :class="['material-symbols-outlined', 'positive']" v-else>call_made</span>
      <ul>
        <li>
          <h4>{{ type }}</h4>
          <p>{{ formatDate(date) }}</p>
        </li>
      </ul>
    </section>
    <section :class="['amount-wrapper']">
      <p :class="['amount-negative', 'amount']" v-if="type == 'DEBIT'">
        {{ formatAmount(amount) }}
      </p>
      <p :class="['amount-positive', 'amount']" v-else>{{ formatAmount(amount) }}</p>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.transaction {
  border-radius: 7px;
  background-color: var(--dark3);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .symbol-type-wrapper {
    display: flex;
    align-items: center;
  }

  .material-symbols-outlined {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  ul {
    list-style: none;

    li {
      p {
        font-weight: 100;
        font-size: 10px;
      }
    }
  }

  .amount {
    font-size: 1.3rem;
  }

  .amount-positive {
    color: #90ee90;
  }

  .amount-negative {
    color: #f83434;
  }

  .positive {
    color: darkgreen;
    background-color: lightgreen;
    border-radius: 5px;
  }

  .negative {
    color: red;
    background-color: rgb(246, 181, 181);
    border-radius: 5px;
  }
}
</style>
