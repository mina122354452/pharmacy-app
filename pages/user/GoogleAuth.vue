<template>
  <googleAuthSuccess v-if="!error && isAuthenticated" />
  <Loader v-else-if="isLoading === true" key="loader" />

  <googleAuthError v-else :error="errorMessage || error" />
</template>

<script lang="ts" setup>
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";
const userStore = useUserStore();
const { isAuthenticated, isLoading, error } = storeToRefs(userStore);
const route = useRoute();
const token = route.query.token ? decodeURIComponent(route.query.token) : "";
let errorMessage = ref(
  route.query.error ? decodeURIComponent(route.query.error) : ""
);
onMounted(async () => {
  if (token) {
    await userStore.socialLogin(token);
  } else if (token.trim() == "" && errorMessage.value.trim() == "") {
    errorMessage.value = "there was an error";
  }
});
</script>

<style></style>
