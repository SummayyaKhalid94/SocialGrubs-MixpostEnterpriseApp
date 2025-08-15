<script setup>
import {inject, onMounted, onUnmounted, ref, watch} from "vue";
import {Head, router, Link} from '@inertiajs/vue3';
import { useI18n } from "vue-i18n";
import {cloneDeep, pickBy, throttle} from "lodash";
import useEnterpriseConsole from "@p/Composables/useEnterpriseConsole";
import emitter from "@p/Services/emitter";
import useNotifications from "@p/Composables/useNotifications";
import useSelectable from "@p/Composables/useSelectable";
import AdminLayout from "@p/Layouts/Admin.vue";
import PageHeader from "@p/Components/DataDisplay/PageHeader.vue";
import PureDangerButton from "@p/Components/Button/PureDangerButton.vue";
import Panel from "@p/Components/Surface/Panel.vue";
import Checkbox from "@p/Components/Form/Checkbox.vue";
import Table from "@p/Components/DataDisplay/Table.vue";
import TableRow from "@p/Components/DataDisplay/TableRow.vue";
import TableCell from "@p/Components/DataDisplay/TableCell.vue";
import SelectableBar from "@p/Components/DataDisplay/SelectableBar.vue";
import NoResult from "@p/Components/Util/NoResult.vue";
import TrashIcon from "@p/Icons/Trash.vue";
import Pagination from "@p/Components/Navigation/Pagination.vue";
import PrimaryButton from "@p/Components/Button/PrimaryButton.vue";
import WorkspaceItem from "@p/Components/Workspace/WorkspaceItem.vue";
import Filters from "@p/Components/Workspace/Filters.vue";
import Alert from "@p/Components/Util/Alert.vue";
import Flex from "@p/Components/Layout/Flex.vue";

defineOptions({layout: AdminLayout});

const { t: $t } = useI18n()

const routePrefix = inject('routePrefix');

const props = defineProps({
    workspaces: {
        type: Object,
    },
    filter: {
        type: Object,
        default: {}
    },
});

const pageTitle = $t("workspace.workspaces");

const confirmation = inject('confirmation');
const {notify} = useNotifications();
const {enterpriseConsole} = useEnterpriseConsole()

const {
    selectedRecords,
    putPageRecords,
    toggleSelectRecordsOnPage,
    deselectRecord,
    deselectAllRecords
} = useSelectable();

const itemsId = () => {
    return props.workspaces.data.map(item => item.uuid);
}

const filter = ref({
    keyword: props.filter.keyword
})

onMounted(() => {
    putPageRecords(itemsId());

    emitter.on('workspaceDelete', id => {
        deselectRecord(id);
    });
});

onUnmounted(() => {
    emitter.off('workspaceDelete');
})

watch(() => props.workspaces.data, () => {
    putPageRecords(itemsId());
})

watch(() => cloneDeep(filter.value), throttle(() => {
    router.get(route(`${routePrefix}.workspaces.index`), pickBy(filter.value), {
        preserveState: true,
        only: ['workspaces', 'filter']
    });
}, 300))

const deleteWorkspaces = () => {
    confirmation()
        .title($t("workspace.delete_workspaces"))
        .description($t("workspace.confirm_delete_workspaces"))
        .destructive()
        .onConfirm((dialog) => {
            dialog.isLoading(true);

            router.delete(route(`${routePrefix}.workspaces.deleteMultiple`), {
                data: {
                    workspaces: selectedRecords.value,
                },
                preserveScroll: true,
                onSuccess() {
                    deselectAllRecords();
                    notify('success', $t('workspace.workspaces_deleted'))
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
    <Head :title="pageTitle"/>

    <div class="w-full mx-auto row-py">
        <PageHeader :title="pageTitle">
            <template #description>{{ $t('workspace.manage_brands_businesses') }}</template>
        </PageHeader>

        <div class="mt-lg row-px w-full">
            <SelectableBar :count="selectedRecords.length" @close="deselectAllRecords">
                <PureDangerButton @click="deleteWorkspaces" v-tooltip="$t('general.delete')">
                    <TrashIcon/>
                </PureDangerButton>
            </SelectableBar>

            <template v-if="enterpriseConsole.url">
                <Alert variant="warning" :closeable="false" class="mb-lg">
                    Manage Workspaces from the <a :href="`${enterpriseConsole.url}/workspaces`" class="link">Enterprise
                    Console</a> for more business actions.
                </Alert>
            </template>

            <Flex class="justify-between">
                <Link :href="route(`${routePrefix}.workspaces.create`)" class="mb-xs sm:mb-0">
                    <PrimaryButton>{{ $t('workspace.create_workspace') }}</PrimaryButton>
                </Link>

                <Filters v-model="filter"/>
            </Flex>

            <Panel :with-padding="false" class="mt-lg">
                <Table>
                    <template #head>
                        <TableRow>
                            <TableCell component="th" scope="col" class="w-10">
                                <Checkbox v-model:checked="toggleSelectRecordsOnPage"
                                          :disabled="!$page.props.workspaces.meta.total"/>
                            </TableCell>
                            <TableCell component="th" scope="col"></TableCell>
                            <TableCell component="th" scope="col">{{ $t('general.name') }}</TableCell>
                            <TableCell component="th" scope="col">{{ $t('general.created_at') }}</TableCell>
                            <TableCell component="th" scope="col">{{ $t('user.users') }}</TableCell>
                            <TableCell component="th" scope="col"/>
                        </TableRow>
                    </template>
                    <template #body>
                        <template v-for="item in $page.props.workspaces.data" :key="item.uuid">
                            <WorkspaceItem :item="item" @onDelete="()=> {deselectRecord(item.uuid)}">
                                <template #checkbox>
                                    <Checkbox v-model:checked="selectedRecords" :value="item.uuid"/>
                                </template>
                            </WorkspaceItem>
                        </template>
                    </template>
                </Table>

                <NoResult v-if="!$page.props.workspaces.meta.total" table/>
            </Panel>

            <div v-if="$page.props.workspaces.meta.links.length > 3" class="mt-lg">
                <Pagination :meta="$page.props.workspaces.meta" :links="$page.props.workspaces.links"/>
            </div>
        </div>
    </div>
</template>
