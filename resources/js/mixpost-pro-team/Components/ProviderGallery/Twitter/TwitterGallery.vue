<script setup>
import OneImage from "@p/Components/ProviderGallery/Twitter/OneImage.vue"
import TwoImage from "@p/Components/ProviderGallery/Twitter/TwoImage.vue"
import ThreeImage from "@p/Components/ProviderGallery/Twitter/ThreeImage.vue"
import FourImage from "@p/Components/ProviderGallery/Twitter/FourImage.vue"
import Video from "@p/Components/ProviderGallery/Twitter/Video.vue";

defineProps({
    media: {
        type: Array,
        required: true
    }
})
</script>
<template>
    <div v-if="media.length">
        <div v-if="media[0].is_video" class="overflow-hidden rounded-xl">
            <Video :media="media[0]"/>
        </div>

        <div v-else class="overflow-hidden rounded-xl">
            <OneImage v-if="media.length === 1" :media="media[0]"/>
            <TwoImage v-if="media.length === 2" :media="media"/>
            <ThreeImage v-if="media.length === 3" :media="media"/>
            <FourImage v-if="media.length > 3" :media="media"/>
        </div>
    </div>
</template>
