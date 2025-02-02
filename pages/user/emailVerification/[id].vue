<template>
  <div
    class="bg-gradient-to-r from-blue-50 to-white min-h-[100vh] flex items-center justify-center px-4"
    :class="{
      'bg-gradient-to-r from-red-50 to-white min-h-[100vh]':
        serverError === true,
      'bg-gradient-to-r from-yellow-50 to-white min-h-[100vh]':
        networkError === true,
    }"
  >
    <div
      v-if="
        serverError === false &&
        networkError === false &&
        response?.status !== `success` &&
        error
      "
      class="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 transform transition duration-500 hover:scale-105"
    >
      <div
        class="text-red-500 flex justify-center items-center shadow-lg rounded-full bg-red-100 w-24 h-24 mx-auto"
      >
        <iconsEmailVerificationFailed class="size-20" />
      </div>

      <h2 class="text-3xl font-bold text-red-600 caveat-bold mb-2">
        email verification failed
      </h2>
      <p class="text-gray-500 playwrite-in-light">
        {{ error }}
        or try to
        <NuxtLink to="/user/login" class="text-blue-600 hover:underline"
          >login</NuxtLink
        >
      </p>
    </div>

    <!-- Server Error  -->
    <serverErrorBlock v-if="serverError === true" />
    <!-- Network Error   -->
    <networkErrorBlock v-else-if="networkError === true" />
    <div
      v-else-if="
        response?.status === `success` &&
        serverError === false &&
        networkError === false &&
        !error
      "
    >
      <div
        class="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 transform transition duration-500 hover:scale-105"
      >
        <div
          class="text-green-500 flex justify-center items-center shadow-lg rounded-full bg-green-100 w-24 h-24 mx-auto"
        >
          <iconsEmailVerificationSuccess class="size-20" />
        </div>
        <h2 class="text-2xl font-bold text-green-600 caveat-bold mb-2">
          email verified successfully
        </h2>
        <p class="text-gray-500 playwrite-in-light">
          You have successfully verified your email.
        </p>

        <div class="mt-4">
          <p class="text-gray-500 playwrite-in-light text-sm">
            Now you can
            <NuxtLink to="/user/login" class="text-blue-600 hover:underline"
              >login</NuxtLink
            >
          </p>
          <p class="text-gray-500 playwrite-in-light text-sm">
            if you have any problem please
            <NuxtLink to="contactUs" class="text-blue-600 hover:underline"
              >contact us</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user, isAuthenticated, error, isLoading, serverError, networkError } =
  storeToRefs(userStore);
const route = useRoute();
const id = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const response = ref<{ status: string; error?: any; message?: any } | null>(
  null
);
userStore.emailVerification(id).then((res) => {
  if (res) {
    response.value = res;
  }
});
</script>
<style></style>
