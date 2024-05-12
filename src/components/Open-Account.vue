<script setup>
import { reactive, ref } from 'vue'
import { formatAmount, cleanAmount, openAccount } from '@/methods/AccountMethods'
import { useAccountStore } from '@/stores/useAccountStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  fname: String
})

const form = reactive({
  amount: '',
  accountType: 'Checking',
  showMenuAccountType: false,
  errorState: false,
  showForm: false,
  disabledButton: true,
  disabledCheckbox: true,
  confirmed: false,
  creating: false
})

const responseDetails = reactive({
  response: '',
  success: false,
  account: {}
})

const inputAmount = ref(null)
const confirm = ref(null)

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
    event.target.value = str
    form.amount = event.target.value
  }
}

const handleAccountTypeMenu = () => {
  if (form.showMenuAccountType) {
    form.showMenuAccountType = false
  } else {
    form.showMenuAccountType = true
  }
}

const handleClearAmount = () => {
  inputAmount.value.value = ''
  form.disabledButton = true
  form.disabledCheckbox = true
  confirm.value.checked = false
}

const handleConfirm = () => {
  if (confirm.value.checked) {
    form.disabledButton = false
    form.confirmed = true
  } else {
    form.disabledButton = true
    form.confirmed = false
  }
}

const handleTransaction = async (amount) => {
  form.creating = true
  const cleanedAmount = cleanAmount(amount)
  console.log(amount)
  if (Number.parseInt(cleanedAmount) === 0 || amount === '') {
    form.errorState = true
    form.disabledButton = true
    form.creating = false
    confirm.value.checked = false
    form.confirmed = false
  } else if (Number.parseInt(cleanedAmount) < 100) {
    form.errorState = true
    form.disabledButton = true
    form.creating = false
    confirm.value.checked = false
    form.confirmed = false
  } else {
    const payload = {
      amount: cleanedAmount,
      type: form.accountType.toUpperCase()
    }
    const response = await openAccount(payload)
    if (response.status === 201) {
      responseDetails.account = response.data
      responseDetails.response = response.status
      responseDetails.success = true
      const store = useAccountStore()
      store.showNav = true
    } else {
      responseDetails.response = 'error'
      form.creating = false
    }
  }
}

const handleNewAccount = (accountNumber) => {
  const store = useAccountStore()
  store.accountNumber = { account_number: accountNumber }
  router.push('/overview')
}

const handleReload = () => {
  router.go()
}
</script>

<template>
  <section v-if="!responseDetails.response" :class="['open-account']">
    <form :class="['open-account-from']">
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
              @click="handleAccountTypeMenu(), handleClearAmount()"
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
              value="Savings"
              v-model="form.accountType"
            />
            <label
              @click="handleAccountTypeMenu(), handleClearAmount()"
              :class="['option-text']"
              for="savings"
              >Savings</label
            >
          </section>
        </section>
      </section>
      <h3>Initial Deposit:</h3>
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
      <span
        :class="{ 'error-message': form.errorState, 'required-initial-deposit': !form.errorState }"
        >Minimum initial deposit must be at least $100.</span
      >
      <br />
      <section :class="['confirm-container']">
        <input
          ref="confirm"
          @click="handleConfirm"
          type="checkbox"
          id="confirm"
          name="confirm"
          :disabled="form.disabledCheckbox"
          :class="['confirm-open']"
        />
        <label for="confirm"> I agree to the terms and conditions</label>
      </section>
      <br />
      <button
        @click="handleTransaction(form.amount, form.accountNumber)"
        type="button"
        :class="[
          form.confirmed ? '' : 'disabled-button',
          form.errorState ? 'disabled-button' : '',
          'submit-button'
        ]"
        :disabled="!form.confirmed"
      >
        {{ form.creating ? 'Creating Account...' : 'Open Account' }}
      </button>
    </form>
  </section>

  <section v-if="responseDetails.success" :class="['open-account', 'response-container']">
    <h1>Good News {{ props.fname }}!</h1>
    <h1>Your new account is ready!</h1>
    <section class="account-details">
      <h3 class="details">Account Type</h3>
      <h2>{{ responseDetails.account.accountType }}</h2>
      <h3 class="details">Account Number</h3>
      <h2>{{ responseDetails.account.accountNumber }}</h2>
      <h3 class="details">Balance</h3>
      <h2>{{ formatAmount(responseDetails.account.balance) }}</h2>
    </section>
    <section class="next-step-button-container">
      <button @click="handleNewAccount(responseDetails.account.accountNumber)" class="button">
        Account Overview
      </button>
      <button class="button" @click="handleReload">Accounts</button>
    </section>
  </section>

  <section
    v-if="responseDetails.response === 'error'"
    :class="['open-account', 'response-container']"
  >
    <h1>Error!</h1>
    <h2>There was an error during the transaction. Please try again.</h2>
    <section class="next-step-button-container">
      <button @click="handleReload" class="button">Try Again</button>
      <button class="button" @click="handleReload">Accounts</button>
    </section>
  </section>
</template>

<style lang="scss" scoped>
h2 {
  font-weight: 400;
  font-size: 1.3rem;
}

.open-account {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: var(--dark4);
  border-radius: 10px;
  padding: 1rem;

  h1 {
    text-align: center;
    font-size: 2rem;
  }

  .amount {
    padding-bottom: 0;
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

  .required-initial-deposit {
    font-weight: 100;
    font-size: 0.7rem;
    text-align: right;
    color: darkgrey;
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
    width: 100%;
    border-radius: 10px;

    &:hover {
      background-color: var(--dark2);
      transition: 0.5s;
    }
  }

  .disabled-button {
    background-color: grey;
    &:hover {
      background-color: grey;
      cursor: default;
    }
  }

  h3 {
    background-color: transparent;
    font-weight: 200;
    color: darkgrey;
    padding-bottom: 0.5rem;
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

      .material-symbols-outlined {
        font-size: 3rem;
        transition: transform 0.5s;
        position: absolute;
        left: 18.8rem;

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
      background-color: var(--dark1);
      border-top: 1px solid grey;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      position: absolute;
      width: 100%;
      text-align: center;
      z-index: 99;

      .option {
        padding-top: 1rem;
        padding-bottom: 1rem;
        &:hover {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          background-color: var(--dark2);
          transition: 0.5s;
        }
      }
    }

    .option-menu-closed {
      background-color: transparent;
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

  .confirm-container {
    margin-top: 0.5rem;
    display: flex;
    column-gap: 0.2rem;

    label {
      font-weight: 200;
    }

    input {
      padding: 1rem;
      cursor: pointer;
    }
  }
}

.response-container {
  gap: 0;
  text-align: center;

  h2 {
    padding-bottom: 0.5rem;
  }

  h3 {
    padding: 0;

    &:first-child {
      padding-top: 0.5rem;
    }
  }

  .account-details {
    margin: 0 auto;
    h3 {
      color: rgb(205, 205, 205);
      font-size: 1rem;
    }
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
