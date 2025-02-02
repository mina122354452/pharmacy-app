<template>
  <div
    class="bg-gradient-to-r from-blue-50 to-white min-h-[100vh] flex items-center justify-center px-4"
    :class="{
      'from-red-50': serverError,
      'from-yellow-50': networkError,
    }"
  >
    <loggedInBefore
      v-if="isAuthenticated && isLoading === false && !response?.status"
      key="loggedInBefore"
    />
    <transition name="fade" mode="out-in">
      <!-- Error States & Success take priority -->
      <serverErrorBlock v-if="serverError" key="serverError" />
      <networkErrorBlock v-else-if="networkError" key="networkError" />
      <div
        v-else-if="
          response?.status === 'success' && Object.keys(user).length !== 0
        "
        key="success"
        class="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 transform transition duration-500 hover:scale-105"
      >
        <div
          class="text-green-500 flex justify-center items-center shadow-lg rounded-full bg-green-100 w-20 h-20 mx-auto"
        >
          <iconsSuccess class="size-20" />
        </div>
        <h2 class="text-2xl font-bold text-green-600 caveat-bold mb-2">
          log in Successful
        </h2>
        <p class="text-gray-500 playwrite-in-light">
          You have successfully logged in.
        </p>
        <div class="mt-4">
          <p class="text-gray-500 playwrite-in-light text-sm">
            Now you can
            <NuxtLink to="/" class="text-blue-600 hover:underline"
              >open your app</NuxtLink
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

      <emailVerification
        v-else-if="
          response?.status === 'success' && Object.keys(user).length === 0
        "
      />

      <!-- Loading State -->
      <div
        v-else-if="
          serverError === false &&
          networkError === false &&
          response?.status !== 'success' &&
          isAuthenticated === false &&
          isLoading === false
        "
        key="loginForm"
        class="bg-white shadow-lg rounded-xl p-8 max-w-md w-full"
      >
        <h3
          class="text-3xl font-bold text-blue-600 text-center mb-6 lobster-two-bold"
        >
          Log in
        </h3>
        <form class="space-y-6 lobster-two-regular [&_label]:text-xl">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              v-model="email"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="passwordConfirmation"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a password"
              v-model="password"
            />
          </div>

          <!-- Error Message -->
          <div
            v-show="
              (error || errorMessage) &&
              serverError === false &&
              networkError === false &&
              showErrorMessage === true
            "
            class="mb-4 flex items-center"
          >
            <span class="inline-block mr-3"
              ><iconsInvalid class="size-6 text-red-800" />
            </span>
            <p class="inline caveat-bold text-lg text-red-800">
              {{ error || errorMessage }}
            </p>
          </div>
          <!-- Log in Button -->
          <div>
            <button
              type="submit"
              :class="{
                'opacity-50 cursor-not-allowed pointer-events-none':
                  changed === false || error !== null || errorMessage !== null,
              }"
              @click.prevent="logIn()"
              class="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-linear-to-r from-cyan-500 to-blue-500 cursor-pointer hover:scale-95 ease-in-out transition-transform text-2xl"
            >
              Log in
            </button>
          </div>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/user/sign-up" class="text-blue-600 hover:underline"
            >sign up</NuxtLink
          >
        </p>
        <p class="mt-3 text-center text-sm text-gray-600">
          <NuxtLink
            to="/user/forgetPassword"
            class="text-blue-600 hover:underline"
          >
            forget your password ?
          </NuxtLink>
        </p>
        <or />
        <googleButton />
      </div>
      <!-- Default Login Form -->

      <Loader v-else-if="isLoading === true" key="loader" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from "#imports";

useSeoMeta({
  title: "Log in",
  description: "log in to your account",
});
import { ref, watch } from "vue";
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user, isAuthenticated, error, isLoading, serverError, networkError } =
  storeToRefs(userStore);
const email = ref("");
const password = ref("");
const changed = ref(false);
const response = ref<{ status: string; error?: any; message?: any } | null>(
  null
);
const errorMessage = ref<string | null>(null);
const showErrorMessage = ref(false);

watch([email, password], () => {
  error.value = null;
  errorMessage.value = null;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Minimum 8 characters, at least one letter and one number
  if (
    email.value &&
    emailPattern.test(email.value) &&
    password.value &&
    passwordPattern.test(password.value)
  ) {
    changed.value = true;
    errorMessage.value = null;
  } else {
    changed.value = false;
    if (!emailPattern.test(email.value)) {
      errorMessage.value = "Invalid email address";
    } else if (!passwordPattern.test(password.value)) {
      errorMessage.value =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character";
    } else {
      errorMessage.value = "Please fill out all fields";
    }
  }
});
watch([password], () => {
  if (password.value !== "") {
    showErrorMessage.value = true;
  } else {
    showErrorMessage.value = false;
  }
});

const logIn = async () => {
  const emailValue = email.value;
  const passwordValue = password.value;
  response.value = await userStore.login({
    email: emailValue,
    password: passwordValue,
  });
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
