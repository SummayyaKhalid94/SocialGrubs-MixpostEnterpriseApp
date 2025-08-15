<script setup>
import {inject, onMounted, onUnmounted, ref, watch} from "vue";
import { useI18n } from "vue-i18n";
import {Head, router, Link} from '@inertiajs/vue3';
import {cloneDeep, pickBy, throttle} from "lodash";
import emitter from "@e/Services/emitter";
import useAuth from "@e/Composables/useAuth";
import useNotifications from "@e/Composables/useNotifications";
import useSelectable from "@e/Composables/useSelectable";
import PageHeader from "@e/Components/DataDisplay/PageHeader.vue";
import PureDangerButton from "@e/Components/Button/PureDangerButton.vue";
import Panel from "@e/Components/Surface/Panel.vue";
import Checkbox from "@e/Components/Form/Checkbox.vue";
import Table from "@e/Components/DataDisplay/Table.vue";
import TableRow from "@e/Components/DataDisplay/TableRow.vue";
import TableCell from "@e/Components/DataDisplay/TableCell.vue";
import SelectableBar from "@e/Components/DataDisplay/SelectableBar.vue";
import NoResult from "@e/Components/Util/NoResult.vue";
import TrashIcon from "@e/Icons/Trash.vue";
import Pagination from "@e/Components/Navigation/Pagination.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import Filters from "@e/Components/Receipt/Filters.vue";
import ReceiptItem from "@e/Components/Receipt/ReceiptItem.vue";
import Flex from "@e/Components/Layout/Flex.vue";

const props = defineProps({
    receipts: {
        type: Object,
    },
    filter: {
        type: Object,
        default: {}
    },
});

const { t: $t } = useI18n()

const routePrefix = inject('routePrefix');

const {notify} = useNotifications();
const confirmation = inject('confirmation');
const {user} = useAuth();

const {
    selectedRecords,
    putPageRecords,
    toggleSelectRecordsOnPage,
    deselectRecord,
    deselectAllRecords
} = useSelectable();

const itemsId = () => {
    return props.receipts.data.map(item => item.uuid);
}

const filter = ref({
    invoice_number: props.filter.invoice_number
})

onMounted(() => {
    putPageRecords(itemsId());

    emitter.on('receiptDelete', id => {
        deselectRecord(id);
    });
});

onUnmounted(() => {
    emitter.off('receiptDelete');
})

watch(() => props.receipts.data, () => {
    putPageRecords(itemsId());
})

watch(() => cloneDeep(filter.value), throttle(() => {
    router.get(route(`${routePrefix}.receipts.index`), pickBy(filter.value), {
        preserveState: true,
        only: ['receipts', 'filter']
    });
}, 300))

const deleteReceipts = () => {
    confirmation()
        .title($t('finance.delete_receipts'))
        .description($t('finance.confirm_delete_receipts'))
        .destructive()
        .onConfirm((dialog) => {
            dialog.isLoading(true);

            router.delete(route(`${routePrefix}.receipts.multipleDelete`), {
                data: {
                    receipts: selectedRecords.value,
                },
                preserveScroll: true,
                onSuccess() {
                    deselectAllRecords();
                    notify('success', $t('finance.selected_receipts_deleted'))
                },
                onFinish() {
                    dialog.reset();
                }
            });
        })
        .show();
}
</script>
<template>
    <Head :title="$t('sidebar.receipts')"/>

    <div class="w-full mx-auto row-py">
        <PageHeader :title="$t('sidebar.receipts')">
            <template #description>{{ $t('finance.manage_receipts') }}</template>
        </PageHeader>

        <div class="mt-lg row-px w-full">
            <SelectableBar :count="selectedRecords.length" @close="deselectAllRecords">
                <PureDangerButton @click="deleteReceipts" v-tooltip="$t('general.delete')">
                    <TrashIcon/>
                </PureDangerButton>
            </SelectableBar>

            <Flex class="justify-between">
                <Link :href="route(`${routePrefix}.receipts.create`)" class="mb-xs sm:mb-0">
                    <PrimaryButton>{{ $t('finance.create_receipt') }}</PrimaryButton>
                </Link>

                <Filters v-model="filter"/>
            </Flex>

            <Panel :with-padding="false" class="mt-lg">
                <Table>
                    <template #head>
                        <TableRow>
                            <TableCell component="th" scope="col" class="w-10">
                                <Checkbox v-model:checked="toggleSelectRecordsOnPage"
                                          :disabled="!receipts.meta.total"/>
                            </TableCell>
                            <TableCell component="th" scope="col">{{ $t('finance.invoice_number') }}</TableCell>
                            <TableCell component="th" scope="col">{{ $t('workspace.workspace') }}</TableCell>
                            <TableCell component="th" scope="col"> {{ $t('finance.amount') }}</TableCell>
                            <TableCell component="th" scope="col">{{ $t('finance.tax') }}</TableCell>
                            <TableCell component="th" scope="col">{{ $t('finance.currency') }}</TableCell>
                            <TableCell component="th" scope="col">{{ $t('finance.billing_date') }}</TableCell>
                            <TableCell component="th" scope="col"/>
                        </TableRow>
                    </template>
                    <template #body>
                        <template v-for="item in $page.props.receipts.data" :key="item.uuid">
                            <ReceiptItem :item="item" @onDelete="()=> {deselectRecord(item.uuid)}">
                                <template #checkbox>
                                    <Checkbox v-model:checked="selectedRecords" :value="item.uuid"/>
                                </template>
                            </ReceiptItem>
                        </template>
                    </template>
                </Table>

                <NoResult v-if="!receipts.meta.total" table/>
            </Panel>

            <div v-if="receipts.meta.links.length > 3" class="mt-lg">
                <Pagination :meta="receipts.meta" :links="receipts.links"/>
            </div>
        </div>
    </div>
</template>
