<script setup>
import {computed, inject, onMounted, ref, watch} from "vue";
import {Head, Link} from '@inertiajs/vue3';
import {useI18n} from "vue-i18n";
import NProgress from 'nprogress'
import {find} from "lodash";
import useNotifications from "@p/Composables/useNotifications";
import PageHeader from '@p/Components/DataDisplay/PageHeader.vue';
import Account from "@p/Components/Account/Account.vue"
import PrimaryButton from "@p/Components/Button/PrimaryButton.vue";
import Tabs from "@p/Components/Navigation/Tabs.vue"
import Tab from "@p/Components/Navigation/Tab.vue"
import TwitterReports from "@p/Components/Report/TwitterReports.vue"
import FacebookPageReports from "@p/Components/Report/FacebookPageReports.vue"
import FacebookGroupReports from "@p/Components/Report/FacebookGroupReports.vue"
import InstagramReports from "@p/Components/Report/InstagramReports.vue"
import ThreadsReports from "@p/Components/Report/ThreadsReports.vue"
import MastodonReports from "@p/Components/Report/MastodonReports.vue"
import PinterestReports from "@p/Components/Report/PinterestReports.vue"
import LinkedinPageReports from "@p/Components/Report/LinkedinPageReports.vue"
import TikTokReports from "@p/Components/Report/TikTokReports.vue"
import BlueskyReports from "@p/Components/Report/BlueskyReports.vue"
import useWorkspace from "@p/Composables/useWorkspace.js";

const {t: $t} = useI18n()

const props = defineProps({
    accounts: {
        required: true,
        type: Array,
    }
})

const workspaceCtx = inject('workspaceCtx');

const {notify} = useNotifications();
const {isWorkspaceEditorRole} = useWorkspace();

const isLoading = ref(false);
const data = ref({
    metrics: {},
    audience: {}
});

const selectAccount = (account) => {
    workspaceCtx.dashboard_filter.account_id = account.id;
}

const isAccountSelected = (account) => {
    return workspaceCtx.dashboard_filter.account_id === account.id;
}

const selectPeriod = (value) => {
    workspaceCtx.dashboard_filter.period = value;
}

const isPeriodSelected = (value) => {
    return workspaceCtx.dashboard_filter.period === value;
}

const fetch = () => {
    isLoading.value = true;
    NProgress.start();

    axios.get(route('mixpost.reports', {workspace: workspaceCtx.id}), {
        params: workspaceCtx.dashboard_filter
    }).then(function (response) {
        data.value = response.data;
    }).catch(() => {
        notify('error', $t('dashboard.error_retrieving_analytics'));
    }).finally(() => {
        isLoading.value = false;
        NProgress.done();
    });
}

const providers = {
    'twitter': TwitterReports,
    'facebook_page': FacebookPageReports,
    'facebook_group': FacebookGroupReports,
    'instagram': InstagramReports,
    'threads': ThreadsReports,
    'mastodon': MastodonReports,
    'pinterest': PinterestReports,
    'linkedin_page': LinkedinPageReports,
    'tiktok': TikTokReports,
    'bluesky': BlueskyReports,
};

const component = computed(() => {
    const account = find(props.accounts, {id: workspaceCtx.dashboard_filter.account_id});

    if (account === undefined) {
        return;
    }

    return providers[account.provider];
});

onMounted(() => {
    if (!props.accounts.length) {
        return null;
    }

    if (!workspaceCtx.dashboard_filter.account_id) {
        selectAccount(props.accounts[0]);
        return null;
    }

    fetch();
})

watch(workspaceCtx.dashboard_filter, () => {
    fetch()
});
</script>
<template>
    <Head :title="$t('dashboard.dashboard')"/>

    <div class="row-py">
        <PageHeader :title="$t('dashboard.dashboard')">
            <div>
                <Tabs v-if="accounts.length">
                    <Tab @click="selectPeriod('7_days')" :active="isPeriodSelected('7_days')">7 {{
                            $t("dashboard.days")
                        }}
                    </Tab>
                    <Tab @click="selectPeriod('30_days')" :active="isPeriodSelected('30_days')">30
                        {{ $t("dashboard.days") }}
                    </Tab>
                    <Tab @click="selectPeriod('90_days')" :active="isPeriodSelected('90_days')">90
                        {{ $t("dashboard.days") }}
                    </Tab>
                </Tabs>
            </div>
        </PageHeader>

        <div class="row-px flex items-center">
            <div class="w-full">
                <div v-if="accounts.length" class="flex flex-wrap items-center gap-sm">
                    <template v-for="account in accounts.filter((acc => acc.support_analytics))" :key="account.id">
                        <button @click="selectAccount(account)" type="button">
                            <Account
                                :provider="account.provider"
                                :name="account.name"
                                :active="isAccountSelected(account)"
                                :img-url="account.image"
                                v-tooltip="account.name"
                            />
                        </button>
                    </template>
                </div>
                <div v-else>
                    <template v-if="isWorkspaceEditorRole">
                        <p class="mb-xs">{{ $t("account.add_social_account") }}</p>
                        <Link :href="route('mixpost.accounts.index', {workspace: workspaceCtx.id})">
                            <PrimaryButton>{{ $t("account.add_account", 2) }}</PrimaryButton>
                        </Link>
                    </template>
                </div>
            </div>
        </div>

        <component :is="component" :data="data" :isLoading="isLoading"/>
    </div>
</template>
