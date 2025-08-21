<script setup>
import {Link} from '@inertiajs/vue3';
import {inject} from "vue";
import useWorkspace from "@e/Composables/useWorkspace";
import Logo from "@e/Components/DataDisplay/Logo.vue"
import MenuItem from "@e/Components/Sidebar/MenuItem.vue"
import MenuDelimiter from "@e/Components/Sidebar/MenuDelimiter.vue"
import MenuGroupBody from "@e/Components/Sidebar/MenuGroupBody.vue"
import UserMenu from "@e/Components/Navigation/UserMenu.vue";
import SecondaryButton from "../Button/SecondaryButton.vue";
import ArrowLeft from "@e/Icons/ArrowLeft.vue";
import Cog from "@e/Icons/Cog.vue";
import Users from "@e/Icons/Users.vue";
import CreditCard from "@e/Icons/CreditCard.vue";
import Document from "@e/Icons/Document.vue";
import ShieldCheck from "@e/Icons/ShieldCheck.vue";
import ServerStack from "@e/Icons/ServerStack.vue";

const routePrefix = inject('routePrefix');
const {activeWorkspace, isWorkspaceOwner} = useWorkspace();
</script>
<template>
    <div class="w-full h-full flex flex-col pb-2xl pt-20 bg-white border-r border-gray-200">
        <div class="absolute top-0 w-full text-center">
            <div class="bg-primary-50 border-b border-r border-gray-200 p-xs">
                <span class="text-black font-medium text-sm">{{ $t('sidebar.workspace_settings') }}</span>
            </div>
        </div>

        <div class="relative mb-12 px-xl">
            <Link :href="route(`${routePrefix}.dashboard`)">
                <Logo class="h-12"/>
            </Link>
        </div>

        <div class="flex flex-col space-y-lg overflow-y-auto px-xl h-full">
            <MenuGroupBody>
                <Link :href="route('mixpost.dashboard', {workspace: activeWorkspace.uuid})">
                    <SecondaryButton size="sm">
                        <template #icon>
                            <ArrowLeft/>
                        </template>
                        {{ $t('e-general.back') }}
                    </SecondaryButton>
                </Link>
            </MenuGroupBody>

            <MenuGroupBody>
                <MenuItem :url="route(`${routePrefix}.workspace.settings.index`, {workspace: activeWorkspace.uuid})"
                          :active="$page.component === 'Dashboard/Workspace/Settings'">
                    <template #icon>
                        <Cog/>
                    </template>
                    {{ $t('e-general.settings') }}
                </MenuItem>

                <MenuItem :url="route(`${routePrefix}.workspace.members`, {workspace: activeWorkspace.uuid})"
                          :active="$page.component === 'Dashboard/Workspace/Members'">
                    <template #icon>
                        <Users/>
                    </template>
                    {{ $t('e-team.team') }}
                </MenuItem>

                <MenuItem :url="route(`${routePrefix}.workspace.services.index`, {workspace: activeWorkspace.uuid})"
                          :active="$page.component === 'Dashboard/Workspace/Services'">
                    <template #icon>
                        <ServerStack/>
                    </template>
                    {{ $t('e-general.services') }}
                </MenuItem>
            </MenuGroupBody>

            <MenuDelimiter/>

            <MenuGroupBody>
                <MenuItem :url="route(`${routePrefix}.workspace.billing`, {workspace: activeWorkspace.uuid})"
                          :active="$page.component === 'Dashboard/Workspace/Billing'">
                    <template #icon>
                        <CreditCard/>
                    </template>
                    {{ $t('e-general.billing') }}
                </MenuItem>

                <MenuItem :url="route(`${routePrefix}.workspace.receipts.index`, {workspace: activeWorkspace.uuid})"
                          :active="$page.component === 'Dashboard/Workspace/Receipts'">
                    <template #icon>
                        <Document/>
                    </template>
                    {{ $t('sidebar.receipts') }}
                </MenuItem>
            </MenuGroupBody>

            <template v-if="isWorkspaceOwner">
                <MenuDelimiter/>

                <MenuGroupBody>
                    <MenuItem :url="route(`${routePrefix}.workspace.security.index`, {workspace: activeWorkspace.uuid})"
                              :active="$page.component === 'Dashboard/Workspace/Security'">
                        <template #icon>
                            <ShieldCheck/>
                        </template>
                        {{ $t('sidebar.security') }}
                    </MenuItem>
                </MenuGroupBody>
            </template>
        </div>

        <div class="px-xl pt-xl">
            <UserMenu/>
        </div>
    </div>
</template>
