<script setup>
import DefaultLayout from "@e/Layouts/Default.vue";
import Sidebar from "@e/Components/Sidebar/SidebarPanel.vue";
import Navigation from "@e/Components/Navigation/NavBar.vue";
import { usePage } from "@inertiajs/vue3";
import { onMounted, ref } from "vue";

onMounted(() => {
  const page = usePage();
  console.log(page.props.settings.show_language_popup);
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

  document.body.appendChild(script);

  if (!document.querySelector("#feedback-fish")) {
    const script2 = document.createElement("script");
    script2.src = "https://feedback.fish/ff.js?pid=f891131ed03da6";
    script2.defer = true;
    script2.id = "feedback-fish";
    document.body.appendChild(script2);
  }
});
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
  <DefaultLayout>
    <template #sidebar>
      <Sidebar />
    </template>

    <template #navigation>
      <Navigation />
    </template>

    <slot />
  </DefaultLayout>
  <button class="btn-feedback-fish" data-feedback-fish>Feedback</button>
</template>
