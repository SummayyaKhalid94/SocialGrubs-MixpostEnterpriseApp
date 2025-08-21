<script setup>
import {computed, inject, onBeforeUnmount, onMounted, ref, shallowRef} from "vue";
import {useI18n} from "vue-i18n";
import {Head, router, useForm} from '@inertiajs/vue3';
import useWorkspace from "@e/Composables/useWorkspace";
import useSubscription from "@e/Composables/useSubscription";
import useNotifications from "@e/Composables/useNotifications";
import {convertLaravelErrorsToString, loadScriptsFromString} from "@e/helpers";
import WorkspaceLayout from "@e/Layouts/Workspace.vue";
import Panel from "@e/Components/Surface/Panel.vue";
import Error from "@e/Components/Form/Error.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import Plans from "@e/Components/Subscription/Plans.vue";
import ArrowRight from "@e/Icons/ArrowRight.vue";
import DialogModal from "@e/Components/Modal/DialogModal.vue";
import SecondaryButton from "@e/Components/Button/SecondaryButton.vue";
import Preloader from "@e/Components/Util/Preloader.vue";
import PureButtonLink from "@e/Components/Button/PureButtonLink.vue";
import ArrowLeft from "@e/Icons/ArrowLeft.vue";
import Input from "@e/Components/Form/Input.vue";
import HorizontalGroup from "@e/Components/Layout/HorizontalGroup.vue";

defineOptions({layout: WorkspaceLayout});

const {t: $t} = useI18n()

const routePrefix = inject('routePrefix');

const props = defineProps({
    workspace: {
        type: Object,
        required: true
    },
    subscription: {
        type: [Object, null],
        required: true
    },
    billing_configs: {
        type: Object,
        required: true
    },
    plans: {
        type: Array,
        required: true
    },
    payment_support_trialing: {
        type: Boolean,
        required: true
    },
    payment_support_coupon: {
        type: Boolean,
        required: true
    }
})

const form = useForm({
    cycle: 'monthly',
    plan_id: null,
    coupon: '',
});

const paymentMethod = ref(null);
const {activeWorkspaceId} = useWorkspace();
const {notify} = useNotifications();

const updateForm = (data) => {
    form.cycle = data.cycle;
    form.plan_id = data.plan_id;
}

const getTrialDays = () => {
    if (!props.billing_configs.generic_trial && !props.payment_support_trialing) {
        return 0;
    }

    if (props.subscription) {
        return 0;
    }

    if (props.workspace.generic_subscription && props.workspace.generic_subscription.has_trial) {
        return 0;
    }

    return parseInt(props.billing_configs.trial_days);
}

const {isCanceled} = useSubscription();

const buttonLabel = computed(() => {
    const trialDays = getTrialDays();

    if (trialDays) {
        return $t('subscription.start_trial', {days: trialDays});
    }

    if (props.subscription && !isCanceled(props.subscription.status)) {
        return $t('subscription.change_plan');
    }

    return $t('e-general.subscribe');
})

const newSubscriptionIsLoading = ref(false);
const paymentDetailsIsLoading = ref(false);
const paymentDetailsModal = ref(false);

const openPaymentDetailsModal = () => {
    paymentDetailsModal.value = true;
}
const closePaymentDetailsModal = () => {
    paymentDetailsModal.value = false;
}

const handleClosePaymentDetailsModalEvent = () => {
    closePaymentDetailsModal();
}

onMounted(() => {
    document.addEventListener('closePaymentDetailsModal', handleClosePaymentDetailsModalEvent);
})

onBeforeUnmount(() => {
    document.removeEventListener('closePaymentDetailsModal', handleClosePaymentDetailsModalEvent);
})

const loadedScripts = shallowRef([]);

const newSubscription = () => {
    newSubscriptionIsLoading.value = true;

    loadedScripts.value.forEach((script) => {
        script.remove();
    });

    axios.post(route(`${routePrefix}.workspace.subscription.new`, {workspace: activeWorkspaceId.value}), form.data()).then((response) => {
        if (response.data.redirect_to) {
            window.location.href = response.data.redirect_to;
            return;
        }

        paymentDetailsIsLoading.value = true;

        openPaymentDetailsModal();

        setTimeout(() => {
            loadedScripts.value = loadScriptsFromString(response.data);
            paymentMethod.value.innerHTML = response.data;
            paymentDetailsIsLoading.value = false;
        }, 1000);
    }).finally(() => {
        newSubscriptionIsLoading.value = false;
    }).catch((error) => {
        paymentDetailsIsLoading.value = false;

        if (error.response.status === 409) {
            notify('success', error.response.data.message);
            router.visit(route(`${routePrefix}.workspace.billing`, {workspace: activeWorkspaceId.value}));
            return;
        }

        if (error.response.status === 422) {
            form.setError('error', convertLaravelErrorsToString(error.response.data.errors));
        }

        notify('error', $t('error.something_wrong'));
    });
}

const swapSubscriptionPlan = () => {
    form.post(route(`${routePrefix}.workspace.subscription.changePlan`, {workspace: activeWorkspaceId.value}), {
        preserveScroll: true,
        onError() {
            notify('error', $t('error.something_wrong'));
        }
    });
}


const {canChangePlan} = useSubscription();

const submit = () => {
    form.clearErrors();

    if (props.subscription && canChangePlan(props.subscription.status)) {
        swapSubscriptionPlan();
    } else {
        newSubscription();
    }
}

const title = () => {
    if (props.subscription && !isCanceled(props.subscription.status)) {
        return $t('subscription.change_sub_plan');
    }

    return $t('e-general.subscribe');
}
</script>
<template>
    <Head :title="title()"/>

    <div class="w-full mx-auto">
        <Panel>
            <template #title>
                {{ title() }}
            </template>

            <Plans :currentPlan="subscription ? subscription.plan : null"
                   :billingConfigs="billing_configs"
                   :plans="plans"
                   @change="updateForm"/>

            <div>
                <Error v-for="error in form.errors" :message="error" class="mt-lg"/>
            </div>
        </Panel>

        <template v-if="payment_support_coupon">
            <Panel class="mt-lg">
                <template #title>
                    {{ $t('subscription.use_coupon') }}
                </template>

                <HorizontalGroup>
                    <Input v-model="form.coupon" name="coupon" type="text"
                           :placeholder="$t('subscription.insert_coupon')"/>
                </HorizontalGroup>
            </Panel>
        </template>

        <template v-if="subscription">
            <PureButtonLink :href="route(`${routePrefix}.workspace.billing`, {workspace: activeWorkspaceId})"
                            class="mt-lg mr-md">
                <template #icon>
                    <ArrowLeft/>
                </template>
                <span v-if="!isCanceled(subscription.status)"
                      class="link-primary">{{ $t('plan.keep_old_plan') }}</span>
                <span v-if="isCanceled(subscription.status)"
                      class="link-primary">{{ $t('dashboard.back_billing') }}</span>
            </PureButtonLink>
        </template>

        <PrimaryButton @click="submit"
                       :disabled="newSubscriptionIsLoading || form.processing"
                       :isLoading="newSubscriptionIsLoading || form.processing"
                       size="sm"
                       class="mt-lg">
            <template #icon>
                <ArrowRight/>
            </template>
            {{ buttonLabel }}
        </PrimaryButton>
    </div>

    <DialogModal
        :show="paymentDetailsModal"
        max-width="sm"
        :closeable="false"
        @close="closePaymentDetailsModal"
    >
        <template #header>
            {{ $t('dashboard.payment_details') }}
        </template>

        <template #body>
            <Preloader v-if="paymentDetailsIsLoading" :rounded="true"/>
            <div ref="paymentMethod" class="mt-1"/>
        </template>

        <template #footer>
            <SecondaryButton @click="closePaymentDetailsModal">{{ $t('e-general.cancel') }}</SecondaryButton>
        </template>
    </DialogModal>
</template>
