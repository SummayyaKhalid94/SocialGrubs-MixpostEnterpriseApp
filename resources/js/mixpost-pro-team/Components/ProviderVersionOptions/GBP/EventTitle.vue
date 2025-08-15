<script setup>
import HorizontalGroup from "@p/Components/Layout/HorizontalGroup.vue";
import Label from "@p/Components/Form/Label.vue";
import Input from "@p/Components/Form/Input.vue";

defineProps({
    options: {
        type: Object,
        required: true
    },
    labelName: {
        type: String,
        default: ''
    }
})
</script>
<template>
    <HorizontalGroup>
        <template #title>
            <Label for="event_title">{{ labelName || $t('service.gbp.event_title') }}</Label>
        </template>

        <Input v-model="options.event_title" id="event_title"/>
    </HorizontalGroup>
</template>
