<script setup>
import DefaultLayout from "@e/Layouts/Default.vue";
import Sidebar from "@e/Components/Sidebar/SidebarPanel.vue";
import Navigation from "@e/Components/Navigation/NavBar.vue";
import { usePage } from "@inertiajs/vue3";
import { onMounted, ref } from "vue";

onMounted(() => {
  console.log("e Panel layout");
  const page = usePage();
  console.log(page.props.mixpost.settings.show_language_popup);
  if (page.props.mixpost.settings.show_language_popup) {
    showLanguagePopup.value = true;
  }
});
</script>
<template>
  <DefaultLayout>
    <template #sidebar>
      <Sidebar />
    </template>

    <template #navigation>
      <Navigation />
    </template>

    <slot />
  </DefaultLayout>
</template>
