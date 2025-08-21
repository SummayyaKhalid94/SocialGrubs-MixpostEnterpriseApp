<script setup>
import {inject} from "vue";
import {useI18n} from "vue-i18n";
import {Head, useForm} from '@inertiajs/vue3';
import useNotifications from "@e/Composables/useNotifications";
import {cloneDeep} from "lodash";
import Settings from "@e/Layouts/Child/Settings.vue";
import Panel from "@e/Components/Surface/Panel.vue";
import HorizontalGroup from "@e/Components/Layout/HorizontalGroup.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import Radio from "@e/Components/Form/Radio.vue";
import Textarea from "@e/Components/Form/Textarea.vue";
import Input from "@e/Components/Form/Input.vue";
import Error from "@e/Components/Form/Error.vue";
import SectionBorder from "@e/Components/Surface/SectionBorder.vue";

const props = defineProps({
    configs: {
        type: Object,
    }
});

const {t: $t} = useI18n()

const routePrefix = inject('routePrefix');

const form = useForm(cloneDeep(props.configs));

const {notify} = useNotifications();

const save = () => {
    form.put(route(`${routePrefix}.configs.onboarding.update`), {
        preserveScroll: true,
        onSuccess: () => {
            notify('success', $t('panel.onboarding_config_saved'));
        }
    });
}
</script>
<template>
    <Head :title="$t('panel.onboarding_settings')"/>

    <Settings>
        <form @submit.prevent="save">
            <Panel>
                <template #title>{{ $t('panel.onboarding') }}</template>
                <template #description>{{ $t('panel.onboarding_settings_new_users') }}</template>

                <Error v-for="error in form.errors" :message="error" class="mb-xs"/>

                <HorizontalGroup>
                    <template #title>{{ $t('panel.allow_register') }}</template>
                    <div class="flex items-center space-x-sm">
                        <label>
                            <Radio v-model:checked="form.allow_register" :value="true"/>
                            {{ $t('e-general.yes') }}</label>
                        <label>
                            <Radio v-model:checked="form.allow_register" :value="false"/>
                            {{ $t('e-general.no') }}</label>
                    </div>
                </HorizontalGroup>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('panel.email_verification') }}</template>
                    <div class="flex items-center space-x-sm">
                        <label>
                            <Radio v-model:checked="form.email_verification" :value="true"/>
                            {{ $t('e-general.yes') }}</label>
                        <label>
                            <Radio v-model:checked="form.email_verification" :value="false"/>
                            {{ $t('e-general.no') }}</label>
                    </div>
                </HorizontalGroup>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('panel.delete_unverified_users') }}</template>
                    <template #description>
                        {{ $t('panel.delete_unverified_users_desc') }}
                    </template>
                    <div class="flex items-center space-x-sm">
                        <label>
                            <Radio v-model:checked="form.delete_unverified_users" :value="true"/>
                            {{ $t('e-general.yes') }}</label>
                        <label>
                            <Radio v-model:checked="form.delete_unverified_users" :value="false"/>
                            {{ $t('e-general.no') }}</label>
                    </div>
                </HorizontalGroup>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('panel.allow_account_deletion') }}</template>
                    <template #description>
                        {{ $t('panel.allow_account_deletion_desc') }}
                    </template>
                    <div class="flex items-center space-x-sm">
                        <label>
                            <Radio v-model:checked="form.allow_account_deletion" :value="true"/>
                            {{ $t('e-general.yes') }}</label>
                        <label>
                            <Radio v-model:checked="form.allow_account_deletion" :value="false"/>
                            {{ $t('e-general.no') }}</label>
                    </div>
                </HorizontalGroup>

                <SectionBorder/>

                <HorizontalGroup>
                    <template #title>{{ $t('panel.form_title') }}</template>
                    <Input type="text" v-model="form.register_title"/>
                </HorizontalGroup>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('panel.form_description') }}</template>
                    <Textarea v-model="form.register_description"/>
                </HorizontalGroup>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('panel.terms') }}</template>
                    <template #description>{{ $t('panel.markdown_support') }}</template>
                    <Textarea v-model="form.terms_accept_description"/>
                </HorizontalGroup>

                <PrimaryButton :disabled="form.processing" :isLoading="form.processing" type="submit" class="mt-lg">
                    {{ $t('e-general.save') }}
                </PrimaryButton>
            </Panel>
        </form>
    </Settings>
</template>
