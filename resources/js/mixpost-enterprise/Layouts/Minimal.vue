<script setup>
import { Link } from "@inertiajs/vue3";
import { inject, ref, onMounted } from "vue";
import useBootstrap from "../Composables/useBootstrap";
import useAuth from "../Composables/useAuth";
import Logo from "@e/Components/DataDisplay/Logo.vue";
import Notifications from "@e/Components/Util/Notifications.vue";
import UserMenu from "../Components/Navigation/UserMenu.vue";
import Confirmation from "../Plugins/Confirmation/Confirmation.vue";
import Preloader from "../Components/Util/Preloader.vue";
import { usePage } from "@inertiajs/vue3";
import LanguageSelectorModal from "@p/Components/User/LanguageSelectorModal.vue";
import { FeedbackFish } from "@feedback-fish/vue";

const showLanguagePopup = ref(false);
onMounted(() => {
  const page = usePage();

console.log(page.props);
  if (page.props.auth.user && !page.props.auth.user.is_admin) {
    if (page.props.settings.show_language_popup) {
      showLanguagePopup.value = true;
    }

    const BASE_URL = "https://bc.c3mailime.com";
    const script = document.createElement("script");
    script.src = BASE_URL + "/packs/js/sdk.js";
    script.defer = true;
    script.async = true;

    script.onload = function () {
      window.C3SDK.run({
        websiteToken: "phnUt6Fb2avKFRS4ypYnpSnv",
        baseUrl: BASE_URL,
      });
    };

    if (!document.querySelector("#feedback-fish")) {
      const script2 = document.createElement("script");
      script2.src = "https://feedback.fish/ff.js?pid=9fd2dc25550ed0";
      script2.defer = true;
      script2.id = "feedback-fish";
      document.body.appendChild(script2);
    }

    document.body.appendChild(script);
  }
});

const { bootstrapComplete } = useBootstrap();
const { user } = useAuth();
const routePrefix = inject("routePrefix");

console.log("e Minimal layout");
</script>
<style>
.btn-feedback-fish {
  position: fixed;
  top: 50%; /* center vertically */
  right: 20px; /* stick to right side */
  transform: translateY(-50%) rotate(-90deg); /* vertical text */
  transform-origin: right center;

  background: #6b46c1; /* purple, customize */
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 8px 8px 0 0; /* nice rounded top corners */
  cursor: pointer;
  z-index: 9999;
}

.btn-feedback-fish:hover {
  background: #553c9a; /* darker hover */
}
</style>
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
          <Link :href="route(`${routePrefix}.dashboard`)" class="flex items-center">
            <Logo />
          </Link>

          <template v-if="user">
            <UserMenu :responsive="true" />
          </template>
        </div>

        <slot />
      </div>
    </template>

    <button
      v-if="$page.props.auth.user && !$page.props.auth.user.is_admin"
      class="btn-feedback-fish"
      data-feedback-fish
    >
      Feedback
    </button>

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
