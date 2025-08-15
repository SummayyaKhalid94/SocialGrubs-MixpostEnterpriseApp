<script setup>
import {inject} from "vue";
import DefaultLayout from "@e/Layouts/Default.vue";
import Sidebar from "@e/Components/Sidebar/SidebarWorkspace.vue";
import Navigation from "@e/Components/Navigation/NavBar.vue";

const routePrefix = inject('routePrefix');
</script>
<template>
    <DefaultLayout>
        <template #sidebar>
            <Sidebar/>
        </template>

        <template #navigation>
            <Navigation/>
        </template>

        <div class="row-py row-px w-full mx-auto">
            <slot/>
        </div>
    </DefaultLayout>
</template>
