<script setup>
import { inject, onMounted } from "vue";
import DefaultLayout from "@e/Layouts/Default.vue";
import Sidebar from "@e/Components/Sidebar/SidebarWorkspace.vue";
import Navigation from "@e/Components/Navigation/NavBar.vue";
import { usePage } from "@inertiajs/vue3";

console.log("e Workspace layout");
const routePrefix = inject("routePrefix");

onMounted(() => {
  const page = usePage();

  console.log(page.props);
  if (!page.props.auth.user.is_admin) {
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

    <div class="row-py row-px w-full mx-auto">
      <slot />
    </div>
  </DefaultLayout>
  <button
    v-if="!$page.props.auth.user.is_admin"
    class="btn-feedback-fish"
    data-feedback-fish
  >
    Feedback
  </button>
</template>
