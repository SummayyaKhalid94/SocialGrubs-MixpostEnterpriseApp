<script setup>
import Box from "@p/Components/Layout/Box.vue";
import CoverStyle from "@p/Components/DataDisplay/CoverStyle.vue";

defineProps({
    media: {
        type: Object,
        required: true
    }
})
</script>
<template>
    <Box>
        <CoverStyle :src="media.thumb_url" alt="Image"/>
    </Box>
</template>
