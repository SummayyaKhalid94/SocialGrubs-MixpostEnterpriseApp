<script setup>
import {inject, onMounted, onUnmounted, ref, watch} from "vue";
import {Head, router, Link} from '@inertiajs/vue3';
import {useI18n} from "vue-i18n";
import {cloneDeep, pickBy, throttle} from "lodash";
import AdminLayout from "@p/Layouts/Admin.vue";
import emitter from "@p/Services/emitter";
import useAuth from "@p/Composables/useAuth";
import useNotifications from "@p/Composables/useNotifications";
import useSelectable from "@p/Composables/useSelectable";
import PageHeader from "@p/Components/DataDisplay/PageHeader.vue";
import PureDangerButton from "@p/Components/Button/PureDangerButton.vue";
import Panel from "@p/Components/Surface/Panel.vue";
import Checkbox from "@p/Components/Form/Checkbox.vue";
import Table from "@p/Components/DataDisplay/Table.vue";
import TableRow from "@p/Components/DataDisplay/TableRow.vue";
import TableCell from "@p/Components/DataDisplay/TableCell.vue";
import UserItem from "@p/Components/User/UserItem.vue";
import SelectableBar from "@p/Components/DataDisplay/SelectableBar.vue";
import NoResult from "@p/Components/Util/NoResult.vue";
import TrashIcon from "@p/Icons/Trash.vue";
import Pagination from "@p/Components/Navigation/Pagination.vue";
import PrimaryButton from "@p/Components/Button/PrimaryButton.vue";
import Filters from "@p/Components/User/Filters.vue";
import Flex from "@p/Components/Layout/Flex.vue";

defineOptions({layout: AdminLayout});

const {t: $t} = useI18n()

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

const pageTitle =  $t("user.users");

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
        .title( $t("user.delete_users") )
        .description( $t("user.confirm_delete_users"))
        .destructive()
        .onConfirm((dialog) => {
            dialog.isLoading(true);

            router.delete(route(`${routePrefix}.users.deleteMultiple`), {
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
    <Head :title="pageTitle"/>

    <div class="w-full mx-auto row-py">
        <PageHeader :title="pageTitle">
            <template #description>{{$t("user.manage_users")}}</template>
        </PageHeader>

        <div class="mt-lg row-px w-full">
            <SelectableBar :count="selectedRecords.length" @close="deselectAllRecords">
                <PureDangerButton @click="deleteUsers" v-tooltip="$t('general.delete')">
                    <TrashIcon/>
                </PureDangerButton>
            </SelectableBar>

            <Flex class="justify-between">
                <Link :href="route(`${routePrefix}.users.create`)" class="mb-xs sm:mb-0">
                    <PrimaryButton>{{$t("user.create_user")}}</PrimaryButton>
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
                            <TableCell component="th" scope="col">{{$t("general.name")}}</TableCell>
                            <TableCell component="th" scope="col">{{$t("general.email")}}</TableCell>
                            <TableCell component="th" scope="col">{{$t("general.created_at")}}</TableCell>
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
