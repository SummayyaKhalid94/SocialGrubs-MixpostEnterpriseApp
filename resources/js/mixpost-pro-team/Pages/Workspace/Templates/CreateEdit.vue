<script setup>
import {cloneDeep} from "lodash";
import {computed, defineAsyncComponent, inject, provide, ref} from "vue";
import {Head, router, useForm, Link} from "@inertiajs/vue3";
import NProgress from "nprogress";
import {useI18n} from "vue-i18n";
import usePostVersions from "@p/Composables/usePostVersions";
import useEditor from "@p/Composables/useEditor";
import useNotifications from "@p/Composables/useNotifications";
import useTemplate from "@p/Composables/useTemplate";
import PageHeader from "@p/Components/DataDisplay/PageHeader.vue";
import Panel from "@p/Components/Surface/Panel.vue";
import Input from "@p/Components/Form/Input.vue";
import LabelSuffix from "@p/Components/Form/LabelSuffix.vue";
import VerticalGroup from "@p/Components/Layout/VerticalGroup.vue";
import VariableManager from "@p/Components/VariableManager/VariableManager.vue";
import HashtagManager from "@p/Components/HashtagManager/HashtagManager.vue";
import Editor from "@p/Components/Package/Editor.vue";
import PostMedia from "@p/Components/Post/PostMedia.vue";
import EmojiPicker from "@p/Components/Package/EmojiPicker.vue";
import PostAddMedia from "@p/Components/Post/PostAddMedia.vue";
import PrimaryButton from "@p/Components/Button/PrimaryButton.vue";
import SecondaryButton from "@p/Components/Button/SecondaryButton.vue";
import Trash from "@p/Icons/Trash.vue";
import DangerButton from "@p/Components/Button/DangerButton.vue";
import Flex from "@p/Components/Layout/Flex.vue";
const AIAssist = defineAsyncComponent(() => import("@p/Components/AI/Text/AIAssist.vue"));

const {t: $t} = useI18n()

const props = defineProps(['template']);

const template = props.template ? cloneDeep(props.template) : null;

provide('postCtx', {});
const workspaceCtx = inject('workspaceCtx');

const {notify} = useNotifications();
const {versionContentObject} = usePostVersions();
const {insertEmoji, insertContent, replaceContent, updateContent, focusEditor} = useEditor();
const {createPost, formatTemplateContent, deleteTemplate} = useTemplate();

const isLoading = ref(false);
const form = useForm({
    name: template ? template.name : '',
    content: template ? template.content : [versionContentObject()]
});

const title = computed(() => {
    if (props.template) {
        return $t('template.edit_template');
    }

    return $t('template.create_new_template')
})

const getFormattedData = () => {
    return {
        name: form.name,
        content: formatTemplateContent(form.content)
    };
}

const save = () => {
    if (!props.template) {
        store(getFormattedData());
    }

    if (props.template) {
        update(getFormattedData());
    }
}

const store = (data, redirectToCreateRoute = false) => {
    NProgress.start();
    isLoading.value = true;

    axios.post(route('mixpost.templates.api.store', {workspace: workspaceCtx.id}), data).then((response) => {
        notify('success', $t('template.template_created'));

        if (!redirectToCreateRoute) {
            router.get(route('mixpost.templates.edit', {workspace: workspaceCtx.id, template: response.data.id}), {}, {
                preserveScroll: true,
            });

            return;
        }

        router.get(route('mixpost.templates.create', {workspace: workspaceCtx.id}));
    }).finally(() => {
        NProgress.done();
        isLoading.value = false;
    });
}

const update = (data) => {
    NProgress.start();
    isLoading.value = true;

    axios.put(route('mixpost.templates.api.update', {workspace: workspaceCtx.id, template: props.template.id}), data)
        .then(() => {
            notify('success', $t('template.template_updated'));
        }).catch((error) => {
        notify('error', error);
    }).finally(() => {
        NProgress.done();
        isLoading.value = false;
    });
}
</script>
<template>
    <Head :title="title"/>

    <div class="w-full mx-auto row-py">
        <PageHeader :title="title">
            <div class="flex">
                <template v-if="template">
                    <PrimaryButton @click="() => {
                        createPost(getFormattedData().content)
                    }" class="mr-xs">
                        {{ $t('template.use_template') }}
                    </PrimaryButton>
                </template>

                <Link v-if="template" :href="route('mixpost.templates.create', { workspace: workspaceCtx.id })">
                    <SecondaryButton class="mr-xs"> {{ $t('template.create_new') }}</SecondaryButton>
                </Link>

                <template v-if="template">
                    <DangerButton @click="() => { deleteTemplate(template) }" size="sm">
                        <Trash/>
                    </DangerButton>
                </template>
            </div>
        </PageHeader>

        <div class="mt-lg row-px w-full">
            <form @submit.prevent="save">
                <Panel>
                    <template #title>{{ $t('general.details') }}</template>
                    <VerticalGroup class="mb-lg max-w-full!">
                        <template #title>
                            <label for="template_name">{{ $t('template.template_name') }}
                                <LabelSuffix :danger="true">*</LabelSuffix>
                            </label>
                        </template>
                        <Input type="text" v-model="form.name" id="template_name" required/>
                    </VerticalGroup>


                    <div class="form-field">
                        <template v-for="(item, index) in form.content" :key="index">
                            <Editor id="templateEditor"
                                    :value="item.body"
                                    :editable="true"
                                    @update="item.body = $event">
                                <template #default="props">
                                    <PostMedia :media="item.media" @updated="item.media = $event"/>

                                    <Flex :responsive="false"
                                          class="relative justify-between border-t border-gray-200 pt-md mt-md">
                                        <Flex :responsive="false">
                                            <EmojiPicker
                                                @selected="insertEmoji({ editorId: 'templateEditor', emoji: $event })"
                                                @close="focusEditor({ editorId: 'templateEditor' })"/>

                                            <PostAddMedia @insert="($event)=> {
                                                item.media = [...item.media, ...$event.items];

                                                if($event.crediting) {
                                                    insertContent({editorId: 'templateEditor', text: $event.crediting})
                                                }
                                            }"/>

                                            <HashtagManager :editAllowed="true"
                                                            @insert="insertContent({ editorId: 'templateEditor', text: $event })"/>

                                            <VariableManager :editAllowed="true"
                                                             @insert="insertContent({ editorId: 'templateEditor', text: $event })"/>

                                            <template v-if="$page.props.ai_is_ready_to_use">
                                                <AIAssist
                                                    @insert="insertContent({editorId: `templateEditor`, text: $event})"
                                                    @replace="replaceContent({editorId: `templateEditor`, text: $event})"
                                                    :text="item.body"
                                                />
                                            </template>
                                        </Flex>
                                    </Flex>
                                </template>
                            </Editor>
                        </template>
                    </div>

                    <Flex :responsive="false" class="items-center mt-lg">
                        <PrimaryButton :disabled="isLoading" type="submit" class="mr-xs">
                            {{ $t('template.save_template') }}
                        </PrimaryButton>

                        <template v-if="!template">
                            <PrimaryButton @click="() => { store(getFormattedData(), true) }" :disabled="isLoading"
                                           type="button">
                                {{ $t('template.save_create_new') }}
                            </PrimaryButton>
                        </template>
                    </Flex>
                </Panel>
            </form>
        </div>
    </div>
</template>
