<script setup>
import {inject} from "vue";
import {Head, useForm} from "@inertiajs/vue3";
import {cloneDeep} from "lodash";
import useEnterpriseConsole from "@p/Composables/useEnterpriseConsole";
import AdminLayout from "@p/Layouts/Admin.vue";
import Panel from "@p/Components/Surface/Panel.vue";
import PrimaryButton from "@p/Components/Button/PrimaryButton.vue";
import UploadButton from "@p/Components/Media/UploadButton.vue";
import SecondaryButton from "@p/Components/Button/SecondaryButton.vue";
import Error from "@p/Components/Form/Error.vue";
import HorizontalGroup from "@p/Components/Layout/HorizontalGroup.vue";
import DangerButton from "@p/Components/Button/DangerButton.vue";
import X from "@p/Icons/X.vue";
import Settings from "@p/Layouts/Child/Settings.vue";

defineOptions({layout: AdminLayout});

const routePrefix = inject('routePrefix');

const props = defineProps({
    configs: {
        required: true,
        type: Object,
    }
});

const form = useForm(cloneDeep(props.configs));

const save = () => {
    form.put(route(`${routePrefix}.configs.theme.update`));
}

const {enterpriseConsole} = useEnterpriseConsole()
</script>
<template>
    <Head :title="$t('theme.customization')"/>

    <Settings>
        <form method="post" @submit.prevent="save">
            <Panel>
                <template #title>{{ $t('theme.customization') }}</template>
                <template #description>{{ $t('theme.change_logo_favicon') }}</template>
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
                                <SecondaryButton id="logo">{{ $t('theme.upload_logo') }}</SecondaryButton>
                            </UploadButton>

                            <template v-if="form.logo_url">
                                <DangerButton @click="form.logo_url = ''" size="sm"
                                              v-tooltip="$t('theme.upload_logo')">
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
                                <SecondaryButton id="logo">{{ $t('theme.upload_favicon') }} (16 x 16 px) (png)
                                </SecondaryButton>
                            </UploadButton>

                            <template v-if="form.favicon_url">
                                <DangerButton @click="form.favicon_url = ''" size="sm"
                                              v-tooltip="$t('theme.remove_favicon')">
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
                                <SecondaryButton id="logo">{{ $t('theme.upload_favicon') }} (192 x 192 px) (png)
                                </SecondaryButton>
                            </UploadButton>

                            <template v-if="form.favicon_chrome_small_url">
                                <DangerButton @click="form.favicon_chrome_small_url = ''" size="sm"
                                              v-tooltip=" $t('theme.upload_favicon')">
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
                                <SecondaryButton id="logo">{{ $t('theme.upload_favicon') }} (512 x 512 px) (png)
                                </SecondaryButton>
                            </UploadButton>

                            <template v-if="form.favicon_chrome_medium_url">
                                <DangerButton @click="form.favicon_chrome_medium_url = ''" size="sm"
                                              v-tooltip="$t('theme.remove_favicon')">
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

                <div class="flex items-center mt-lg">
                    <PrimaryButton type="submit" :disabled="form.processing"
                                   :isLoading="form.processing">{{ $t('general.save') }}
                    </PrimaryButton>
                </div>
            </Panel>
        </form>

        <template v-if="enterpriseConsole.url">
            <Panel class="mt-lg">
                <template #title>{{ $t('theme.theme_color') }}</template>
                <template #description>{{ $t('theme.rebrand_company') }}</template>

                <a :href="`${enterpriseConsole.url}/configs/theme`">
                    <PrimaryButton>
                        {{ $t('theme.change_theme_color') }}
                    </PrimaryButton>
                </a>
            </Panel>
        </template>
    </Settings>
</template>
