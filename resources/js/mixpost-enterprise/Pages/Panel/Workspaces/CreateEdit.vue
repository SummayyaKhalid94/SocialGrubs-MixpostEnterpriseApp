<script setup>
import {computed, inject, onMounted, ref} from "vue";
import { useI18n } from "vue-i18n";
import {Head, useForm} from '@inertiajs/vue3';
import {cloneDeep, random} from "lodash";
import {ACCESS_STATUS_SUBSCRIPTION} from "@e/Constants/Workspace";
import usePageMode from "@e/Composables/usePageMode";
import useNotifications from "@e/Composables/useNotifications";
import PageHeader from "@e/Components/DataDisplay/PageHeader.vue";
import Panel from "@e/Components/Surface/Panel.vue";
import HorizontalGroup from "@e/Components/Layout/HorizontalGroup.vue";
import Error from "@e/Components/Form/Error.vue";
import Input from "@e/Components/Form/Input.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import SecondaryButton from "@e/Components/Button/SecondaryButton.vue";
import DialogModal from "@e/Components/Modal/DialogModal.vue";
import ColorPicker from "@p/Components/Package/ColorPicker.vue";
import {COLOR_PALLET_LIST} from "@p/Constants/ColorPallet";
import SelectUser from "@e/Components/User/SelectUser/SelectUser.vue";
import LabelSuffix from "@e/Components/Form/LabelSuffix.vue";
import Actions from "@e/Components/Workspace/Actions.vue";
import Select from "@e/Components/Form/Select.vue";
import Alert from "@e/Components/Util/Alert.vue";

const props = defineProps({
    mode: {
        required: true,
        type: String,
        default: 'create',
    },
    workspace: {
        type: Object
    }
})

const { t: $t } = useI18n()

const {notify} = useNotifications();

const routePrefix = inject('routePrefix');

const pageTitle = computed(() => {
    if (isCreate.value) {
        return $t('dashboard.create_workspace');
    }

    return $t('e-workspace.edit_workspace');
});

const {isCreate, isEdit} = usePageMode();

const changeColorModal = ref(false);
const changeColorHex = ref('');

const selectedOwner = ref(isEdit.value && props.workspace.owner ? {
    key: props.workspace.owner.id,
    label: props.workspace.owner.name,
    email: props.workspace.owner.email,
} : null);


const form = useForm(isEdit.value ? cloneDeep(props.workspace) : {
    name: '',
    hex_color: '',
    access_status: ACCESS_STATUS_SUBSCRIPTION
});

const selectColor = () => {
    form.hex_color = changeColorHex.value
    changeColorModal.value = false;
}

const pickRandomColor = () => {
    const colorList = COLOR_PALLET_LIST();

    return colorList[random(0, colorList.length - 1)]
}

onMounted(() => {
    if (isCreate.value) {
        const randomColor = pickRandomColor();

        form.hex_color = randomColor;
        changeColorHex.value = randomColor;
    }

    if (isEdit.value) {
        changeColorHex.value = props.workspace.hex_color;
    }
})

const getTransformedForm = () => {
    return form.transform((data) => ({
        ...data,
        ...{
            owner_id: selectedOwner.value ? selectedOwner.value.key : null,
        },
    }));
}

const store = () => {
    getTransformedForm().post(route(`${routePrefix}.workspaces.store`))
}

const update = () => {
    getTransformedForm().put(route(`${routePrefix}.workspaces.update`, {'workspace': props.workspace.uuid}), {
        onSuccess: () => {
            notify('success', $t('e-workspace.workspace_updated'));
        }
    })
}

const submit = () => {
    if (isCreate.value) {
        store();
    }

    if (isEdit.value) {
        update();
    }
}
</script>
<template>
    <Head :title="pageTitle"/>

    <div class="row-py w-full mx-auto">
        <PageHeader :title="pageTitle">
            <template v-if="isEdit">
                <Actions :workspace="workspace" :edit="false"/>
            </template>
        </PageHeader>

        <div class="row-px">
            <form method="post" @submit.prevent="submit">
                <Panel>
                    <template #title>{{ $t('e-general.details') }}</template>

                    <HorizontalGroup>
                        <template #title>
                            <label for="name">{{ $t('e-general.name') }}
                                <LabelSuffix danger>*</LabelSuffix>
                            </label>
                        </template>

                        <Input v-model="form.name"
                               type="text"
                               id="name"
                               :placeholder="$t('e-workspace.workspace_name')"
                               class="w-full"
                               autocomplete="off"
                               :autofocus="isCreate"
                               required/>

                        <template #footer>
                            <Error :message="form.errors.name"/>
                        </template>
                    </HorizontalGroup>

                    <HorizontalGroup class="mt-lg">
                        <template #title>
                            <label for="access_status">{{ $t('e-general.access_status') }}</label>
                        </template>
                        <Select v-model="form.access_status" id="access_status">
                            <option value="subscription"> {{ $t('subscription.requires_subscription') }}</option>
                            <option value="unlimited">{{ $t('e-workspace.unlimited') }}</option>
                            <option value="locked">{{ $t('e-workspace.locked') }}</option>
                        </Select>
                        <template #footer>
                            <Error :message="form.errors.access_status"/>
                        </template>
                    </HorizontalGroup>

                    <HorizontalGroup class="mt-lg">
                        <template #title>
                            {{$t('e-theme.color')}}
                        </template>

                        <div @click="changeColorModal = true"
                             :style="{'background': form.hex_color}"
                             role="button"
                             type="button"
                             class="w-xl h-xl rounded-md"/>
                    </HorizontalGroup>
                </Panel>

                <Panel class="mt-lg">
                    <template #title>{{ $t('e-general.owner') }}</template>

                   <div class="form-field">
                       <SelectUser v-model="selectedOwner"
                                   :users="selectedOwner ? [selectedOwner] : []"
                       />

                       <Alert v-if="isEdit"
                              :closeable="false"
                              class="mt-lg">{{ $t('panel.add_admin_role')}}
                       </Alert>

                       <Error :message="form.errors.owner_id"/>
                   </div>
                </Panel>

                <PrimaryButton type="submit"
                               class="mt-lg"
                               :disabled="form.processing"
                               :isLoading="form.processing">
                    {{ isCreate ? $t('e-general.create') : $t('e-workspace.update') }}
                </PrimaryButton>
            </form>
        </div>
    </div>

    <DialogModal :show="changeColorModal" max-width="md" @close="changeColorModal = false">
        <template #header>
            {{ $t('e-workspace.change_workspace_color') }}
        </template>
        <template #body>
            <template v-if="changeColorModal" class="flex flex-col">
                <ColorPicker v-model="changeColorHex"/>
            </template>
        </template>
        <template #footer>
            <SecondaryButton @click="changeColorModal = false" class="mr-xs rtl:mr-0 rtl:ml-xs">
                {{ $t('e-general.cancel')}}
            </SecondaryButton>
            <PrimaryButton @click="selectColor">{{ $t('e-general.done') }}</PrimaryButton>
        </template>
    </DialogModal>
</template>
