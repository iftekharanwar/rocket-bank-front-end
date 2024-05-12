<script setup>
import { reactive } from 'vue'
import { createAccount, signIn } from '@/methods/Auth-Methods'
import { useRouter } from 'vue-router'

const router = useRouter()
const newAccount = reactive({
  username: '',
  password: '',
  fname: '',
  lname: '',
  res: {}
})

const styles = reactive({
  usernameFocused: false,
  passwordFocused: false,
  fnameFocused: false,
  lnameFocused: false,
  error: false,
  usernameExist: false,
  errorSignUp: false,
  errorSignIn: false,
  loading: false
})

const signUpErrors = reactive({
  fname: false,
  lname: false,
  username: false,
  password: false,
  general: false
})

const isDisabled = () => {
  if (!newAccount.fname || !newAccount.lname || !newAccount.username || !newAccount.password) {
    return false
  } else {
    return true
  }
}

const handleError = () => {
  if (signUpErrors.general) {
    styles.error = false
    styles.usernameExist = false
    styles.errorSignUp = false
    styles.errorSignIn = false
    signUpErrors.fname = false
    signUpErrors.lname = false
    signUpErrors.username = false
    signUpErrors.password = false
    signUpErrors.general = false
    styles.loading = false
    newAccount.password = ''
  }
}

const submitCreateAccount = async () => {
  const fname = newAccount.fname.trim()
  const lname = newAccount.lname.trim()
  const username = newAccount.username.trim()
  const password = newAccount.password.trim()

  if (fname.length === 0) {
    signUpErrors.fname = true
    signUpErrors.general = true
    styles.loading = false
    newAccount.password = ''
  }
  if (lname.length === 0) {
    signUpErrors.lname = true
    signUpErrors.general = true
    styles.loading = false
    newAccount.password = ''
  }
  if (username.length < 5) {
    signUpErrors.username = true
    signUpErrors.general = true
    styles.loading = false
    newAccount.password = ''
  }
  if (password.length < 6) {
    signUpErrors.password = true
    signUpErrors.general = true
    styles.loading = false
    newAccount.password = ''
  }

  if (signUpErrors.general === true) {
    null
  } else {
    try {
      styles.loading = true
      const response = await createAccount(fname, lname, username, password)
      if (response.status === 201) {
        const signin = await signIn(username, password)
        if (signin.status === 200) {
          router.push('/accounts')
        } else {
          styles.loading = false
          styles.errorSignIn = true
          signUpErrors.general = true
        }
      } else if (response.status === 409) {
        styles.loading = false
        styles.usernameExist = true
        signUpErrors.general = true
      } else {
        styles.loading = false
        styles.error = true
        signUpErrors.general = true
      }
    } catch (e) {
      styles.error = true
    }
  }
}
</script>

<template>
    <section v-show="styles.error" class="error-box">
      <h3>There was an error creating your account. Please try again later.</h3>
    </section>
  <div class="create-account-form">
    <h1>Create Account</h1>
    <form @submit.prevent="submitCreateAccount">
      <div class="input-wrapper">
        <input
          type="text"
          required
          @click="handleError"
          :class="{
            error: signUpErrors.fname
          }"
          v-model="newAccount.fname"
          @focus="styles.fnameFocused = true"
          @blur="styles.fnameFocused = false"
        />
        <br />
        <span v-if="signUpErrors.fname" :class="['error-message']">First name required.</span>
        <label
          :class="{
            'label-active': styles.fnameFocused || newAccount.fname,
            'label-inactive': !styles.fnameFocused && !newAccount.fname
          }"
          for="first-name"
          >First Name<span class="required">*</span></label
        >
      </div>

      <div class="input-wrapper">
        <input
          type="text"
          @click="handleError"
          required
          v-model="newAccount.lname"
          :class="{
            error: signUpErrors.lname
          }"
          @focus="styles.lnameFocused = true"
          @blur="styles.lnameFocused = false"
        />
        <br />
        <span v-if="signUpErrors.lname" :class="['error-message']">Last name required.</span>
        <label
          :class="{
            'label-active': styles.lnameFocused || newAccount.lname,
            'label-inactive': !styles.lnameFocused && !newAccount.lname
          }"
          for="first-name"
          >Last Name<span class="required">*</span></label
        >
      </div>

      <div class="input-wrapper">
        <input
          id="username"
          type="text"
          @click="handleError"
          required
          :class="{
            'error': signUpErrors.username || styles.usernameExist
          }"
          v-model="newAccount.username"
          @focus="styles.usernameFocused = true"
          @blur="styles.usernameFocused = false"
        />
        <br />
        <span v-if="signUpErrors.username" :class="['error-message']"
          >Username needs to be at least 5 characters.</span
        >
        <span v-if="styles.usernameExist" :class="['error-message']"
          >Username already exists.</span>
        <label
          :class="{
            'label-active': styles.usernameFocused || newAccount.username,
            'label-inactive': !styles.usernameFocused && !newAccount.username
          }"
          for="username"
          >Username<span class="required">*</span></label
        >
      </div>
      <div class="input-wrapper">
        <input
          type="password"
          @click="handleError"
          required
          :class="{
            error: signUpErrors.password
          }"
          v-model="newAccount.password"
          @focus="styles.passwordFocused = true"
          @blur="styles.passwordFocused = false"
        />
        <br />
        <span v-if="signUpErrors.password" :class="['error-message']"
          >Password has to be at least 6 characters.</span
        >
        <label
          :class="{
            'label-active': styles.passwordFocused || newAccount.password,
            'label-inactive': !styles.passwordFocused && !newAccount.password
          }"
          for="password"
          >Password<span class="required">*</span></label
        >
      </div>
      <span class="required-message">*Required</span>
      <button
        :disabled="!isDisabled()"
        :class="[isDisabled() ? '' : 'disabled-button', 'sign-in-button', 'create-account-button']"
        type="submit"
      >
      <p v-if="!styles.loading">Create Account</p>
        <section v-if="styles.loading" :class="['loader', 'material-symbols-outlined']">
          progress_activity
        </section>
      </button>
    </form>
    <p>
      Already have an account? <router-link to="/login" id="log-in-button">Sign In</router-link>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  width: 100%;
  height: 20px;
  font-size: 2rem;
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

.error-box {
  position: absolute;
  border-radius: 10px;
  top: 6rem;
  padding: 1rem;
  background-color: rgba(251, 136, 136, 0.738);
  
  h3 {
    font-weight: 200;
  }
}

.create-account-form {
  width: 500px;
  align-self: center;
  text-align: center;
  background-color: var(--dark4);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 1rem;
  align-items: center;
  position: relative;
  
  h1 {
    padding: 2rem;
  }

  form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 75%;

    .input-wrapper {
      position: relative;

      padding-bottom: 1rem;

      label {
        position: absolute;
        top: 12px;
        left: 42px;
        color: rgb(182, 179, 179);
        transition: all 0.3s;
        font-size: 14px;

        .required {
          color: darkred;
        }
      }

      .label-active {
        transform: translateY(-20px);
      }

      .label-inactive {
        transform: translateY(0);
      }

      input {
        background-color: transparent;
        border: none;
        border-bottom: 2px solid white;
        align-self: center;
        width: 75%;
        color: white;
        padding-top: 1rem;
        padding-bottom: .3rem;
        font-size: 1rem;

        &::placeholder {
          color: grey;
        }

        &:focus {
          outline: none;
        }
      }
    }

    .required-message {
      width: 75%;
      align-self: center;
      text-align: left;
      font-size: 0.7rem;
      color: darkgrey;
    }

    .create-account-button {
      background-color: var(--primary);
      margin: 2rem;
      align-self: center;
      border-radius: 20px;
      padding: 1rem;
      width: 50%;
      color: white;
      font-size: 1rem;

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
  }

  #log-in-button {
    color: var(--primary);
    font-size: 16px;

    &:hover {
      cursor: pointer;
      color: var(--dark2);
      transition: 0.3s;
    }
  }

  .input-wrapper {
    .error {
      color: darkred;
      border-bottom: 2px solid red;
    }
  }

  .error-message {
    font-size: 0.7rem;
    text-align: left;
    color: darkred;
  }
}
</style>
