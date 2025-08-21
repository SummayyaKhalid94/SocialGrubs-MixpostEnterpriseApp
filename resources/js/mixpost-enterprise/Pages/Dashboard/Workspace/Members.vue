<script setup>
import {Head} from '@inertiajs/vue3';
import {inject} from "vue";
import WorkspaceLayout from "@e/Layouts/Workspace.vue";
import WorkspaceTeamMembers from "@e/Components/Workspace/WorkspaceMembers.vue";
import PageHeader from "@e/Components/DataDisplay/PageHeader.vue";

defineOptions({layout: WorkspaceLayout});

const routePrefix = inject('routePrefix');

const props = defineProps({
    workspace: {
        required: true,
        type: Object,
    },
    users: {
        required: true,
        type: Array,
    },
    invitations: {
        required: true,
        type: Array,
    }
})
</script>
<template>
    <Head :title="$t('e-team.team')"/>

    <PageHeader :title="$t('e-team.team')" :with-padding-x="false"/>

    <div class="w-full">
        <WorkspaceTeamMembers :workspace="workspace"
                              :users="users"
                              :invitations="invitations"
        />
    </div>
</template>
