<script setup>
import AspectRatioBox from "@p/Components/Layout/AspectRatioBox.vue";
import Box from "@p/Components/Layout/Box.vue";
import CoverStyle from "@p/Components/DataDisplay/CoverStyle.vue";

defineProps({
    media: {
        type: Array,
        required: true
    }
})
</script>
<template>
    <div class="flex flex-row gap-1">
        <div v-for="item in media" :key="media.id" class="w-1/2 grow-0">
            <Box>
                <AspectRatioBox>
                    <CoverStyle :src="item.thumb_url"/>
                </AspectRatioBox>
            </Box>
        </div>
    </div>
</template>
