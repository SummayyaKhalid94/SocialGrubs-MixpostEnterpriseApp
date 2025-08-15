<script setup>
import {watch} from "vue";
import {useEditor, EditorContent} from "@tiptap/vue-3";
import useEditorHelper from "@p/Composables/useEditor";
import InstagramUsername from '@p/Extensions/TipTap/InstagramUsername'
import Hashtag from "@p/Extensions/TipTap/Hashtag"
import UserTag from "@p/Extensions/TipTap/UserTag"
import Variable from "@p/Extensions/TipTap/Variable"

const props = defineProps({
    value: {
        required: true
    }
});

const {defaultExtensions} = useEditorHelper();

const editor = useEditor({
    editable: false,
    content: props.value,
    extensions: [...defaultExtensions, ...[
        InstagramUsername,
        Hashtag,
        UserTag,
        Variable
    ]],
});

watch(() => props.value, () => {
    editor.value.commands.setContent(props.value);
});
</script>
<template>
    <editor-content :editor="editor"/>
</template>
