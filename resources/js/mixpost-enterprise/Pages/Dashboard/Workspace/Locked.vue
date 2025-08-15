<script setup>
import {Head, Link} from '@inertiajs/vue3';
import {inject} from "vue";
import useWorkspace from "@e/Composables/useWorkspace";
import WorkspaceLayout from "@e/Layouts/Workspace.vue";
import Alert from "@e/Components/Util/Alert.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import PageHeader from "@e/Components/DataDisplay/PageHeader.vue";

defineOptions({layout: WorkspaceLayout});

const routePrefix = inject('routePrefix');

const {activeWorkspaceId} = useWorkspace();
</script>
<template>
    <Head :title="$t('workspace.locked')"/>

    <PageHeader :title="$t('workspace.locked')" :with-padding-x="false"/>

    <div class="w-full mx-auto">
        <Alert variant="error" :closeable="false">
            <p class="font-medium"> {{ $t('subscription.workspace_locked') }}</p>
            <p> {{ $t('subscription.reason_workspace_locked') }}</p>
        </Alert>

        <div class="mt-lg">
            <Link :href="route(`${routePrefix}.workspace.upgrade`, {workspace: activeWorkspaceId})">
                <PrimaryButton>
                    {{ $t('subscription.reactive_sub') }}
                </PrimaryButton>
            </Link>
        </div>
    </div>
</template>
