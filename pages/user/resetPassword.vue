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
          <iconsSuccess class="size-20" />
        </div>
        <h2 class="text-2xl font-bold text-green-600 caveat-bold mb-2">
          password changed successfully
        </h2>
        <p class="text-gray-500 playwrite-in-light">
          You have successfully changed your password.
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
    <div
      class="bg-white shadow-lg rounded-xl p-8 max-w-md w-full"
      v-else-if="
        response?.status != 'success' &&
        !networkError &&
        !serverError &&
        isLoading !== true &&
        !error
      "
    >
      <h2
        class="lobster-two-bold capitalize text-2xl text-center text-blue-600"
      >
        create a new password
      </h2>
      <label for="password" class="lobster-two-regular text-lg">
        password
      </label>
      <input
        id="password"
        type="password"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 lobster-two-regular"
        placeholder="password"
        v-model="password"
      />
      <label for="passwordConfirm" class="lobster-two-regular text-lg">
        confirm password
      </label>
      <input
        id="passwordConfirm"
        type="password"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 lobster-two-regular"
        placeholder="confirm your password"
        v-model="passwordConfirm"
      />
      <div
        v-show="
          errorMessage &&
          serverError === false &&
          networkError === false &&
          showErrorMessage
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
        @click="sendPassword()"
        :class="{
          'opacity-50 cursor-not-allowed pointer-events-none ':
            formCompleted === false || error !== null || errorMessage !== null,
        }"
        class="mt-2 w-full px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none caveat-semibold capitalize text-2xl cursor-pointer"
      >
        change your password
      </button>
    </div>
    <Loader v-else-if="isLoading === true" key="loader" />

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
        class="text-red-500 flex justify-center items-center shadow-lg rounded-full bg-red-300 w-24 h-24 mx-auto"
      >
        <iconsNotAllowed class="size-20" />
      </div>

      <h2 class="text-3xl font-bold text-red-600 caveat-bold mb-2">
        password didn't change
      </h2>
      <p class="text-gray-500 playwrite-in-light">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
const userStore = useUserStore();
const { isLoading, error, networkError, serverError } = storeToRefs(userStore);
const route = useRoute();
const token = route.query.token ? decodeURIComponent(route.query.token) : "";
const password = ref("");
const passwordConfirm = ref("");
const errorMessage = ref<string | null>("");
const formCompleted = ref<boolean>(false);
const response = ref<{ status: string; error?: any; message?: any } | null>(
  null
);
const showErrorMessage = ref(false);

onMounted(() => {
  if (token.trim() == "") {
    error.value = "Token is missing or invalid. Please try again.";
  }
});
const sendPassword = async () => {
  if (formCompleted.value == true) {
    response.value = await userStore.resetPassword(
      {
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      },
      token
    );
  }
};
watch([password, passwordConfirm], () => {
  errorMessage.value = "";
  error.value = null;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Minimum 8 characters, at least one letter and one number

  if (
    password.value &&
    passwordConfirm.value &&
    password.value === passwordConfirm.value &&
    passwordPattern.test(password.value)
  ) {
    formCompleted.value = true;
    errorMessage.value = null;
  } else {
    formCompleted.value = false;
    if (password.value !== passwordConfirm.value) {
      errorMessage.value = "Passwords do not match";
    } else if (!passwordPattern.test(password.value)) {
      errorMessage.value =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character";
    } else {
      errorMessage.value = "Please fill out all fields";
    }
  }
});
watch([passwordConfirm], () => {
  if (passwordConfirm.value !== "") {
    showErrorMessage.value = true;
  } else {
    showErrorMessage.value = false;
  }
});
</script>

<style></style>
