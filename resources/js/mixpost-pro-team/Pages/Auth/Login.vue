<script setup>
import { inject, ref, watch } from "vue";
import { Head, useForm, Link, usePage } from "@inertiajs/vue3";
import { useI18n } from "vue-i18n";
import { Trans } from "@p/Services/Internationalization";
import useEnterpriseConsole from "@p/Composables/useEnterpriseConsole";
import AuthLayout from "@p/Layouts/Auth.vue";
import Panel from "@p/Components/Surface/Panel.vue";
import HorizontalGroup from "@p/Components/Layout/HorizontalGroup.vue";
import Error from "@p/Components/Form/Error.vue";
import Input from "@p/Components/Form/Input.vue";
import PrimaryButton from "@p/Components/Button/PrimaryButton.vue";
import Label from "../../Components/Form/Label.vue";
import Checkbox from "../../Components/Form/Checkbox.vue";
import Flex from "../../Components/Layout/Flex.vue";
import AuthBgImg from "@pimg/bg-auth.png";
import Logo from "@p/Components/DataDisplay/Logo.vue";
import ImgSocial from "@pimg/social-svg.svg";
import ImgGrubs from "@pimg/grubs-svg.svg";
import ImgSocialGrubsArabic from "@pimg/authSocialGrubsArabic.svg";

defineOptions({ layout: AuthLayout });
const lang = ref("en-GB");
const I18n = useI18n();
const { locale } = useI18n();

console.log(I18n);

const props = defineProps({
  locales: {
    type: Array,
    required: true,
  },
  is_forgot_password_enabled: {
    type: Boolean,
    required: true,
  },
});

const routePrefix = inject("routePrefix");

const form = useForm({
  email: "",
  password: "",
  remember: true,
});

const getLocaleDirection = (locale) => {
  return props.locales.find((item) => item.long === locale).direction || "ltr";
};

const submit = () => {
  form.post(route("mixpost.login"), {
    onSuccess() {
      const userLocale = usePage().props.mixpost.settings.locale;
      Trans.changeLocale(I18n, userLocale, getLocaleDirection(userLocale));
    },
  });
};

const { enterpriseConsole } = useEnterpriseConsole();
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
  <Head :title="$t('auth.sign_in')" />

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
              {{ $t("auth.login_account") }}
            </template>

            <template #description>
              {{ $t("auth.enter_details") }}
            </template>

            <Error
              v-for="error in form.errors"
              :key="error"
              :message="error"
              class="mb-xs"
            />

            <div class="mb-md">
              <label for="email" class="block mb-1 font-medium">
                {{ $t("general.email") }}
              </label>
              <Input
                v-model="form.email"
                type="email"
                id="email"
                class="w-full"
                required
              />
            </div>

            <div class="mb-md">
              <label for="password" class="block mb-1 font-medium">
                {{ $t("auth.password") }}
              </label>
              <Input
                v-model="form.password"
                type="password"
                id="password"
                class="w-full"
                required
              />
            </div>

            <div class="mt-md">
              <Label>
                <Checkbox v-model:checked="form.remember" />
                {{ $t("auth.remember_me") }}
              </Label>
            </div>

            <Flex class="justify-between mt-lg">
              <PrimaryButton
                :disabled="form.processing"
                :isLoading="form.processing"
                type="submit"
              >
                {{ $t("auth.login") }}
              </PrimaryButton>

              <template v-if="$page.props.is_forgot_password_enabled">
                <Link
                  :href="route(`${routePrefix}.password.request`)"
                  class="link-primary"
                >
                  {{ $t("auth.forgot_password") }}
                </Link>
              </template>
            </Flex>

            <template v-if="enterpriseConsole.registration_url">
              <div class="text-center mt-2xl">
                <p class="text-black">
                  {{ $t("auth.dont_have_account") }}
                  <a :href="enterpriseConsole.registration_url" class="link-primary">
                    {{ $t("auth.register_here") }}
                  </a>
                </p>
              </div>
            </template>
          </Panel>
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
        <h1
          class="text-3xl font-bold text-white text-center"
          v-if="lang === 'en-GB'"
        >
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
