<script setup>
import { onMounted, onUnmounted, provide, reactive, ref } from "vue";
import { router, usePage } from "@inertiajs/vue3";
import useBootstrap from "../Composables/useBootstrap";
import Notifications from "@p/Components/Util/Notifications.vue";
import Confirmation from "../Plugins/Confirmation/Confirmation.vue";
import Preloader from "../Components/Util/Preloader.vue";
import useBroadcast from "../Composables/useBroadcast";
import LanguageSelectorModal from "@p/Components/User/LanguageSelectorModal.vue";

const showLanguagePopup = ref(false);

const context = reactive({
  showAside: false,
  preloader: false,
});

provide("appCtx", context);

const removeStartEventListener = router.on("start", () => {
  context.showAside = false;
});

const { bootstrapComplete } = useBootstrap();
const { openBroadcast, closeBroadcast } = useBroadcast();

onMounted(() => {
  openBroadcast();
  const page = usePage();
  console.log(page.props.mixpost.settings.show_language_popup);
  if (page.props.mixpost.settings.show_language_popup) {
    showLanguagePopup.value = true;
  }
});

onUnmounted(() => {
  removeStartEventListener();
  closeBroadcast();
});
</script>
<template>
  <div class="flex flex-row h-screen min-h-full bg-stone-500">
    <template v-if="!bootstrapComplete">
      <Preloader />
    </template>

    <template v-else>
      <template v-if="context.preloader">
        <Preloader :opacity="75" class="!z-20" />
      </template>

      <aside
        :class="{
          'translate-x-0': context.showAside,
          '-translate-x-full xl:translate-x-0 rtl:translate-x-full xl:rtl:translate-x-0': !context.showAside,
        }"
        class="default-sidebar aside fixed xl:relative h-full z-20 xl:z-10 transition-transform ease-in-out duration-200"
      >
        <slot name="sidebar" />
      </aside>

      <main class="w-full xl:main flex flex-col overflow-y-auto" scroll-region>
        <slot name="navigation" />
        <slot />
      </main>
    </template>

    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="context.showAside"
        @click="context.showAside = false"
        class="fixed inset-0 z-10 transform transition-all"
      >
        <div class="absolute inset-0 bg-primary-900 opacity-60" />
      </div>
    </transition>

    <Notifications />

    <Confirmation />

    <AuthPasswordConfirmation />
  </div>

  <LanguageSelectorModal
    :locales="$page.props.mixpost.locales"
    :current-settings="$page.props.mixpost.settings"
    :show="showLanguagePopup"
    @close="showLanguagePopup = false"
  />
</template>
