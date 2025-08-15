<script setup>
import { provide, reactive, ref, onMounted } from "vue";
import { usePage } from "@inertiajs/vue3";
import DefaultLayout from "@p/Layouts/Default.vue";
import SidebarWorkspace from "@p/Components/Sidebar/SidebarWorkspace.vue";
import Navigation from "@p/Components/Navigation/NavBar.vue";
import LanguageSelectorModal from "@p/Components/User/LanguageSelectorModal.vue";

const context = reactive({
  id: null,
  dashboard_filter: {
    account_id: null,
    period: "30_days",
  },
});

const showLanguagePopup = ref(false);

onMounted(() => {
  console.log("Page props");
  console.log(usePage().props);
  const page = usePage();
  if (page.props.settings.show_language_popup) {
    showLanguagePopup.value = true;
  }
});

provide("workspaceCtx", context);

context.id = usePage().props.ziggy.workspace_id;
</script>
<template>
  <DefaultLayout>
    <template #sidebar>
      <SidebarWorkspace />
    </template>

    <template #navigation>
      <Navigation />
    </template>

    <slot />
  </DefaultLayout>

  <LanguageSelectorModal
    :locales="$page.props.locales"
    :current-settings="$page.props.settings"
    :show="showLanguagePopup"
    @close="showLanguagePopup = false"
  />
</template>
