<script setup>
import {inject} from "vue";
import {Head} from '@inertiajs/vue3';
import PageHeader from "@e/Components/DataDisplay/PageHeader.vue";
import Panel from "@e/Components/Surface/Panel.vue";
import HorizontalGroup from "@e/Components/Layout/HorizontalGroup.vue";
import WorkspaceLink from "@e/Components/Workspace/WorkspaceLink.vue";
import ReceiptAction from "@e/Components/Receipt/ReceiptAction.vue";

const routePrefix = inject('routePrefix');
const confirmation = inject('confirmation');

const props = defineProps({
    receipt: {
        type: Object
    }
})
</script>
<template>
    <Head :title="$t('e-finance.view_receipt')"/>

    <div class="w-full mx-auto row-py">
        <PageHeader :title="$t('e-finance.view_receipt')">
            <template #description>
                {{ receipt.invoice_number }}
            </template>

            <ReceiptAction :receipt="receipt" :view="false"/>
        </PageHeader>

        <div class="row-px">
            <Panel>
                <template #title>{{ $t('e-general.details')}}</template>

                <div class="form-field">
                    <HorizontalGroup>
                        <template #title>
                            {{ $t('e-workspace.workspace') }}
                        </template>

                        <template v-if="receipt.workspace">
                            <WorkspaceLink :name="receipt.workspace.name" :uuid="receipt.workspace.uuid"/>
                        </template>
                        <template v-else>-</template>
                    </HorizontalGroup>

                    <HorizontalGroup class="mt-lg">
                        <template #title>
                            {{$t('e-finance.invoice_number') }}
                        </template>

                        {{ receipt.invoice_number }}
                    </HorizontalGroup>

                    <HorizontalGroup class="mt-lg">
                        <template #title>
                            {{ $t('e-finance.transaction_id') }}
                        </template>

                        {{ receipt.transaction_id }}
                    </HorizontalGroup>

                    <HorizontalGroup class="mt-lg">
                        <template #title>
                            {{ $t('e-finance.amount') }}
                        </template>

                        {{ receipt.amount }} {{ receipt.currency }}
                    </HorizontalGroup>

                    <HorizontalGroup class="mt-lg">
                        <template #title>
                            {{ $t('e-finance.tax') }}
                        </template>

                        {{ receipt.tax }} {{ receipt.currency }}
                    </HorizontalGroup>

                    <HorizontalGroup class="mt-lg">
                        <template #title>
                            {{ $t('e-general.description') }}
                        </template>

                        {{ receipt.description }}
                    </HorizontalGroup>

                    <HorizontalGroup class="mt-md">
                        <template #title>
                            {{ $t('e-finance.billing_date') }}
                        </template>

                        {{ receipt.paid_at }}
                    </HorizontalGroup>
                </div>
            </Panel>
        </div>
    </div>
</template>
