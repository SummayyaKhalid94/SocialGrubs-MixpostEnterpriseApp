<script setup>
import {inject, ref} from "vue";
import {useI18n} from "vue-i18n";
import emitter from "@e/Services/emitter";
import {router} from "@inertiajs/vue3";
import useAuth from "@e/Composables/useAuth";
import useNotifications from "@e/Composables/useNotifications";
import PureButtonLink from "@e/Components/Button/PureButtonLink.vue";
import Eye from "@e/Icons/Eye.vue";
import PencilSquare from "@e/Icons/PencilSquare.vue";
import Dropdown from "../Dropdown/Dropdown.vue";
import Trash from "@e/Icons/Trash.vue";
import DropdownItem from "../Dropdown/DropdownItem.vue";
import DropdownButton from "../Dropdown/DropdownButton.vue";
import ArrowDownTray from "@e/Icons/ArrowDownTray.vue";

const {t: $t} = useI18n()

const routePrefix = inject('routePrefix');
const confirmation = inject('confirmation');

const props = defineProps({
    itemId: {
        type: String,
        required: true,
    }
})

const emit = defineEmits(['onDelete'])

const {notify} = useNotifications();
const {user} = useAuth();

const confirmationDeletion = ref(false);

const deleteReceipt = () => {
    confirmation()
        .title($t('e-finance.delete_receipt'))
        .description($t('e-finance.confirm_delete_receipt'))
        .destructive()
        .onConfirm((dialog) => {
            dialog.isLoading(true);

            router.delete(route(`${routePrefix}.receipts.delete`, {
                receipt: props.itemId,
            }), {
                onSuccess() {
                    confirmationDeletion.value = false;
                    emit('onDelete')
                    emitter.emit('workspaceDelete', props.itemId);
                    dialog.reset();
                },
                onFinish() {
                    dialog.isLoading(false)
                }
            })
        })
        .show();
}
</script>
<template>
    <div>
        <div class="flex flex-row items-center justify-end gap-xs">
            <PureButtonLink :href="route(`${routePrefix}.receipts.view`, {receipt: itemId})"
                            v-tooltip="$t('e-general.view')">
                <Eye/>
            </PureButtonLink>

            <Dropdown width-classes="w-36" placement="bottom-end">
                <template #trigger>
                    <DropdownButton/>
                </template>

                <template #content>
                    <DropdownItem as="a" :href="route(`${routePrefix}.receipts.download`, {receipt: itemId})">
                        <template #icon>
                            <ArrowDownTray/>
                        </template>
                        {{ $t('e-general.download') }}
                    </DropdownItem>

                    <DropdownItem :href="route(`${routePrefix}.receipts.edit`, {receipt: itemId})">
                        <template #icon>
                            <PencilSquare/>
                        </template>
                        {{ $t('e-general.edit') }}
                    </DropdownItem>

                    <DropdownItem @click="deleteReceipt" as="button">
                        <template #icon>
                            <Trash class="text-red-500"/>
                        </template>
                        {{ $t('e-general.delete') }}
                    </DropdownItem>
                </template>
            </Dropdown>
        </div>
    </div>
</template>
