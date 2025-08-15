<script setup>
import {inject, onMounted} from "vue";
import useMedia from "@p/Composables/useMedia";
import useNotifications from "@p/Composables/useNotifications";
import UploadMedia from "@p/Components/Media/UploadMedia.vue"
import MediaSelectable from "@p/Components/Media/MediaSelectable.vue";
import MediaFile from "@p/Components/Media/MediaFile.vue";
import Masonry from "@p/Components/Layout/Masonry.vue";
import SectionTitle from "@p/Components/DataDisplay/SectionTitle.vue";

const workspaceCtx = inject('workspaceCtx');

const props = defineProps({
    columns: {
        type: Number,
        default: 3
    },
    maxSelectedItems: {
        type: Number,
        default: -1 //infinite
    },
    mimeTypes: {
        type: Array,
        default: []
    },
    selectedItems:{
        type: Array,
        default: []
    }
})

const {notify} = useNotifications();

const {
    page,
    items,
    endlessPagination,
    selected,
    toggleSelect,
    deselectAll,
    removeItems,
    isSelected,
    createObserver
} = useMedia('mixpost.media.fetchUploads', {workspace: workspaceCtx.id}, props.maxSelectedItems, props.mimeTypes, props.selectedItems);

onMounted(() => {
    createObserver();
});

defineExpose({selected, deselectAll, removeItems})
</script>
<template>
    <UploadMedia :max-selection="4"
                 :combines-mime-types="''"
                 :selected="selected"
                 :toggleSelect="toggleSelect"
                 :isSelected="isSelected"
                 :columns="columns"
                 :mimeTypes="props.mimeTypes"
    />

    <div :class="{'mt-lg': items.length}">
        <template v-if="items.length">
            <SectionTitle class="mb-4">{{ $t('media.library') }}</SectionTitle>

            <Masonry :items="items" :columns="columns">
                <template #default="{item}">
                    <MediaSelectable v-if="item" :active="isSelected(item)" @click="toggleSelect(item)">
                        <MediaFile :media="item"/>
                    </MediaSelectable>
                </template>
            </Masonry>
        </template>
        <div ref="endlessPagination" class="-z-10 w-full"/>
    </div>
</template>
