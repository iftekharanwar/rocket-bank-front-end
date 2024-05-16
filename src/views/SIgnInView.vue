<script setup>
import LoginForm from '@/components/Login-Form.vue';

</script>

<template>
    <section class="sign-in-container">
        <LoginForm />
    </section>  
</template>

<style lang="scss" scoped>
.sign-in-container, .create-account-container{
    background-image: url('../../public/bluebackground.png');
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;

    @media only screen and (min-width: 1600px) {
        border-right: 1px solid white;
        border-left: 1px solid white;
    }
}
</style>