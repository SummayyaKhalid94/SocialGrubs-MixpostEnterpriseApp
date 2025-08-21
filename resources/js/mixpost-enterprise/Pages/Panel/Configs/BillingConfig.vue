<script setup>
import {inject} from "vue";
import {useI18n} from "vue-i18n";
import {Head, useForm} from '@inertiajs/vue3';
import useNotifications from "@e/Composables/useNotifications";
import {cloneDeep} from "lodash";
import Settings from "@e/Layouts/Child/Settings.vue";
import Panel from "@e/Components/Surface/Panel.vue";
import HorizontalGroup from "@e/Components/Layout/HorizontalGroup.vue";
import Select from "@e/Components/Form/Select.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import Input from "@e/Components/Form/Input.vue";
import Flex from "@e/Components/Layout/Flex.vue";
import Label from "@e/Components/Form/Label.vue";
import Radio from "@e/Components/Form/Radio.vue";
import SectionBorder from "@e/Components/Surface/SectionBorder.vue";
import Textarea from "@e/Components/Form/Textarea.vue";
import InputLength from "@e/Components/Form/InputLength.vue";

const props = defineProps({
    configs: {
        type: Object,
    },
    currencies: {
        required: true,
        type: Array,
    }
});

const {t: $t} = useI18n()

const routePrefix = inject('routePrefix');

const form = useForm(cloneDeep(props.configs));

const {notify} = useNotifications();

const save = () => {
    form.put(route(`${routePrefix}.configs.billing.update`), {
        preserveScroll: true,
        onSuccess: () => {
            notify('success', $t('panel.billing_config_saved'));
        }
    });
}
</script>
<template>
    <Head :title="$t('panel.billing_settings')"/>

    <Settings>
        <form @submit.prevent="save">
            <Panel>
                <template #title>{{ $t('e-general.billing') }}</template>
                <template #description>{{ $t('panel.billing_settings_subscriptions') }}</template>

                <HorizontalGroup>
                    <template #title>{{ $t('e-finance.currency') }}</template>

                    <v-select
                        v-model="form.currency"
                        :reduce="option => option.key"
                        :options="currencies"
                        :close-on-select="true"
                        :clearable="false"
                        :searchable="true"
                        class="w-full"
                    >
                    </v-select>
                </HorizontalGroup>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('subscription.billing_cycle') }}</template>
                    <Select v-model="form.billing_cycle">
                        <option value="monthly_yearly">{{ $t('panel.monthly_yearly') }}</option>
                        <option value="monthly">{{ $t('panel.monthly_only') }}</option>
                        <option value="yearly">{{ $t('panel.yearly_only') }}</option>
                    </Select>
                </HorizontalGroup>

                <SectionBorder/>

                <HorizontalGroup>
                    <template #title>{{ $t('panel.trial_days') }}</template>
                    <template #description>{{ $t('panel.number_days_trial') }}</template>
                    <InputLength v-model="form.trial_days" :min="0" :maxLimit="3"/>
                </HorizontalGroup>

                <HorizontalGroup v-if="form.trial_days && parseInt(form.trial_days) !== 0" class="mt-lg">
                    <template #title>{{ $t('panel.generic_trial') }}</template>
                    <template #description>{{ $t('panel.trial_offer') }}</template>
                    <Flex>
                        <label>
                            <Radio v-model:checked="form.generic_trial" :value="true"/>
                            {{ $t('e-general.yes') }}
                        </label>

                        <label>
                            <Radio v-model:checked="form.generic_trial" :value="false"/>
                            {{ $t('e-general.no') }}
                        </label>
                    </Flex>
                </HorizontalGroup>

                <SectionBorder/>

                <HorizontalGroup>
                    <template #title>{{ $t('e-finance.prorate') }}</template>
                    <template #description>{{ $t('e-finance.prorate_charges') }}</template>
                    <Flex>
                        <label>
                            <Radio v-model:checked="form.prorate" :value="true"/>
                            {{ $t('e-general.yes') }}
                        </label>

                        <label>
                            <Radio v-model:checked="form.prorate" :value="false"/>
                            {{ $t('e-general.no') }}
                        </label>
                    </Flex>
                </HorizontalGroup>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('e-finance.swap_invoice') }}</template>
                    <template #description>{{ $t('e-finance.swap_plans_invoice_user') }}
                    </template>
                    <Flex>
                        <label>
                            <Radio v-model:checked="form.bill_immediately" :value="true"/>
                            {{ $t('e-general.yes') }}
                        </label>

                        <label>
                            <Radio v-model:checked="form.bill_immediately" :value="false"/>
                            {{ $t('e-general.no') }}
                        </label>
                    </Flex>
                </HorizontalGroup>

                <SectionBorder/>

                <HorizontalGroup>
                    <template #title>{{ $t('e-finance.receipt_title') }}</template>
                    <Input type="text" v-model="form.receipt_title" :placeholder="$t('e-finance.receipt')"/>
                </HorizontalGroup>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('panel.company_details') }}</template>
                    <Textarea v-model="form.company_details"/>
                </HorizontalGroup>

                <SectionBorder/>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('plan.plans_page_url') }}</template>
                    <Input type="text" v-model="form.plans_page_url" placeholder="https://your-domain.com/pricing"/>
                </HorizontalGroup>

                <HorizontalGroup class="mt-lg">
                    <template #title>{{ $t('plan.plans_page_url_title') }}</template>
                    <Input type="text" v-model="form.plans_page_url_title" :placeholder="$t('e-general.learn_more')"/>
                </HorizontalGroup>


                <PrimaryButton :disabled="form.processing" :isLoading="form.processing" type="submit" class="mt-lg">
                    {{ $t('e-general.save') }}
                </PrimaryButton>
            </Panel>
        </form>
    </Settings>
</template>
