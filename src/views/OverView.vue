<script setup>
import {
  getAccount,
  getTransactions,
  getAccountHistory,
  getAllTransactions
} from '@/methods/AccountMethods'
import { onMounted, reactive } from 'vue'
import Transaction from '@/components/Transaction.vue'
import BreakdownDonut from '@/components/Breakdown-Donut.vue'
import HistoryLine from '@/components/History-Line.vue'
import { useAccountStore } from '@/stores/useAccountStore'
import router from '@/router/router'

const store = useAccountStore()

if (store.accountNumber.account_number === 9000) {
  router.push('/accounts')
}

const account = reactive({
  balance: '',
  type: '',
  accountNumber: '',
  isLoaded: false
})

const transactions = reactive({
  transaction: [],
  allTransactions: [],
  isLoaded: false
})

const histories = reactive({
  isLoaded: false,
  history: []
})

onMounted(async () => {
  const accountData = await getAccount()
  account.balance = accountData.data.balance
  account.type = accountData.data.accountType
  account.accountNumber = accountData.data.accountNumber

  const transactionData = await getTransactions()
  transactions.transaction = transactionData.data.content

  const allTransactionData = await getAllTransactions()
  transactions.allTransactions = allTransactionData.data

  const historyData = await getAccountHistory()
  historyData.data.map((item) => {
    histories.history.push({ balance: item.balance, date: item.dateTime })
  })
  histories.isLoaded = true
})

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
</script>

<template>
  <section v-if="!histories.isLoaded" class="loader-container">
    <section :class="['loader', 'material-symbols-outlined']">progress_activity</section>
  </section>
  <main v-else class="home-container">
    <section :class="['current-account']">
      <h1>Current Account: {{ account.accountNumber }}</h1>
      <router-link to="/accounts" :class="['switch-account-button']">
        <span :class="['material-symbols-outlined']">swap_horiz</span>
        <h3>Switch</h3>
      </router-link>
    </section>
    <section :class="['current-balance', 'border', 'section-containers']">
      <h2>Balance</h2>
      <span id="balance">{{ formatAmount(account.balance) }}</span>
      <ul>
        <li>
          <p>Account Number</p>
          <p>{{ account.accountNumber }}</p>
        </li>

        <li>
          <p>Account Type</p>
          <p>{{ account.type }}</p>
        </li>
      </ul>
    </section>

    <section :class="['breakdown', 'border', 'section-containers']">
      <BreakdownDonut v-if="histories.isLoaded" :donutData="transactions.allTransactions" />
    </section>

    <section :class="['history', 'border', 'section-containers']">
      <h2>Ending Daily Balance: 7 Days</h2>
      <HistoryLine v-if="histories.isLoaded" :chartData="histories.history" />
    </section>

    <section :class="['recent-transactions', 'border', 'section-containers']">
      <section :class="['recent-transactions-title']"><h2>Recent Transactions</h2></section>
      <Transaction
        :class="['transaction']"
        v-for="(transaction, index) in transactions.transaction"
        :key="index"
        :type="transaction.type"
        :amount="transaction.amount"
        :date="transaction.dateTime"
      />
    </section>
  </main>
</template>

<style lang="scss" scoped>
h2 {
  font-weight: 400;
  font-size: 1.3rem;
}
.loader-container {
  margin-left: 48px;
  width: 100%;
  height: 100vh;
  display: flex;
}

.loader {
  width: 100%;
  font-size: 5rem;
  animation: l1 1s infinite linear;
  display: flex;
  justify-content: center;
  align-items: center;

  font-variation-settings:
    'FILL' 0,
    'wght' 600,
    'GRAD' 0,
    'opsz' 24;
}
@keyframes l1 {
  to {
    transform: rotate(0deg);
  }
  from {
    transform: rotate(-359deg);
  }
}

.home-container {
  height: 100vh;
  width: 100%;
  margin-left: 48px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  grid-template-rows: 1fr 1fr 1fr fr;
  grid-template-areas:
    'current-account current-account current-account'
    'current-balance breakdown recent-transactions'
    'history history recent-transactions';
  gap: 1rem;
  background-color: var(--dark4);

  .section-containers {
    padding: 1rem;
    background-color: var(--dark1);
  }

  .border {
    border-radius: 20px;
  }

  .current-balance {
    grid-area: current-balance;

    h1 {
      font-weight: 400;
    }

    #balance {
      font-size: 2rem;
    }

    ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
      list-style: none;
      padding-top: 3rem;
    }

    .card {
      border: solid 1px red;
      height: 150px;
      width: 250px;
      border-radius: 10px;
      background-image: url('../assets/bluebackground.png');
      background-size: cover;
    }
  }

  .current-account {
    grid-area: current-account;
    display: flex;
    justify-content: space-between;

    h1 {
      font-size: 2rem;
      font-weight: 400;
      color: lightgrey;
    }

    .switch-account-button {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 0.5rem;
      border-radius: 10px;
      background-color: var(--dark1);

      h3 {
        font-weight: 500;
      }
    }
  }

  .breakdown {
    grid-area: breakdown;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  .recent-transactions {
    grid-area: recent-transactions;
    display: flex;
    min-height: 770px;
    flex-direction: column;
    row-gap: 1rem;
    overflow: auto;
    position: relative;
    padding: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 1rem;

    .recent-transactions-title {
      padding-top: 1rem;
      position: sticky;
      top: 0;
      background-color: var(--dark1);
    }
  }
  .history {
    grid-area: history;
    display: flex;
    flex-direction: column;
  }

  @media only screen and (min-width: 1600px) {
    border-right: 1px solid white;
  }
}
</style>
