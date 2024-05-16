<script setup>
import CreateAccount from '@/components/Create-Account.vue';

</script>

<template>
    <section class="create-account-container">
        <CreateAccount />
    </section>
    
</template>

<style lang="scss" scoped>
.create-account-container{
    color: white;
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