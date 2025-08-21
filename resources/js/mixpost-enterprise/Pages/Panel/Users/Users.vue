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
import UserItem from "@e/Components/User/UserItem.vue";
import SelectableBar from "@e/Components/DataDisplay/SelectableBar.vue";
import NoResult from "@e/Components/Util/NoResult.vue";
import TrashIcon from "@e/Icons/Trash.vue";
import Pagination from "@e/Components/Navigation/Pagination.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import Filters from "@e/Components/User/Filters.vue";
import Flex from "@e/Components/Layout/Flex.vue";

const { t: $t } = useI18n()

const routePrefix = inject('routePrefix');

const props = defineProps({
    users: {
        type: Object,
    },
    filter: {
        type: Object,
        default: {}
    },
});

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
    return props.users.data.filter(item => item.id !== user.value.id).map(item => item.id);
}

const filter = ref({
    keyword: props.filter.keyword
})

onMounted(() => {
    putPageRecords(itemsId());

    emitter.on('userDelete', id => {
        deselectRecord(id);
    });
});

onUnmounted(() => {
    emitter.off('userDelete');
})

watch(() => props.users.data, () => {
    putPageRecords(itemsId());
})

watch(() => cloneDeep(filter.value), throttle(() => {
    router.get(route(`${routePrefix}.users.index`), pickBy(filter.value), {
        preserveState: true,
        only: ['users', 'filter']
    });
}, 300))

const deleteUsers = () => {
    confirmation()
        .title($t('user.delete_users'))
        .description($t('user.confirm_delete_users'))
        .destructive()
        .onConfirm((dialog) => {
            dialog.isLoading(true);

            router.delete(route(`${routePrefix}.users.multipleDelete`), {
                data: {
                    users: selectedRecords.value,
                },
                preserveScroll: true,
                onSuccess() {
                    deselectAllRecords();
                    notify('success', $t('user.selected_users_deleted'))
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
    <Head :title="$t('user.users')"/>

    <div class="w-full mx-auto row-py">
        <PageHeader :title="$t('user.users')">
            <template #description>{{ $t('user.manage_users') }}</template>
        </PageHeader>

        <div class="mt-lg row-px w-full">
            <SelectableBar :count="selectedRecords.length" @close="deselectAllRecords">
                <PureDangerButton @click="deleteUsers" v-tooltip="$t('e-general.delete')">
                    <TrashIcon/>
                </PureDangerButton>
            </SelectableBar>

            <Flex class="justify-between">
                <Link :href="route(`${routePrefix}.users.create`)" class="mb-xs sm:mb-0">
                    <PrimaryButton>{{ $t('user.create_user') }}</PrimaryButton>
                </Link>

                <Filters v-model="filter"/>
            </Flex>

            <Panel :with-padding="false" class="mt-lg">
                <Table>
                    <template #head>
                        <TableRow>
                            <TableCell component="th" scope="col" class="w-10">
                                <Checkbox v-model:checked="toggleSelectRecordsOnPage"
                                          :disabled="!users.meta.total"/>
                            </TableCell>
                            <TableCell component="th" scope="col"></TableCell>
                            <TableCell component="th" scope="col">{{ $t('e-general.name') }}</TableCell>
                            <TableCell component="th" scope="col">{{ $t('e-general.email') }}</TableCell>
                            <TableCell component="th" scope="col">{{ $t('e-general.created_at') }}</TableCell>
                            <TableCell component="th" scope="col"/>
                        </TableRow>
                    </template>
                    <template #body>
                        <template v-for="item in users.data" :key="item.id">
                            <UserItem :item="item" @onDelete="()=> {deselectRecord(item.id)}">
                                <template #checkbox>
                                    <Checkbox v-model:checked="selectedRecords" :value="item.id"
                                              :disabled="item.id === user.id" number/>
                                </template>
                            </UserItem>
                        </template>
                    </template>
                </Table>

                <NoResult v-if="!users.meta.total" table/>
            </Panel>

            <div v-if="users.meta.links.length > 3" class="mt-lg">
                <Pagination :meta="users.meta" :links="users.links"/>
            </div>
        </div>
    </div>
</template>
