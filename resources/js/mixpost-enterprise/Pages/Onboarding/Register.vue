<script setup>
import { Head, useForm, Link, usePage } from "@inertiajs/vue3";
import { inject, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Trans } from "@p/Services/Internationalization";
import AuthLayout from "@p/Layouts/Auth.vue";
import Panel from "@e/Components/Surface/Panel.vue";
import HorizontalGroup from "@e/Components/Layout/HorizontalGroup.vue";
import Error from "@e/Components/Form/Error.vue";
import Input from "@e/Components/Form/Input.vue";
import Select from "@e/Components/Form/Select.vue";
import PrimaryButton from "@e/Components/Button/PrimaryButton.vue";
import Checkbox from "@e/Components/Form/Checkbox.vue";
import VerticalGroup from "@e/Components/Layout/VerticalGroup.vue";
import Flex from "@e/Components/Layout/Flex.vue";
import Label from "@e/Components/Form/Label.vue";
import AuthBgImg from "@pimg/bg-auth.png";
import Logo from "@p/Components/DataDisplay/Logo.vue";
import ImgSocial from "@pimg/social-svg.svg";
import ImgGrubs from "@pimg/grubs-svg.svg";
import ImgSocialGrubsArabic from "@pimg/authSocialGrubsArabic.svg";

defineOptions({ layout: AuthLayout });

const routePrefix = inject("routePrefix");
const lang = ref("en-GB");
const I18n = useI18n();
const { locale } = useI18n();

const props = defineProps({
  locales: {
    type: Array,
    required: true,
  },
  invitation: {
    type: Object,
    required: true,
  },
});

const form = useForm({
  name: "",
  email: props.invitation.email,
  password: "",
  password_confirmation: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  terms: false,
});

const submit = () => {
  form.post(route(`${routePrefix}.register`));
};

const getLocaleDirection = (locale) => {
  return props.locales.find((item) => item.long === locale).direction || "ltr";
};

function updateText(newLangValue) {
  console.log(newLangValue);
  lang.value = newLangValue;
}

// run on mount
updateText(locale.value);

// react whenever locale changes
watch(locale, (newVal) => {
  updateText(newVal);
});
</script>
<style scoped>
.border-gray-100 {
  border-color: white;
}

.bg-auth {
  background-size: cover;
  background-position: center right;
}

.text-3xl {
  font-size: 80px;
}
</style>
<template>
  <Head :title="$t('onboarding.register')" />

  <div
    class="min-h-screen flex"
    :class="{ 'flex-row-reverse': $page.props.locale_direction === 'rtl' }"
  >
    <!-- Left / Right Column - Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-[475px]">
        <Link :href="route('mixpost.home')" class="flex items-center px-lg">
          <Logo :key="usePage()" />
        </Link>
        <form @submit.prevent="submit" class="lg:pt-[92px]">
          <Panel>
            <template #title>
              {{ $t("panel.register_account") }}
            </template>
            <template #description>
              <div class="whitespace-pre">
                {{ $t("panel.start_free_trial") }}
              </div>
            </template>

            <Error v-for="error in form.errors" :message="error" class="mb-xs" />

            <div class="mb-md">
                <label for="name">{{ $t("e-general.name") }}</label>
              

              <Input
                v-model="form.name"
                :error="form.errors.name"
                type="text"
                id="name"
                class="w-full"
                required
                autofocus
                autocomplete="name"
              />
            </div>

            <div class="mt-md">
                <label for="email">{{ $t("onboarding.email_address") }}</label>

              <Input
                v-model="form.email"
                :error="form.errors.email"
                type="email"
                id="email"
                class="w-full"
                required
                autocomplete="username"
              />
            </div>

            <div class="mt-md">
                <label for="password">{{ $t("e-general.password") }}</label>

              <Input
                v-model="form.password"
                :error="form.errors.password"
                type="password"
                id="password"
                class="w-full"
                required
                autocomplete="new-password"
              />
            </div>

            <div class="mt-md">
                <label for="password_confirmation">{{
                  $t("e-general.confirm_password")
                }}</label>

              <div class="w-full">
                <Input
                  v-model="form.password_confirmation"
                  :error="form.errors.password_confirmation"
                  type="password"
                  id="password_confirmation"
                  class="w-full"
                  required
                  autocomplete="new-password"
                />
              </div>
            </div>

            <HorizontalGroup v-if="form.errors.timezone" class="mt-lg">
              <template #title>{{ $t("e-general.timezone") }}</template>

              <div>
                <Select v-model="form.timezone">
                  <optgroup
                    v-for="(list, groupName) in $page.props.timezone_list"
                    :label="groupName"
                  >
                    <option
                      v-for="(timezoneName, timezoneCode) in list"
                      :value="timezoneCode"
                    >
                      {{ timezoneName }}
                    </option>
                  </optgroup>
                </Select>
              </div>

              <template #footer>
                <Error :message="$t('dashboard.select_timezone')" />
              </template>
            </HorizontalGroup>

            <VerticalGroup class="mt-lg">
              <Flex :responsive="false" class="items-center">
                <Checkbox v-model:checked="form.terms" id="terms" required />
                <Label for="terms" class="mb-0!">
                  <span
                    class="inline-block markdown"
                    v-html="$page.props.configs.terms_accept_description"
                  />
                </Label>
              </Flex>
            </VerticalGroup>
          </Panel>

          <div class="flex items-center justify-between mt-lg">
            <PrimaryButton :disabled="form.processing" :indigo="true" type="submit"
              >{{ $t("onboarding.register") }}
            </PrimaryButton>
            <Link :href="route('mixpost.login')" class="link-primary">{{
              $t("onboarding.already_registered")
            }}</Link>
          </div>
        </form>
        <div class="text-center mt-2xl">
          <p class="text-black">
            <button
              @click="Trans.changeLocale(I18n, 'en-GB', 'ltr')"
              class="link-primary"
            >
              English
            </button>
            /
            <button
              @click="Trans.changeLocale(I18n, 'ar-SA', 'rtl')"
              class="link-primary"
            >
              عربي
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- Right / Left Column - Image + Text -->
    <div
      class="hidden md:flex w-1/2 relative bg-auth"
      :style="{ backgroundImage: `url(${AuthBgImg})` }"
    >
      <div class="absolute inset-0"></div>
      <div class="relative z-10 w-full flex items-end justify-center p-8 pb-[116px]">
        <h1 class="text-3xl font-bold text-white text-center" v-if="lang === 'en-GB'">
          <img :src="ImgSocial" alt="" class="pb-[47px]" />
          <img :src="ImgGrubs" alt="" />
        </h1>
        <h1 class="text-3xl font-bold text-white text-center" v-else>
          <img :src="ImgSocialGrubsArabic" alt="" />
        </h1>
      </div>
    </div>
  </div>
</template>
