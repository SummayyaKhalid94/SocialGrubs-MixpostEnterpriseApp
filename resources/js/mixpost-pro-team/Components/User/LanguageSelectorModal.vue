<script setup>
import { reactive } from "vue";
import Select from "@p/Components/Form/Select.vue";
import PrimaryButton from "@p/Components/Button/PrimaryButton.vue";
import HorizontalGroup from "@p/Components/Layout/HorizontalGroup.vue";
import Error from "../Form/Error.vue";
import { useI18n } from "vue-i18n";
import { Trans } from "@p/Services/Internationalization";
import useNotifications from "@p/Composables/useNotifications";
import { useForm } from "@inertiajs/vue3";

const I18n = useI18n();
const {t: $t} = I18n;
const { notify } = useNotifications();

const props = defineProps({
  locales: Array,
  currentSettings: Object,
  show: Boolean,
});

const emit = defineEmits(["close"]);

const form = useForm({
  locale: props.currentSettings.locale,
  timezone: props.currentSettings.timezone,
  time_format: props.currentSettings.time_format,
  week_starts_on: props.currentSettings.week_starts_on,
  show_language_popup: !props.currentSettings.show_language_popup,
  errors: [],
});

const isLocaleInBeta = (locale) => {
  const localesInProduction = ["en-GB", "fr-CA", "ar-SA", "de-DE", "es-MX"];
  return !localesInProduction.includes(locale);
};

const getLocaleDirection = (locale) => {
    return props.locales.find((item) => item.long === locale).direction || 'ltr';
}

const save = () => {
  form.put(route("mixpost.profile.updatePreferences"), {
    preserveScroll: true,
    onSuccess() {
      Trans.changeLocale(I18n, form.locale, getLocaleDirection(form.locale));
      notify("success", $t("profile.preferences_updated"));
      emit('close');
    },
  });
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-10 bg-black/10 backdrop-blur-sm flex justify-center items-center"
  >
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <Error v-for="error in form.errors" :message="error" class="mb-xs" />

      <HorizontalGroup>
        <template #title>{{ $t("general.language") }}</template>

        <div>
          <Select v-model="form.locale">
            <option v-for="locale in locales" :value="locale.long">
              {{ locale.english }} - {{ locale.native }} - ({{ locale.long }})
              {{ isLocaleInBeta(locale.long) ? "[Beta]" : "" }}
            </option>
          </Select>

          <span
            v-if="isLocaleInBeta(form.locale)"
            class="text-xs text-gray-500 mt-xs block"
          >
            🚧 Language <span class="font-medium">{{ form.locale }}</span> is in beta and
            may not be fully translated or can contain errors.
          </span>
        </div>
      </HorizontalGroup>

      <PrimaryButton class="mt-4" @click="save">
        {{ $t("general.save") }}
      </PrimaryButton>
    </div>
  </div>
</template>
