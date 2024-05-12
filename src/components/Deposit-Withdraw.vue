<script setup>
import { reactive, ref } from 'vue'
import { formatAmount, deposit, cleanAmount, withdraw } from '@/methods/AccountMethods'

const props = defineProps({
  title: String,
  type: String,
  accounts: Array
})

const accountList = reactive({
  checkingList: [],
  savingList: []
})

const form = reactive({
  amount: '',
  transactionType: '',
  accountType: '',
  accountNumber: '',
  showMenuAccountType: false,
  showMenuAccountNumber: false,
  errorState: false
})

const responseDetails = reactive({
  response: '',
  account: {}
})

const inputAmount = ref(null)

if (props.type === 'DEPOSIT') {
  form.transactionType = 'Deposit'
} else if (props.type === 'WITHDRAWAL') {
  form.transactionType = 'Withdraw'
}

props.accounts.map((account) => {
  if (account.accountType === 'CHECKING') {
    accountList.checkingList.push(account)
  } else {
    accountList.savingList.push(account)
  }
})

const handleKeydown = (event) => {
  inputAmount.value.setSelectionRange(
    inputAmount.value.value.length,
    inputAmount.value.value.length
  )
  const regex = /[0-9]*\.[0-9]{2}/g
  if (
    (event.keyCode !== 8 && event.keyCode < 48) ||
    (event.keyCode > 57 && event.keyCode !== 190)
  ) {
    event.preventDefault()
  }
  if (inputAmount.value.value === '$' && event.key === 'Backspace') {
    event.preventDefault()
  }
  if (inputAmount.value.value.includes('.')) {
    const afterPeriod = inputAmount.value.value.split('.')
    if (afterPeriod[1].length === 2 && event.key !== 'Backspace') {
      event.preventDefault()
    }
  }
  if (inputAmount.value.value.includes('.') && event.key === '.') {
    event.preventDefault()
  }
  if (regex.test(form.amount) && event.key !== 'Backspace') {
    event.preventDefault()
  }
}

const formatInput = (value) => {
  value = value.replaceAll(',', '')
  if (value.includes('.0')) {
    return value
  } else {
    return Number(value).toLocaleString()
  }
}

const handleInput = (event) => {
  form.disabledCheckbox = false
  if (!event.target.value.includes('$')) {
    event.target.value = '$' + event.target.value
  }
  if (event.data === '.') {
    form.amount = event.target.value
  } else {
    form.errorState = false
    let str = event.target.value.split('$')
    str[1] = formatInput(str[1])
    str = str.join('$')
    console.log(str)
    event.target.value = str
    form.amount = event.target.value
  }
}

const handleAccountTypeMenu = () => {

  if (form.showMenuAccountType || !props.accounts) {
    form.showMenuAccountType = false
  } else {
    form.showMenuAccountType = true
    form.showMenuAccountNumber = false
  }
}

const handleAccountNumberMenu = () => {
  const checkForAccounts = () => {
    if (form.accountType === 'Checking') {
      return accountList.checkingList
    } else if (form.accountType === 'Saving') {
      return accountList.savingList
    }
  }
  console.log(checkForAccounts().length)
  if (form.showMenuAccountNumber || !form.accountType || checkForAccounts().length === 0) {
    form.showMenuAccountNumber = false
  } else {
    form.showMenuAccountNumber = true
  }
}

const handleClearAccountNumber = () => {
  form.accountNumber = ''
}

const handleClearAmount = () => {
  inputAmount.value.value = ''
}

const handleNewTransaction = () => {
  location.reload()
}

const handleTransaction = async (amount, accountNumber) => {
  const cleanedAmount = cleanAmount(amount)
  console.log(cleanedAmount)
  if (Number.parseInt(cleanedAmount) === 0) {
    console.log('amount is zero')
    form.errorState = true
    console.log(form.errorState)
  } else {
    if (props.title === 'Deposit') {
      const payload = {
        deposit: cleanedAmount,
        account_number: accountNumber
      }
      const response = deposit(payload)
      const data = await response
      if (data.status === 202) {
        console.log(data.data)
        responseDetails.response = data.status
        responseDetails.account = data.data
      } else {
        console.log('An error occured during the transaction')
        responseDetails.response = 'error'
      }
    } else {
      const payload = {
        withdraw: cleanedAmount,
        account_number: accountNumber
      }
      const response = withdraw(payload)
      const data = await response
      if (data.status === 202) {
        console.log(data.data)
        responseDetails.response = data.status
        responseDetails.account = data.data
      } else if (data.status === 400) {
        console.log('insufficient funds')
        responseDetails.response = data.status
      } else {
        console.log('An error occured during the transaction')
        responseDetails.response = 'error'
      }
    }
  }
}
</script>

<template>
  <section v-if="!responseDetails.response" :class="['deposit-withdraw-container']">
    <h1>{{ props.title }}</h1>
    <form :class="['deposit-withdraw form']">
      <section :class="['select-container']">
        <h3>Select account type:</h3>
        <section class="select-account-type-toggle">
          <h2>{{ form.accountType }}</h2>
          <span
            @click="handleAccountTypeMenu"
            :class="[form.showMenuAccountType ? 'arrow-open' : '', 'material-symbols-outlined']"
            >arrow_drop_down</span
          >
        </section>
        <section :class="[form.showMenuAccountType ? 'option-menu-open' : 'option-menu-closed']">
          <section class="option">
            <input
              class="radio"
              type="radio"
              id="checking"
              name="account_type"
              value="Checking"
              v-model="form.accountType"
            />
            <label
              @click="handleAccountTypeMenu(), handleClearAccountNumber(), handleClearAmount()"
              :class="['option-text']"
              for="checking"
              >Checking</label
            ><br />
          </section>
          <section class="option">
            <input
              class="radio"
              type="radio"
              id="savings"
              name="account_type"
              value="Saving"
              v-model="form.accountType"
            />
            <label
              @click="handleAccountTypeMenu(), handleClearAccountNumber(), handleClearAmount()"
              :class="['option-text']"
              for="savings"
              >Saving</label
            >
          </section>
        </section>
      </section>

      <section :class="['select-container']">
        <h3>Select account:</h3>
        <section class="select-account-type-toggle">
          <h2>{{ form.accountNumber }}</h2>
          <span
            @click="handleAccountNumberMenu"
            :class="[form.showMenuAccountNumber ? 'arrow-open' : '', 'material-symbols-outlined']"
            >arrow_drop_down</span
          >
        </section>
        <section :class="[form.showMenuAccountNumber ? 'option-menu-open' : 'option-menu-closed']">
          <section v-if="form.accountType === 'Checking' && accountList.checkingList.length > 0" class="option">
            <input
              v-for="(account, index) in accountList.checkingList"
              class="radio"
              :key="index"
              type="radio"
              :id="account.accountNumber"
              name="account_number"
              :value="account.accountNumber"
              v-model="form.accountNumber"
            />
            <label
              v-for="(account, index) in accountList.checkingList"
              :key="index"
              @click="handleAccountNumberMenu(), handleClearAmount()"
              class="option-text"
              :for="account.accountNumber"
              >{{ account.accountNumber }}<br /><span id="balance"
                >Balance: {{ formatAmount(account.balance) }}</span
              >
            </label>
          </section>

          <section v-if="form.accountType === 'Saving' && accountList.savingList.length > 0" class="option">
            <input
              v-for="(account, index) in accountList.savingList"
              class="radio"
              :key="index"
              type="radio"
              :id="account.accountNumber"
              name="account_number"
              :value="account.accountNumber"
              v-model="form.accountNumber"
            />
            <label
              v-for="(account, index) in accountList.savingList"
              :key="index"
              @click="handleAccountNumberMenu(), handleClearAmount()"
              class="option-text"
              :for="account.accountNumber"
              >{{ account.accountNumber }}<br /><span id="balance"
                >Balance: {{ formatAmount(account.balance) }}</span
              ></label
            >
          </section>
        </section>
      </section>
      <h3>Amount:</h3>
      <input
        ref="inputAmount"
        id="amount"
        type="text"
        :class="[form.errorState ? 'error-state' : '', 'amount']"
        autocomplete="off"
        @keydown="handleKeydown($event)"
        @input="handleInput($event)"
        placeholder="$0"
        :disabled="form.accountNumber === ''"
      />
      <br />
      <span v-if="form.errorState" class="error-message">Amount cannot be $0.00</span>
      <br />
      <button
        @click="handleTransaction(form.amount, form.accountNumber)"
        type="button"
        :class="[
          form.amount ? '' : 'disabled-button',
          form.errorState ? 'disabled-button' : '',
          'submit-button'
        ]"
        :disabled="!form.amount"
      >
        {{ props.title }}
      </button>
    </form>
  </section>

  <section
    v-if="responseDetails.response === 202"
    :class="['deposit-withdraw-container', 'response-container']"
  >
    <h1>Success!</h1>
    <h2>New Balance: {{ formatAmount(responseDetails.account.balance) }}</h2>
    <span>Would you like another transaction?</span>
    <section class="next-step-button-container">
      <button @click="handleNewTransaction" class="button" to="/withdraw">New Transaction</button>
      <router-link class="button" to="/accounts">Accounts</router-link>
    </section>
  </section>

  <section
    v-if="responseDetails.response === 400"
    :class="['deposit-withdraw-container', 'response-container']"
  >
    <h1>Insufficient Funds!</h1>
    <span>Would you like another transaction?</span>
    <section class="next-step-button-container">
      <button @click="handleNewTransaction" class="button" to="/withdraw">New Transaction</button>
      <router-link class="button" to="/accounts">Accounts</router-link>
    </section>
  </section>

  <section
    v-if="responseDetails.response === 'error'"
    :class="['deposit-withdraw-container', 'response-container']"
  >
    <h1>Error!</h1>
    <h2>There was an error during the transaction. Please try again.</h2>
    <section class="next-step-button-container">
      <button @click="handleNewTransaction" class="button" to="/withdraw">Try Again</button>
      <router-link class="button" to="/accounts">Accounts</router-link>
    </section>
  </section>
</template>

<style lang="scss" scoped>
h2 {
  font-weight: 400;
  font-size: 1.3rem;
}

.deposit-withdraw-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: var(--dark4);
  border-radius: 10px;
  padding: 2rem;

  h1 {
    text-align: center;
    font-size: 2rem;
  }

  h3 {
      background-color: transparent;
      font-weight: 200;
      color: darkgrey;
    }

  .amount {

    font-size: 2rem;
    text-align: left;
    caret-color: transparent;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid white;
  }

  .error-state {
    border-bottom: 2px solid darkred;
    color: red;

    &:hover {
      background-color: var(--dark1);
      cursor: not-allowed;
    }
  }

  .error-message {
    color: darkred;
    font-weight: 100;
    font-size: 1rem;
    text-align: right;
  }

  .submit-button {
    background-color: var(--dark1);
    font-size: 1rem;
    padding: 1rem;
    margin-top: 1rem;
    width: 100%;
    border-radius: 10px;

    &:hover {
      background-color: var(--dark2);
      transition: 0.5s;
    }
  }

  .disabled-button {
    &:hover {
      background-color: var(--dark1);
      cursor: not-allowed;
    }
  }

  .select-container {
    margin-bottom: 1rem;
    background-color: transparent;
    position: relative;

    .select-account-type-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      height: 2rem;

      .material-symbols-outlined {
        font-size: 3rem;
        transition: transform 0.5s;
        position: absolute;
        right: -.7rem;

        &:hover {
          cursor: pointer;
        }
      }

      .arrow-open {
        transform: rotate(180deg);
        transition: transform 0.5s;
      }
    }

    .option-menu-open {
      background-color: var(--dark2);
      border-top: 2px solid grey;
      position: absolute;
      width: 100%;
      text-align: center;
      z-index: 99;

      .option {
        padding-top: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid white;
        &:hover {
          background-color: var(--dark1);
          transition: 0.5s;
        }
      }
    }

    .option-menu-closed {
      background-color: var(--dark2);
      border-top: 2px solid white;
      position: absolute;
      width: 100%;
      transition: display 0.5s;
      text-align: center;
      height: 0;
      overflow: hidden;
    }

    .radio {
      appearance: none;
    }

    .option-text {
      font-size: 1.2rem;
      font-weight: 300;
      line-height: 0;

      &:hover {
        cursor: pointer;
      }
    }

    #balance {
      color: darkgrey;
      font-size: 0.7rem;
    }
  }
}

.response-container {
  gap: 0;
  text-align: center;

  h1 {
    padding-bottom: 1rem;
  }

  h2 {
    padding-bottom: 1rem;
  }

  span {
    padding-bottom: 0.5rem;
  }

  .next-step-button-container {
    padding-bottom: 1rem;
    padding-top: 1rem;
    .button {
      background-color: var(--dark1);
      padding: 1rem;
      font-size: 1rem;
      border-radius: 10px;
      text-decoration: none;

      &:nth-child(2) {
        margin-left: 1rem;
      }

      &:hover {
        background-color: var(--dark2);
        transition: 0.5s;
      }
    }
  }
}
</style>
