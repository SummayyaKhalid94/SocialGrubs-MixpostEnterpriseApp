<script setup>
import {inject, ref} from "vue";
import { useI18n } from "vue-i18n";
import emitter from "@e/Services/emitter";
import {router} from "@inertiajs/vue3";
import useAuth from "@e/Composables/useAuth";
import PureButtonLink from "@e/Components/Button/PureButtonLink.vue";
import Eye from "@e/Icons/Eye.vue";
import PencilSquare from "@e/Icons/PencilSquare.vue";
import Dropdown from "../Dropdown/Dropdown.vue";
import Trash from "@e/Icons/Trash.vue";
import DropdownItem from "../Dropdown/DropdownItem.vue";
import DropdownButton from "../Dropdown/DropdownButton.vue";

const { t: $t } = useI18n()

const routePrefix = inject('routePrefix');
const confirmation = inject('confirmation');

const props = defineProps({
    itemId: {
        type: Number,
        required: true,
    }
})

const emit = defineEmits(['onDelete'])

const {user} = useAuth();

const confirmationDeletion = ref(false);

const deleteUser = () => {
    confirmation()
        .title($t('e-user.delete_user'))
        .description($t('e-user.confirm_delete_user'))
        .destructive()
        .onConfirm((dialog) => {
            dialog.isLoading(true);

            router.delete(route(`${routePrefix}.users.delete`, {
                user: props.itemId,
            }), {
                onSuccess() {
                    confirmationDeletion.value = false;
                    emit('onDelete')
                    emitter.emit('userDelete', props.itemId);
                    dialog.reset();
                },
                onFinish() {
                    dialog.close();
                }
            })
        })
        .show();
}
</script>
<template>
    <div>
        <div class="flex flex-row items-center justify-end gap-xs">
            <PureButtonLink :href="route(`${routePrefix}.users.view`, {user: itemId})" v-tooltip="$t('e-general.view')">
                <Eye/>
            </PureButtonLink>

            <Dropdown placement="bottom-end">
                <template #trigger>
                    <DropdownButton/>
                </template>

                <template #content>
                    <DropdownItem :href="route(`${routePrefix}.users.edit`, {user: itemId})">
                        <template #icon>
                            <PencilSquare/>
                        </template>

                        {{ $t('e-general.edit') }}
                    </DropdownItem>

                    <template v-if="user.id !== itemId">
                        <DropdownItem @click="deleteUser" as="button">
                            <template #icon>
                                <Trash class="text-red-500"/>
                            </template>

                            {{ $t('e-general.delete') }}
                        </DropdownItem>
                    </template>
                </template>
            </Dropdown>
        </div>
    </div>
</template>
