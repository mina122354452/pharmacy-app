<template>
  <div
    class="bg-gradient-to-r from-blue-50 to-white min-h-[100vh] flex px-4 items-center justify-center"
    :class="{
      'bg-gradient-to-r from-red-50 to-white min-h-[100vh] ':
        serverError === true,
      'bg-gradient-to-r from-yellow-50 to-white min-h-[100vh] ':
        networkError === true,
    }"
  >
    <serverErrorBlock v-if="serverError" key="serverError" />
    <networkErrorBlock v-else-if="networkError" key="networkError" />
    <passVerification v-else-if="response?.status === 'success'" />
    <div
      class="bg-white shadow-lg rounded-xl p-8 max-w-md w-full"
      v-else-if="
        response?.status != 'success' &&
        !networkError &&
        !serverError &&
        isLoading !== true
      "
    >
      <h2
        class="lobster-two-bold capitalize text-2xl text-center text-blue-600"
      >
        enter your email
      </h2>
      <p
        class="playwrite-in-regular text-center mt-1 mb-4 text-sm text-gray-600"
      >
        to rest your password
      </p>
      <input
        type="email"
        id="email"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 lobster-two-regular"
        placeholder="Enter your email"
        v-model="email"
      />
      <div
        v-show="
          (error || errorMessage) &&
          serverError === false &&
          networkError === false
        "
        class="mb-2 mt-2 flex items-center"
      >
        <span class="inline-block mr-3"
          ><iconsInvalid class="size-6 text-red-800" />
        </span>
        <p class="inline caveat-bold text-lg text-red-800">
          {{ error || errorMessage }}
        </p>
      </div>
      <button
        @click="sendEmail()"
        :class="{
          'opacity-50 cursor-not-allowed pointer-events-none ':
            formCompleted === false || error !== null || errorMessage !== null,
        }"
        class="mt-2 w-full px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none caveat-semibold capitalize text-2xl cursor-pointer"
      >
        send email
      </button>
    </div>
    <Loader v-else-if="isLoading === true" key="loader" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { isLoading, error, networkError, serverError } = storeToRefs(userStore);
const email = ref("");
const errorMessage = ref<string | null>(null);
const response = ref<{ status: string; error?: any; message?: any } | null>(
  null
);
const formCompleted = ref(false);
watch([email], () => {
  error.value = null;
  errorMessage.value = null;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value && emailPattern.test(email.value)) {
    formCompleted.value = true;
  } else {
    formCompleted.value = false;
    if (email.value.trim() == "") {
      errorMessage.value = "Email address cannot be empty";
    } else if (!emailPattern.test(email.value)) {
      errorMessage.value = "Invalid email address";
    }
  }
});
const sendEmail = async () => {
  try {
    if (formCompleted.value) {
      response.value = await userStore.sendResetPasswordEmail({
        email: email.value,
      });
    }
  } catch (err) {
    errorMessage.value = err.message;
  }
};
</script>

<style></style>
