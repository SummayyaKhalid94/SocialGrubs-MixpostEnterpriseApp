<script setup>
import useBootstrap from "../Composables/useBootstrap";
import { Link, usePage } from "@inertiajs/vue3";
import useAuth from "../Composables/useAuth";
import Logo from "@p/Components/DataDisplay/Logo.vue";
import Notifications from "@p/Components/Util/Notifications.vue";
import UserMenu from "../Components/Navigation/UserMenu.vue";
import Preloader from "../Components/Util/Preloader.vue";
import Confirmation from "../Plugins/Confirmation/Confirmation.vue";

const { bootstrapComplete } = useBootstrap();

const { user } = useAuth();
</script>
<template>
  <div
    class="flex flex-col h-screen min-h-full overflow-y-auto bg-stone-500"
    scroll-region
  >
    <template v-if="!bootstrapComplete">
      <Preloader />
    </template>

    <template v-else>
      <div class="w-full mx-auto">
        <slot />
      </div>
    </template>

    <Notifications />

    <Confirmation />

    <AuthPasswordConfirmation />
  </div>
</template>
