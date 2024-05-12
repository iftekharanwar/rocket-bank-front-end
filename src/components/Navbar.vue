<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="nav-container">
    <section class="logo-container">
        <span id="rocket" class="material-symbols-outlined">Rocket</span>
        <h1 id="logo-text">Rocket Bank</h1>
    </section>
    <menu class="menu-container">
        
        <router-link to="/accounts" class="menu-item">
            <span class="material-symbols-outlined">account_balance_wallet</span>
            <h3 class="menu-description">Accounts</h3>
        </router-link>

        <router-link to="/overview" class="menu-item">
            <span class="material-symbols-outlined">bar_chart_4_bars</span>
            <h3 class="menu-description">Overview</h3>
        </router-link>

        <router-link to="/deposit" class="menu-item">
            <span class="material-symbols-outlined">attach_money</span>
            <h3 class="menu-description">Deposit</h3>
        </router-link>

        <router-link to="/withdraw" class="menu-item">
            <span class="material-symbols-outlined">payments</span>
            <h3 class="menu-description">Withdraw</h3>
        </router-link>

        <router-link to="/transfer" class="menu-item">
            <span class="material-symbols-outlined">send_money</span>
            <h3 class="menu-description">Transfer</h3>
        </router-link>

        <router-link to="/settings" class="menu-item">
            <span id="settings" class="material-symbols-outlined">Settings</span>
            <h3 class="menu-description">Settings</h3>
        </router-link>

        <router-link to="/login" id="logout" class="menu-item" @click="signOutHandler">
        <span class="material-symbols-outlined">logout</span>
        <h3 class="menu-description">Logout</h3>
    </router-link>
    </menu>
    
    
  </nav>
</template>

<script setup>
import { signOut } from '@/methods/Auth-Methods';
import router from '@/router/router';
import { useAccountStore } from '@/stores/useAccountStore';

const accountStore = useAccountStore()

const signOutHandler = () => {
    signOut()
    accountStore.accountNumber = {}
    accountStore.accountsExist = false
    router.push('/login')
}
</script>

<style lang="scss" scoped>
.nav-container{
    min-height: 100vh;
    padding-top: 1rem;
    z-index: 99;
    background-color: var(--dark1);
    width: 48px;
    transition: .5s;
    position: absolute;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    border-right: 1px solid white;

    .logo-container {
        padding-bottom: 2rem;
    }

    .menu-item {
        &.router-link-active {
            background-color: var(--dark3);
            border-bottom: white 1px solid;
            border-top: white 1px solid;
            transition: .5s;
        }
    }
    

    #logo-text{
        opacity: 0;
        transition: opacity 0.1s;
        font-size: 2rem;
        white-space: nowrap;
    }

    .material-symbols-outlined {
        font-size: 32px;
    }

    #rocket {
        font-size: 48px;
        animation: rotateRocketBack 1s forwards;
    }

    .menu-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        #logout {
            margin-top: 3rem;
            opacity: 0;
            transition: opacity 0.1s;
        }

        .menu-item {
            text-decoration: none;
            padding-top: .5rem;
            padding-bottom: .5rem;
            position: relative;

            .material-symbols-outlined {
                transition: transform .5s;
                transform: translateY(13px);
            }

            &:hover {
            background-color: var(--dark3);
            transition: .5s;
            }
        }

        .menu-description {
        font-weight: 400;
        opacity: 0;
        transition: opacity 0.2s;
        font-size: 1rem;
        white-space: nowrap;
        }

        #logout {
            .material-symbols-outlined{
                color: red;
            }

            .menu-description {
                color: red;
            }
        }
    }

    &:hover {
        width: 300px;
        transition: .8s;

        #logo-text {
            opacity: 1;
            transition: .8s;
            transition-delay: .4s;
        }

        #rocket {
            animation: rotateRocket 1s forwards;
        }

        .menu-description, #logout {
            opacity: 1;
        }

        .menu-description {
            display: block;
        }

        .menu-item {

            .material-symbols-outlined {
                transform: translateY(0);
                transition: .5s;
            }
            &.router-link-active {
                background-color: var(--dark3);
                border-bottom: white 1px solid; 
                transition: .5s;
            }
        }
    }

    @media only screen and (min-width: 1600px) {
        border-left: 1px solid white;
    }
}

@keyframes rotateRocket {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(90deg); }
    100% { transform: rotate(0deg); }
}

@keyframes rotateRocketBack {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(-90deg); }
    100% { transform: rotate(0deg); }
}
</style>
