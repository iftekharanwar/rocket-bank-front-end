<script setup>
import '@material/web/textfield/outlined-text-field'
import { signIn } from '@/methods/Auth-Methods.js'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const styles = reactive({
  usernameFocused: false,
  passwordFocused: false,
  error: false,
  errorMessage: false,
  signingIn: false
})
const username = ref('')
const password = ref('')
const res = ref({})

const submitSignIn = async () => {
  styles.signingIn = true
  sessionStorage.setItem('isAuthenticated', 'false')
  let response = await signIn(username.value, password.value)
  res.value = response
  try {
    if (response.status === 200) {
      router.push('/accounts')
    } else if (response.status === 400) {
      styles.signingIn = false
      styles.error = true
    } else {
      styles.signingIn = false
      styles.errorMessage = true
    }
  } catch (e) {
    styles.signingIn = false
    styles.errorMessage = true
  }
}

const isDisabled = () => {
  if (!username.value || !password.value) {
    return false
  } else {
    return true
  }
}

const handleError = () => {
  if (styles.error || styles.errorMessage) {
    styles.error = false
    styles.errorMessage = false
    password.value = ''
  }
}

const checkIsAuthenticated = () => {
  try {
    return res.value.isAuthenticated
  } catch (e) {
    null
  }
}
</script>

<template>
  <section v-show="styles.errorMessage" class="error-box">
    <h3>There was an error logging in. Please try again later.</h3>
  </section>
  <div id="login-form" v-bind:class="styles.container">
    <section class="logo-container">
      <span id="rocket" class="material-symbols-outlined">Rocket</span>
      <h1 id="logo-text">Rocket Bank</h1>
    </section>
    <h1>Login</h1>

    <form @submit.prevent="submitSignIn" v-if="!checkIsAuthenticated()">
      <div class="input-wrapper">
        <input
          id="username"
          type="text"
          :class="{
            error: styles.error
          }"
          required
          @input="handleError"
          v-model="username"
          autocomplete="off"
          @focus="styles.usernameFocused = true"
          @blur="styles.usernameFocused = false"
        />
        <label
          :class="{
            'label-active': styles.usernameFocused || username,
            'label-inactive': !styles.usernameFocused && !username
          }"
          for="username"
          >Username</label
        >
      </div>
      <div class="input-wrapper">
        <input
          id="password"
          type="password"
          :class="{
            error: styles.error
          }"
          required
          @input="handleError"
          v-model="password"
          @focus="styles.passwordFocused = true"
          @blur="styles.passwordFocused = false"
        />
        <label
          :class="{
            'label-active': styles.passwordFocused || password,
            'label-inactive': !styles.passwordFocused && !password
          }"
          for="password"
          >Password</label
        >
      </div>
      <span v-if="styles.error" class="error-message">Incorrect username or password.</span>
      <button
        :disabled="!isDisabled()"
        :class="[isDisabled() ? '' : 'disabled-button', 'sign-in-button']"
        type="submit"
      >
        <p v-if="!styles.signingIn">Sign In</p>
        <section v-if="styles.signingIn" :class="['loader', 'material-symbols-outlined']">
          progress_activity
        </section>
      </button>
    </form>
    <p>Don't have a account? <router-link to="/signup" id="sign-up-button">Sign Up</router-link></p>
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

.logo-container {
  text-align: center;

  .material-symbols-outlined {
    font-size: 48px;
  }

  #logo-text {
    padding: 0;
  }
}

#login-form {
  height: 500px;
  width: 500px;
  align-self: center;
  text-align: center;
  background-color: var(--dark4);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 1rem;
  align-items: center;

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
        color: rgb(158, 158, 158);
        transition: all 0.3s;
        font-size: 14px;
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
        padding-bottom: 0.3rem;
        font-size: 1rem;

        &::placeholder {
          color: grey;
        }

        &:focus {
          outline: none;
        }
      }
    }

    .error-message {
      color: darkred;
      text-align: left;
      width: 75%;
      align-self: center;
      font-size: 0.8rem;
    }

    input.error {
      color: darkred;
      border-bottom: 2px solid red;
    }

    .sign-in-button {
      background-color: var(--primary);
      margin: 2rem;
      align-self: center;
      border-radius: 20px;
      padding: 1rem;
      width: 40%;
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

  #sign-up-button {
    color: var(--primary);
    font-size: 16px;

    &:hover {
      cursor: pointer;
      color: var(--dark2);
      transition: 0.3s;
    }
  }
}
</style>
