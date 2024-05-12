<script setup>
import AccountCard from '@/components/Account-Card.vue'
import { getAllAccounts, getCustomer } from '@/methods/AccountMethods'
import { onMounted, reactive } from 'vue'
import { useAccountStore } from '@/stores/useAccountStore'
import { useRouter } from 'vue-router'
import { signOut } from '@/methods/Auth-Methods'
import OpenAccount from '@/components/Open-Account.vue'

const accountStore = useAccountStore()
const router = useRouter()

const accounts = reactive({
  accountsList: [],
  isAccountsLoaded: false,
  checkingAccounts: [],
  savingsAccounts: [],
  timeOfDay: 'Welcome',
  noAccounts: false,
  errorLoading: false,
  loading: false,
  showNav: false
})

const customer = reactive({
  customer: {},
  isLoaded: false
})

const form = reactive({
  showForm: false
})

const currentDate = new Date()
let time = currentDate.toTimeString()
time = Number.parseInt(time.slice(0, 2))

if (time >= 5 && time < 12) {
  accounts.timeOfDay = 'Good Morning'
} else if (time >= 12 && time <= 17) {
  accounts.timeOfDay = 'Good Afternoon'
} else {
  accounts.timeOfDay = 'Good Evening'
}

const signOutHandler = () => {
  console.log('Running SignOut Handler')
  signOut()
  accountStore.accountNumber = {}
  accountStore.accountsExist = false
  console.log('SignOut Handler Complete')
  router.push('/login')
}

const handleOpenAccountForm = () => {
  if (form.showForm) {
    form.showForm = false
  } else {
    form.showForm = true
  }
}

onMounted(async () => {
  const response = await getCustomer()
  customer.customer = response.data
  customer.isLoaded = true
  accounts.loading = true

  const allAccounts = await getAllAccounts()
  accounts.accountsList = allAccounts.data

  try {
    if (accounts.accountsList.length === 0) {
      accounts.loading = false
      accounts.noAccounts = true
    } else if (accounts.accountsList.length > 0) {
      allAccounts.data.map((account) => {
        if (account.accountType === 'CHECKING') {
          accounts.checkingAccounts.push(account)
        } else {
          accounts.savingsAccounts.push(account)
        }
      })
      accounts.showNav = true
      accounts.loading = false
      accountStore.accountsExist = true
      accounts.isAccountsLoaded = true
    } else {
      accounts.errorLoading = true
    }
  } catch (e) {
    accounts.errorLoading = true
  }
})
</script>

<template>
  <section
    :class="[accounts.showNav || accountStore.showNav ? 'showNav' : '', 'accounts-container']"
  >
    <section v-if="accounts.errorLoading" class="error-message">
      <span class="material-symbols-outlined">error</span>
      <h1>Oops!</h1>
      <h2>Looks like we are having technical difficulties!</h2>
      <button @click="signOutHandler">Logout</button>
    </section>
    <button
      v-if="!form.showForm && accountStore.accountsExist"
      @click="handleOpenAccountForm"
      class="open-new-account-button"
    >
      Open New Account
    </button>
    <OpenAccount
      v-if="form.showForm && accountStore.accountsExist"
      :fname="customer.customer.fname"
    />
    <button
      v-if="form.showForm && accountStore.accountsExist"
      @click="handleOpenAccountForm"
      class="cancel-button"
    >
      Cancel
    </button>
    <h1 v-if="customer.isLoaded && !form.showForm" id="greeting">
      {{ accounts.timeOfDay }}, {{ customer.customer.fname }}!
    </h1>
    <h1 v-if="accounts.loading">Loading your accounts.....</h1>
    <section v-if="accounts.noAccounts" :class="['no-accounts']">
      <h1 v-if="!form.showForm" id="no-accounts-found">
        Looks like you do not have a open account.<br />Would you like to open one?
      </h1>
      <section v-if="!form.showForm" :class="['no-accounts-buttons']">
        <button id="open-account" @click="handleOpenAccountForm">Open Account</button>
        <button id="logout" @click="signOutHandler">Logout</button>
      </section>
      <OpenAccount v-if="form.showForm" :fname="customer.customer.fname" />
      <section v-if="form.showForm && !accountStore.showNav" :class="['no-accounts-buttons']">
        <button id="open-account" @click="handleOpenAccountForm">Cancel</button>
        <button id="logout" @click="signOutHandler">Logout</button>
      </section>
    </section>
    <section v-if="!form.showForm" :class="['menu-container']">
      <section v-if="accounts.isAccountsLoaded" :class="['card-container']">
        <h1 :class="['title']">Checking Accounts</h1>
        <hr />
        <AccountCard
          v-for="(account, index) in accounts.checkingAccounts"
          :key="index"
          :accountNumber="account.accountNumber"
          :balance="account.balance"
          :accountType="account.accountType"
        />
      </section>

      <section v-if="accounts.isAccountsLoaded" :class="['card-container']">
        <h1 :class="['title']">Saving Accounts</h1>
        <hr />
        <AccountCard
          v-for="(account, index) in accounts.savingsAccounts"
          :key="index"
          :accountNumber="account.accountNumber"
          :balance="account.balance"
          :accountType="account.accountType"
        />
      </section>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.accounts-container {
  height: 100vh;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-image: url('../assets/bluebackground.png');
  z-index: 100;
  position: relative;

  .error-message {
    text-align: center;
    .material-symbols-outlined {
      font-size: 5rem;
      color: red;
    }
    h1 {
      font-size: 3rem;
    }
    button {
      padding: 0.5rem;
      background-color: var(--dark4);
      border-radius: 5px;
      font-size: 1rem;
      margin-top: 0.5rem;

      &:hover {
        background-color: var(--dark1);
        transition: 0.3s;
      }
    }
  }

  .open-new-account-button {
    padding: 1rem;
    background-color: var(--dark4);
    border-radius: 10px;
    position: absolute;
    margin-top: 1rem;
    margin-right: 1rem;
    top: 0;
    right: 0;

    &:hover {
      background-color: var(--dark1);
      transition: 0.5s;
    }
  }

  .cancel-button {
    padding: 1rem;
    background-color: var(--dark4);
    border-radius: 10px;

    &:hover {
      background-color: var(--dark2);
      transition: 0.5s;
    }
  }

  #greeting {
    font-size: 2.5rem;
  }

  .no-accounts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 1rem;

    h1 {
      font-weight: 300;
      text-align: center;
    }

    .no-accounts-buttons {
      display: flex;
      column-gap: 1rem;
      button {
        padding: 1rem;
        background-color: var(--dark3);
        border-radius: 10px;
      }

      #logout {
        background-color: #fd3b3b8f;
        &:hover {
          background-color: #fa84848f;
          transition: 0.5s;
        }
      }

      #open-account {
        &:hover {
          background-color: var(--dark1);
          transition: 0.5s;
        }
      }
    }
  }

  .menu-container {
    display: flex;
    gap: 1rem;
  }

  .card-container {
    background-color: var(--dark4);
    height: 500px;
    width: 500px;
    border-radius: 10px;
    padding: 1rem 1rem 1rem 1rem;
  }

  .title {
    font-weight: 300;
    padding-bottom: 1rem;
  }

  hr {
    margin-bottom: 1rem;
    color: rgba(128, 128, 128, 0.365);
  }

  @media only screen and (min-width: 1600px) {
    border-right: 1px solid white;
  }
}

.showNav {
  margin-left: 48px;
  z-index: 98;
}
</style>
