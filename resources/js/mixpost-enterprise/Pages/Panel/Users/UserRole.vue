<script setup>
import Radio from "@e/Components/Form/Radio.vue";

const props = defineProps(['modelValue']);

const emits = defineEmits(['update:modelValue']);

const update = (val) => {
    emits('update:modelValue', val)
}
</script>
<template>
    <div>
        <div>
            <label class="flex items-start">
                <Radio v-bind:checked="modelValue" @update:checked="update" value="admin"/>

                <span class="flex flex-col ml-xs rtl:ml-0 rtl:mr-xs">
                    <span>{{ $t('e-team.admin') }}</span>
                    <span class="text-gray-500">{{ $t('e-team.full_edit') }}</span>
                </span>
            </label>
        </div>

        <div class="mt-xs">
            <label class="flex items-start">
                <Radio v-bind:checked="modelValue" @update:checked="update" value="member"/>

                <span class="flex flex-col ml-xs rtl:ml-0 rtl:mr-xs">
                    <span>{{ $t('e-team.member')}}</span>
                    <span class="text-gray-500">{{ $t('e-team.limited_edit')}}</span>
                </span>
            </label>
        </div>
    </div>
</template>
