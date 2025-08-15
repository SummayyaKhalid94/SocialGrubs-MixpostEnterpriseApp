<script setup>
import DefaultLayout from "@p/Layouts/Default.vue";
import SidebarAdmin from "@p/Components/Sidebar/SidebarAdmin.vue";
import Navigation from "@p/Components/Navigation/NavBar.vue";
</script>
<template>
    <DefaultLayout>
        <template #sidebar>
            <SidebarAdmin/>
        </template>

        <template #navigation>
            <Navigation/>
        </template>

        <slot/>
    </DefaultLayout>
</template>

