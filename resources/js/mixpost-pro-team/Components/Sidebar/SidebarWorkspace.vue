<script setup>
import {inject} from "vue";
import {Link} from '@inertiajs/vue3';
import Logo from "@p/Components/DataDisplay/Logo.vue"
import MenuItem from "@p/Components/Sidebar/MenuItem.vue"
import MenuDelimiter from "@p/Components/Sidebar/MenuDelimiter.vue"
import MenuGroupHeader from "@p/Components/Sidebar/MenuGroupHeader.vue"
import MenuGroupBody from "@p/Components/Sidebar/MenuGroupBody.vue"
import DarkButtonLink from "@p/Components/Button/DarkButtonLink.vue"
import PlusIcon from "@p/Icons/Plus.vue"
import GridIcon from "@p/Icons/Grid.vue"
import CalendarIcon from "@p/Icons/Calendar.vue"
import PhotoIcon from "@p/Icons/Photo.vue"
import ShareIcon from "@p/Icons/Share.vue"
import UserMenu from "@p/Components/Navigation/UserMenu.vue";
import DashboardIcon from "@p/Icons/Dashboard.vue";
import WebhooksIcon from "@p/Icons/Webhooks.vue";
import RectangleGroup from "@p/Icons/RectangleGroup.vue";
import Forward from "@p/Icons/Forward.vue";
import useWorkspace from "@p/Composables/useWorkspace";

const workspaceCtx = inject('workspaceCtx');

const {isWorkspaceAdminRole, isWorkspaceEditorRole} = useWorkspace();
</script>
<template>
    <div class="w-full h-full flex flex-col py-2xl bg-white border-r border-gray-200">
        <div :class="{'mb-12': isWorkspaceEditorRole}" class="relative px-xl">
            <Link :href="route('mixpost.dashboard', {workspace: workspaceCtx.id})">
                <Logo/>
            </Link>
        </div>

        <div v-if="isWorkspaceEditorRole" class="flex px-xl">
            <DarkButtonLink :href="route('mixpost.posts.create', {workspace: workspaceCtx.id})" class="w-full">
                <template #icon>
                    <PlusIcon/>
                </template>
                {{ $t("media.create_post") }}
            </DarkButtonLink>
        </div>

        <div class="flex flex-col space-y-lg overflow-y-auto px-xl mt-2xl h-full">
            <MenuGroupBody>
                <MenuItem :url="route('mixpost.dashboard', {workspace: workspaceCtx.id})"
                          :active="$page.component === 'Workspace/Dashboard'">
                    <template #icon>
                        <DashboardIcon/>
                    </template>
                    {{ $t("dashboard.analytics") }}
                </MenuItem>
            </MenuGroupBody>
            <MenuDelimiter/>
            <MenuGroupHeader :create-url="!isWorkspaceEditorRole ? null : route('mixpost.posts.create', {workspace: workspaceCtx.id})">
                {{ $t('post.content') }}
                <template #icon>
                    <PlusIcon/>
                </template>
            </MenuGroupHeader>
            <MenuGroupBody>
                <MenuItem :url="route('mixpost.posts.index', {workspace: workspaceCtx.id})"
                          :active="$page.component === 'Workspace/Posts/Index'">
                    <template #icon>
                        <GridIcon/>
                    </template>
                    {{ $t('post.posts') }}
                </MenuItem>
                <MenuItem :url="route('mixpost.calendar', {workspace: workspaceCtx.id})"
                          :active="$page.component === 'Workspace/Calendar'">
                    <template #icon>
                        <CalendarIcon/>
                    </template>
                    {{ $t('calendar.calendar') }}
                </MenuItem>
                <MenuItem :url="route('mixpost.media.index', {workspace: workspaceCtx.id})"
                          :active="$page.component === 'Workspace/Media'">
                    <template #icon>
                        <PhotoIcon/>
                    </template>
                    {{ $t('media.media_library') }}
                </MenuItem>
                <template v-if="isWorkspaceEditorRole">
                    <MenuItem :url="route('mixpost.templates.index', {workspace: workspaceCtx.id})"
                              :active="$page.component === 'Workspace/Templates/Index'">
                        <template #icon>
                            <RectangleGroup/>
                        </template>
                        {{ $t('template.templates') }}
                    </MenuItem>
                </template>
            </MenuGroupBody>

            <template v-if="isWorkspaceAdminRole">
                <MenuDelimiter/>
                <MenuGroupHeader :create-url="route('mixpost.posts.create', {workspace: workspaceCtx.id})">
                    {{ $t('post.configuration') }}
                </MenuGroupHeader>
                <MenuGroupBody>
                    <MenuItem :url="route('mixpost.accounts.index', {workspace: workspaceCtx.id})"
                              :active="$page.component === 'Workspace/Accounts/Accounts'">
                        <template #icon>
                            <ShareIcon/>
                        </template>
                        {{ $t('account.accounts') }}
                    </MenuItem>
                    <MenuItem :url="route('mixpost.postingSchedule.index', {workspace: workspaceCtx.id})"
                              :active="$page.component === 'Workspace/PostingSchedule'">
                        <template #icon>
                            <Forward/>
                        </template>
                        {{ $t('posting_schedule.posting_schedule') }}
                    </MenuItem>
                    <MenuItem :url="route('mixpost.webhooks.index', {workspace: workspaceCtx.id})"
                              :active="$page.component === 'Workspace/Webhooks/Index'">
                        <template #icon>
                            <WebhooksIcon/>
                        </template>
                        {{ $t('webhook.webhooks') }}
                    </MenuItem>
                </MenuGroupBody>
            </template>
        </div>

        <div class="px-xl pt-xl">
            <UserMenu/>
        </div>
    </div>
</template>
