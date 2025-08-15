<script setup>
import {Head} from '@inertiajs/vue3';
import PageHeader from "@e/Components/DataDisplay/PageHeader.vue";
import Users from "@e/Components/Metric/Users.vue";
import Workspaces from "@e/Components/Metric/Workspaces.vue";
import useAuth from "@e/Composables/useAuth";
import Subscriptions from "@e/Components/Metric/Subscriptions.vue";

const {user} = useAuth();
</script>
<template>
    <Head :title="$t('dashboard.dashboard')"/>

    <div class="w-full mx-auto row-py">
        <PageHeader :title="$t('dashboard.dashboard')">
            <template #description>
                👋 {{ $t('dashboard.welcome_back') }} {{ user.name }}
            </template>
        </PageHeader>

        <div class="mt-lg row-px w-full">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-sm">
                <Users/>
                <Workspaces/>
            </div>

            <div class="mt-lg">
                <Subscriptions/>
            </div>
        </div>
    </div>
</template>
