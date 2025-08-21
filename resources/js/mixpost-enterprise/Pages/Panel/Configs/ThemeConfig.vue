<script setup>
import {computed, inject} from "vue";
import {Head, useForm} from "@inertiajs/vue3";
import {cloneDeep} from "lodash";
import useNotifications from "@e/Composables/useNotifications";
import Panel from "@e/Components/Surface/Panel.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import UploadButton from "@e/Components/Media/UploadButton.vue";
import SecondaryButton from "@e/Components/Button/SecondaryButton.vue";
import Error from "@e/Components/Form/Error.vue";
import Label from "@e/Components/Form/Label.vue";
import HorizontalGroup from "@e/Components/Layout/HorizontalGroup.vue";
import DangerButton from "@e/Components/Button/DangerButton.vue";
import X from "@e/Icons/X.vue";
import Select from "@e/Components/Form/Select.vue";
import ColoredBox from "@e/Components/Util/ColoredBox.vue";
import TriggerColorPicker from "@e/Components/Util/TriggerColorPicker.vue";
import PageHeader from "@e/Components/DataDisplay/PageHeader.vue";
import PreviewComponents from "@e/Components/Theme/PreviewComponents.vue";
import Flex from "@e/Components/Layout/Flex.vue";
import Settings from "@e/Layouts/Child/Settings.vue";

const routePrefix = inject('routePrefix');

const props = defineProps({
    configs: {
        required: true,
        type: Object,
    },
    primary_colors: {
        required: true,
        type: Object,
    }
});

const form = useForm(cloneDeep(props.configs));

const {notify} = useNotifications();

const save = () => {
    form.put(route(`${routePrefix}.configs.theme.update`));
}

const isCustom = computed(() => {
    return form.app_color === 'custom';
})
</script>
<template>
    <Head :title="$t('panel.customization')"/>

    <Settings>
        <Flex align="start" gap="gap-2xl">
            <div class="w-full md:w-3/5">
                <form method="post" @submit.prevent="save">
                    <Panel>
                        <template #title>{{ $t('e-theme.logo_favicon') }}</template>
                        <template #description>{{ $t('e-theme.rebrand_company') }}</template>

                        <HorizontalGroup>
                            <template #title>
                                <div class="flex">
                                    <UploadButton :withPreload="true" @upload="(e)=> {
                                    if(e.is_local_driver) {
                                       form.logo_url = `/storage/${e.path}`;
                                        return;
                                    }

                                     form.logo_url = e.url;
                            }" class="mr-xs">
                                        <SecondaryButton id="logo">{{ $t('e-theme.upload_logo') }}
                                        </SecondaryButton>
                                    </UploadButton>

                                    <template v-if="form.logo_url">
                                        <DangerButton @click="form.logo_url = ''" size="sm"
                                                      v-tooltip="$t('e-theme.remove_logo')">
                                            <X/>
                                        </DangerButton>
                                    </template>
                                </div>
                            </template>

                            <img v-if="form.logo_url"
                                 :src="form.logo_url"
                                 class="w-auto max-h-20 mt-xs"
                                 alt="Logo"/>

                            <template #footer>
                                <Error :message="form.errors.logo_url"/>
                            </template>
                        </HorizontalGroup>

                        <HorizontalGroup class="mt-lg">
                            <template #title>
                                <div class="flex">
                                    <UploadButton :withPreload="true" @upload="(e)=> {
                                    if(e.is_local_driver) {
                                       form.favicon_url = `/storage/${e.path}`;
                                        return;
                                    }

                                     form.favicon_url = e.url;
                            }" class="mr-xs">
                                        <SecondaryButton id="logo">{{ $t('e-theme.upload_favicon') }} (16 x 16 px)
                                        </SecondaryButton>
                                    </UploadButton>

                                    <template v-if="form.favicon_url">
                                        <DangerButton @click="form.favicon_url = ''" size="sm"
                                                      v-tooltip="$t('e-theme.remove_favicon')">
                                            <X/>
                                        </DangerButton>
                                    </template>
                                </div>
                            </template>

                            <img v-if="form.favicon_url"
                                 :src="form.favicon_url"
                                 class="w-auto max-h-20 mt-xs"
                                 alt="Logo"/>

                            <template #footer>
                                <Error :message="form.errors.favicon_url"/>
                            </template>
                        </HorizontalGroup>

                        <HorizontalGroup class="mt-lg">
                            <template #title>
                                <div class="flex">
                                    <UploadButton :withPreload="true" @upload="(e)=> {
                                    if(e.is_local_driver) {
                                       form.favicon_chrome_small_url = `/storage/${e.path}`;
                                        return;
                                    }

                                     form.favicon_chrome_small_url = e.url;
                            }" class="mr-xs">
                                        <SecondaryButton id="logo">{{ $t('e-theme.upload_favicon') }} (192 x 192
                                            px)
                                            (png)
                                        </SecondaryButton>
                                    </UploadButton>

                                    <template v-if="form.favicon_chrome_small_url">
                                        <DangerButton @click="form.favicon_chrome_small_url = ''" size="sm"
                                                      v-tooltip="$t('e-theme.remove_favicon')">
                                            <X/>
                                        </DangerButton>
                                    </template>
                                </div>
                            </template>

                            <img v-if="form.favicon_chrome_small_url"
                                 :src="form.favicon_chrome_small_url"
                                 class="w-auto max-h-20 mt-xs"
                                 alt="Logo"/>

                            <template #footer>
                                <Error :message="form.errors.favicon_chrome_small_url"/>
                            </template>
                        </HorizontalGroup>

                        <HorizontalGroup class="mt-lg">
                            <template #title>
                                <div class="flex">
                                    <UploadButton :withPreload="true" @upload="(e)=> {
                                    if(e.is_local_driver) {
                                       form.favicon_chrome_medium_url = `/storage/${e.path}`;
                                        return;
                                    }

                                     form.favicon_chrome_medium_url = e.url;
                            }" class="mr-xs">
                                        <SecondaryButton id="logo">{{ $t('e-theme.upload_favicon') }} (512 x 512
                                            px)
                                            (png)
                                        </SecondaryButton>
                                    </UploadButton>

                                    <template v-if="form.favicon_chrome_medium_url">
                                        <DangerButton @click="form.favicon_chrome_medium_url = ''" size="sm"
                                                      v-tooltip="$t('e-theme.remove_favicon')">
                                            <X/>
                                        </DangerButton>
                                    </template>
                                </div>
                            </template>

                            <img v-if="form.favicon_chrome_medium_url"
                                 :src="form.favicon_chrome_medium_url"
                                 class="w-auto max-h-20 mt-xs"
                                 alt="Logo"/>

                            <template #footer>
                                <Error :message="form.errors.favicon_chrome_medium_url"/>
                            </template>
                        </HorizontalGroup>
                    </Panel>

                    <Panel class="mt-lg">
                        <template #title>{{ $t('e-theme.theme_color') }}</template>
                        <template #description>{{ $t('e-theme.rebrand_company') }}</template>

                        <HorizontalGroup class="mt-lg">
                            <template #title>
                                <label>{{ $t('e-theme.primary_color') }}</label>
                            </template>

                            <Select v-model="form.app_color">
                                <option v-for="color in primary_colors" :value="color.key">{{
                                        color.name
                                    }}
                                </option>
                                <option value="custom"> {{ $t('e-theme.custom') }}</option>
                            </Select>
                        </HorizontalGroup>

                        <template v-if="isCustom">
                            <HorizontalGroup class="mt-lg">
                                <template #title>
                                    <label>{{ $t('e-theme.primary_colors') }}</label>
                                </template>

                                <div>
                                    <Flex align="between" :responsive="false">
                                        <template v-for="(value, key) in form.app_custom_colors.primary">
                                            <TriggerColorPicker :color="value"
                                                                @update="form.app_custom_colors.primary[key] = $event">
                                                <ColoredBox :color="value">
                                                    {{ key }}
                                                </ColoredBox>
                                            </TriggerColorPicker>
                                        </template>
                                    </Flex>

                                    <div class="mt-xs">
                                        <a href="https://uicolors.app/browse/tailwind-colors" target="_blank"
                                           class="block link">- {{ $t('e-theme.inspire_here') }}</a>
                                        <a href="https://uicolors.app/create" target="_blank"
                                           class="block link">-
                                            {{ $t('e-theme.generate_here') }}</a>
                                    </div>
                                </div>
                            </HorizontalGroup>

                            <HorizontalGroup class="mt-lg">
                                <template #title>
                                    <label>{{ $t('e-theme.primary_button') }}</label>
                                </template>

                                <TriggerColorPicker :color="form.app_custom_colors.primary_context"
                                                    @update="form.app_custom_colors.primary_context = $event">
                                    <ColoredBox :color="form.app_custom_colors.primary_context"/>
                                </TriggerColorPicker>
                            </HorizontalGroup>
                        </template>

                        <hr class="my-lg">

                        <HorizontalGroup class="mt-lg">
                            <template #title>
                                <label> {{ $t('e-theme.alert_background') }}</label>
                            </template>

                            <TriggerColorPicker :color="form.app_custom_colors.alert"
                                                @update="form.app_custom_colors.alert = $event">
                                <ColoredBox :color="form.app_custom_colors.alert"/>
                            </TriggerColorPicker>
                        </HorizontalGroup>

                        <HorizontalGroup class="mt-lg">
                            <template #title>
                                <label>{{ $t('e-theme.alert_text') }}</label>
                            </template>

                            <TriggerColorPicker :color="form.app_custom_colors.alert_context"
                                                @update="form.app_custom_colors.alert_context = $event">
                                <ColoredBox :color="form.app_custom_colors.alert_context"/>
                            </TriggerColorPicker>
                        </HorizontalGroup>
                    </Panel>

                    <div class="flex items-center mt-lg">
                        <PrimaryButton type="submit" :disabled="form.processing"
                                       :isLoading="form.processing"> {{ $t('e-general.save') }}
                        </PrimaryButton>
                    </div>

                </form>
            </div>

            <div class="w-full md:w-2/5">
                <Panel>
                    <template #title>{{ $t('e-general.preview') }}</template>

                    <PreviewComponents :configs="form"/>
                </Panel>
            </div>
        </Flex>
    </Settings>
</template>
