<script setup>
import {inject} from "vue";
import Dropdown from "@p/Components/Dropdown/Dropdown.vue";
import DropdownItem from "@p/Components/Dropdown/DropdownItem.vue"
import SecondaryButton from "@p/Components/Button/SecondaryButton.vue"
import ChevronDownIcon from "@p/Icons/ChevronDown.vue"
import CalendarIcon from "@p/Icons/Calendar.vue"

const calendarType = inject('calendarType');

const select = (type) => {
    calendarType.value = type;
}
</script>
<template>
    <Dropdown placement="bottom">
        <template #trigger>
            <SecondaryButton size="sm">
                <span class="inline-block mr-xs">{{ calendarType === 'month' ? $t('calendar.month') : $t('calendar.week') }}</span>
                <ChevronDownIcon/>
            </SecondaryButton>
        </template>

        <template #content>
            <DropdownItem as="button" @click="select('month')">
                <template #icon>
                    <CalendarIcon/>
                </template>

                {{ $t("calendar.month") }}
            </DropdownItem>

            <DropdownItem as="button" @click="select('week')">
                <template #icon>
                    <CalendarIcon/>
                </template>

                {{ $t("calendar.week") }}
            </DropdownItem>
        </template>
    </Dropdown>
</template>
