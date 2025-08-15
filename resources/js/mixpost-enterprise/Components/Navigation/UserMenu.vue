<script setup>
import {inject, ref} from "vue";
import { useI18n } from "vue-i18n";
import {router, Link} from "@inertiajs/vue3";
import useAuth from "@e/Composables/useAuth";
import useNotifications from "@e/Composables/useNotifications";
import useWorkspace from "@e/Composables/useWorkspace";
import Dropdown from "@e/Components/Dropdown/Dropdown.vue";
import DropdownItem from "@e/Components/Dropdown/DropdownItem.vue";
import Avatar from "@e/Components/DataDisplay/Avatar.vue";
import PencilSquareIcon from "@e/Icons/PencilSquare.vue";
import CogIcon from "@e/Icons/Cog.vue";
import ArrowRightOnRectangleIcon from "@e/Icons/ArrowRightOnRectangle.vue";
import MenuDelimiter from "@e/Components/Sidebar/MenuDelimiter.vue";
import Briefcase from "@e/Icons/Briefcase.vue";
import Plus from "@e/Icons/Plus.vue";
import Badge from "../DataDisplay/Badge.vue";
import KeyIcon from "@e/Icons/Key.vue";

defineProps({
    responsive: {
        type: Boolean,
        default: false
    }
})

const { t: $t } = useI18n()

const routePrefix = inject('routePrefix');
const {user, impersonating, workspaces} = useAuth();
const {activeWorkspaceId, activeWorkspace} = useWorkspace();
const {notify} = useNotifications();

const open = ref(false);

const isWorkspaceActive = (id) => {
    return id === activeWorkspaceId.value;
}

const openWorkspace = (workspace) => {
    if (isWorkspaceActive(workspace.uuid)) {
        return;
    }

    router.post(route('mixpost.switchWorkspace', {workspace: workspace.uuid}), {}, {
        onSuccess() {
            window.location.replace(route('mixpost.dashboard', {workspace: workspace.uuid}));
        },
        onError() {
            notify('error', $t('error.try_again'));
        }
    });
}
</script>
<template>
    <Dropdown width-classes="w-64" placement="top-start">
        <template #trigger>
            <div role="button" class="w-full flex">
                <Avatar :name="user.name" class="mr-sm rtl:mr-0 rtl:ml-sm"/>

                <div :class="{'hidden sm:flex' : responsive}" class="flex flex-col w-[calc(100%-3rem)]">
                    <div class="truncate">{{ user.name }}</div>
                    <div class="text-gray-500 text-sm truncate">
                        {{ activeWorkspace ? activeWorkspace.name : 'Console' }}
                    </div>
                </div>
            </div>

            <template v-if="impersonating">
                <div class="absolute mt-xs">
                    <Badge variant="warning">{{ $t('navigation.impersonating') }}</Badge>
                </div>
            </template>
        </template>

        <template #content>
            <div v-if="workspaces.length || $page.props.mixpost.configs.system.multiple_workspace_enabled"
                 class="flex flex-wrap items-center gap-xs p-sm max-h-64 overflow-y-auto">
                <template v-for="workspace in workspaces" :key="workspace.uuid">
                    <div @click="openWorkspace(workspace)"
                         role="button"
                         class="cursor-pointer group"
                    >
                        <div
                            class="rounded-lg p-0.5 border-2 border-gray-200 group-hover:bg-gray-200 transition-colors ease-in-out duration-200"
                            :class="{'border-primary-500': isWorkspaceActive(workspace.uuid)}"
                        >
                            <Avatar :backgroundColor="workspace.hex_color"
                                    :name="workspace.name"
                                    v-tooltip="workspace.name"
                                    size="md"
                                    roundedClass="rounded-lg"
                            />
                        </div>
                    </div>
                </template>

                <template
                    v-if="$page.props.mixpost.configs.system.multiple_workspace_enabled || !workspaces.some((workspace) => workspace.owner_id === user.id)">
                    <Link :href="route(`${routePrefix}.workspace.create`)"
                          class="group"
                    >
                        <div
                            class="rounded-lg p-0.5 border-2 border-gray-200 group-hover:bg-gray-200 transition-colors ease-in-out duration-200"
                        >
                            <div class="w-10 h-10 p-xs">
                                <Plus/>
                            </div>
                        </div>
                    </Link>
                </template>
            </div>

            <MenuDelimiter/>

            <template v-if="user.is_admin">
                <DropdownItem :href="route('mixpost.dashboardAdmin')">
                    <template #icon>
                        <CogIcon/>
                    </template>
                    {{ $t('panel.admin_console') }}
                </DropdownItem>

                <DropdownItem :href="route(`${routePrefix}.dashboard`)">
                    <template #icon>
                        <Briefcase/>
                    </template>
                    {{ $t('panel.enterprise_console') }}
                </DropdownItem>
            </template>

            <DropdownItem :href="route('mixpost.profile.index')">
                <template #icon>
                    <PencilSquareIcon/>
                </template>
                {{ $t('profile.edit_profile') }}
            </DropdownItem>

            <template v-if="$page.props.mixpost.features.api_access_tokens">
                <DropdownItem :href="route('mixpost.profile.accessTokens.index')">
                    <template #icon>
                        <KeyIcon/>
                    </template>
                    {{ $t('dashboard.access_tokens') }}
                </DropdownItem>
            </template>

            <DropdownItem :href="!impersonating ? route('mixpost.logout') : route(`${routePrefix}.impersonate.stop`)"
                          linkAs="button"
                          :linkMethod="!impersonating ? 'post' : 'delete'">
                <template #icon>
                    <ArrowRightOnRectangleIcon/>
                </template>
                {{ $t('auth.sign_out') }}
            </DropdownItem>
        </template>
    </Dropdown>
</template>
