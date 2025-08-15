<script setup>
import useBootstrap from "../Composables/useBootstrap";
import { Link, usePage } from "@inertiajs/vue3";
import useAuth from "../Composables/useAuth";
import Logo from "@p/Components/DataDisplay/Logo.vue";
import Notifications from "@p/Components/Util/Notifications.vue";
import UserMenu from "../Components/Navigation/UserMenu.vue";
import Preloader from "../Components/Util/Preloader.vue";
import Confirmation from "../Plugins/Confirmation/Confirmation.vue";
import { onMounted, ref } from "vue";
import LanguageSelectorModal from "@p/Components/User/LanguageSelectorModal.vue";

const showLanguagePopup = ref(false);
onMounted(() => {
  const page = usePage();
  console.log(page.props);
  if (page.props.settings.show_language_popup) {
    showLanguagePopup.value = true;
  }
});

const { bootstrapComplete } = useBootstrap();

const { user } = useAuth();
</script>
<template>
  <div
    class="flex flex-col h-screen min-h-full row-py row-px overflow-y-auto bg-stone-500"
    scroll-region
  >
    <template v-if="!bootstrapComplete">
      <Preloader />
    </template>

    <template v-else>
      <div class="w-full max-w-(--container-5xl) mx-auto">
        <div class="flex justify-between relative mb-12">
          <Link :href="route('mixpost.home')" class="flex items-center">
            <Logo />
          </Link>

          <template v-if="user">
            <UserMenu :responsive="true" />
          </template>
        </div>

        <slot />
      </div>
    </template>

    <Notifications />

    <Confirmation />

    <AuthPasswordConfirmation />
  </div>
  <LanguageSelectorModal
    v-if="$page.props.auth.user && !$page.props.auth.user.is_admin"
    :locales="$page.props.locales"
    :current-settings="$page.props.settings"
    :show="showLanguagePopup"
    @close="showLanguagePopup = false"
  />
</template>
