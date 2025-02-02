<template>
  <div
    class="bg-gradient-to-r from-blue-50 to-white min-h-[150vh] flex items-center justify-center px-4"
    :class="{
      'bg-gradient-to-r from-red-50 to-white min-h-[100vh]':
        serverError === true,
      'bg-gradient-to-r from-yellow-50 to-white min-h-[100vh]':
        networkError === true,
    }"
  >
    <loggedInBefore
      v-if="isAuthenticated && isLoading === false"
      key="loggedInBefore"
    />
    <transition name="fade" mode="out-in">
      <serverErrorBlock v-if="serverError" key="serverError" />

      <networkErrorBlock v-else-if="networkError" key="networkError" />

      <div
        class="bg-white shadow-lg rounded-xl p-8 max-w-md w-full hh"
        v-else-if="
          isAuthenticated === false &&
          serverError === false &&
          networkError === false &&
          response?.status !== `success` &&
          isLoading === false
        "
      >
        <h3
          class="text-3xl font-bold text-blue-600 text-center mb-6 lobster-two-bold"
        >
          Sign up
        </h3>
        <form class="space-y-6 lobster-two-regular [&_label]:text-xl">
          <!-- First Name -->
          <div>
            <label
              for="first-name"
              class="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your first name"
              v-model="firstName"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label
              for="last-name"
              class="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your last name"
              v-model="lastName"
            />
          </div>

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
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              confirm Password
            </label>
            <input
              type="password"
              id="password"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="confirm Password"
              v-model="confirmPassword"
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
          <!-- Sign Up Button -->
          <div>
            <button
              type="submit"
              :class="{
                'opacity-50 cursor-not-allowed pointer-events-none':
                  changed === false || error !== null || errorMessage !== null,
              }"
              @click.prevent="signUp()"
              class="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-linear-to-r from-cyan-500 to-blue-500 cursor-pointer hover:scale-95 ease-in-out transition-transform text-2xl"
            >
              Sign up
            </button>
          </div>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/user/login" class="text-blue-600 hover:underline"
            >Log In</NuxtLink
          >
        </p>
        <or />
        <googleButton />
      </div>

      <div
        v-else-if="
          response?.status === `success` &&
          serverError === false &&
          networkError === false &&
          !error &&
          isAuthenticated === false &&
          isLoading === false
        "
      >
        <div
          class="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 transform transition duration-500 hover:scale-105"
        >
          <div
            class="text-green-500 flex justify-center items-center shadow-lg rounded-full bg-green-100 w-20 h-20 mx-auto"
          >
            <iconsSuccess class="size-20" />
          </div>
          <h2 class="text-2xl font-bold text-green-600 caveat-bold mb-2">
            Sign Up Successful
          </h2>
          <p class="text-gray-500 playwrite-in-light">
            You have successfully signed up. Please check your email to verify
            your account.
          </p>
          <div class="mt-4">
            <div>
              <span class="lobster-two-regular-italic"> Note: </span>
              <p class="text-gray-500 playwrite-in-light text-sm">
                1 - If you don't see the email in your inbox, please check your
                spam folder.
              </p>
              <p class="text-gray-500 playwrite-in-light text-sm">
                2- if you didn't verify the email during 30 days, User will be
                deleted
              </p>
            </div>
            <div class="mt-4">
              <p class="text-gray-500 playwrite-in-light text-sm">
                after email verification you can
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
      <Loader v-else-if="isLoading === true" key="loader" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from "#imports";

useSeoMeta({
  title: "Sign up",
  description: "create an account",
});
import { ref, watch } from "vue";
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";
import { definePageMeta } from "#imports";
const userStore = useUserStore();
const {
  user,
  isAuthenticated,
  error,
  isLoading,
  serverError,
  networkError,
  backendUrl,
} = storeToRefs(userStore);

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const changed = ref(false);
const response = ref<{ status: string; error?: any; message?: any } | null>(
  null
);
const errorMessage = ref<string | null>(null);
const showErrorMessage = ref(false);

watch([email, lastName, firstName, password, confirmPassword], () => {
  error.value = null;
  errorMessage.value = null;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Minimum 8 characters, at least one letter and one number
  if (
    email.value &&
    emailPattern.test(email.value) &&
    lastName.value &&
    firstName.value &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    passwordPattern.test(password.value)
  ) {
    changed.value = true;
    errorMessage.value = null;
  } else {
    changed.value = false;
    if (!emailPattern.test(email.value)) {
      errorMessage.value = "Invalid email address";
    } else if (password.value !== confirmPassword.value) {
      errorMessage.value = "Passwords do not match";
    } else if (!passwordPattern.test(password.value)) {
      errorMessage.value =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character";
    } else {
      errorMessage.value = "Please fill out all fields";
    }
  }
});
watch([confirmPassword], () => {
  if (confirmPassword.value !== "") {
    showErrorMessage.value = true;
  } else {
    showErrorMessage.value = false;
  }
});
const signUp = async () => {
  response.value = await userStore.register({
    firstname: firstName.value,
    lastname: lastName.value,
    email: email.value,
    password: password.value,
    passConfirm: confirmPassword.value,
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
