<script setup>
import {Head, Link} from '@inertiajs/vue3';
import {inject} from "vue";
import useWorkspace from "@e/Composables/useWorkspace";
import WorkspaceLayout from "@e/Layouts/Workspace.vue";
import Alert from "@e/Components/Util/Alert.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import PageHeader from "@e/Components/DataDisplay/PageHeader.vue";

defineOptions({layout: WorkspaceLayout});

defineProps({
    plan: {
        type: Object,
        required: true
    }
})

const routePrefix = inject('routePrefix');

const {activeWorkspaceId} = useWorkspace();
</script>
<template>
    <Head :title="$t('subscription.trial_ended')"/>

    <PageHeader :title="$t('subscription.trial_ended')" :with-padding-x="false"/>

    <div class="w-full mx-auto">
        <Alert variant="error" :closeable="false">
            <p class="font-medium">{{ $t('subscription.trial_period_ended') }}</p>
            <p>{{ $t('subscription.trial_end_upgrade', {app_name: $page.props.app.name}) }}</p>
        </Alert>

        <div class="mt-lg">
            <Link :href="route(`${routePrefix}.workspace.upgrade`, {workspace: activeWorkspaceId})">
                <PrimaryButton>
                    {{ $t('subscription.upgrade') }}
                </PrimaryButton>
            </Link>
        </div>
    </div>
</template>
