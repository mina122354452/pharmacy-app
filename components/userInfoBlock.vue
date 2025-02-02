<template>
  <div class="rounded-xl p-8 min-w-auto">
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mb-6 lobster-two-bold">
        Your info
      </h2>
      <div
        class="flex flex-col [&_label]:text-xl lobster-two-regular [&_input]:text-lg [&_input]:disabled:opacity-50 [&_input]:disabled:cursor-not-allowed [&_input]:bg-gray-100 [&_input]:border [&_input]:border-gray-300 [&_input]:rounded-md [&_input]:p-2"
      >
        <div class="flex *:p-3">
          <!-- First Name -->
          <div>
            <label
              for="firstname"
              class="block text-sm font-medium text-gray-700 mb-3"
              >First Name</label
            >
            <input
              id="firstname"
              type="text"
              v-model="user.firstname"
              placeholder="Enter your first name"
              :disabled="user?.googleId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label
              for="lastname"
              class="block text-sm font-medium text-gray-700 mb-3"
              >Last Name</label
            >
            <input
              id="lastname"
              type="text"
              v-model="user.lastname"
              :disabled="user?.googleId"
              placeholder="Enter your last name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        <!-- Email -->
        <div class="p-3">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-3"
            >Email</label
          >
          <input
            id="email"
            type="email"
            v-model="user.email"
            :disabled="user?.googleId"
            placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
      <!-- error  -->
      <div v-show="error || errorMessage" class="mb-4 flex items-center ml-3">
        <span class="inline-block mr-3"
          ><iconsInvalid class="size-6 text-red-800" />
        </span>
        <p class="inline caveat-bold text-lg text-red-800">
          {{ error || errorMessage }}
        </p>
      </div>
      <!-- Submit Button -->
      <div class="p-3" v-if="!user?.googleId">
        <button
          type="submit"
          :class="{
            'opacity-50 cursor-not-allowed pointer-events-none':
              changed === false || error !== null || errorMessage !== null,
          }"
          class="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition duration-300 text-lg lobster-two-regular"
          @click="updateProfile()"
        >
          update your info
        </button>
      </div>

      <!-- Change Password -->
      <div class="text-center p-3" v-if="!user?.googleId">
        <button
          @click="changePassword()"
          type="button"
          class="text-white text-lg font-medium lobster-two-bold bg-red-600 w-full py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md transition duration-300 cursor-pointer"
        >
          Change Password
        </button>
      </div>
      <div class="text-center p-3">
        <button
          @click="logout()"
          type="button"
          class="text-white text-lg font-medium lobster-two-bold bg-blue-600 w-full py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition duration-300 cursor-pointer"
        >
          log out
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from "vue";

export default defineComponent({
  name: "userInfoBlock",
  props: {
    user: {
      type: Object,
      required: true,
    },
    error: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const password = ref("");
    const errorMessage = ref<string | null>(null);
    const showErrorMessage = ref(false);
    const changed = ref(false);

    const updateProfile = () => {
      emit("updateProfile");
    };

    const changePassword = () => {
      emit("changePassword");
    };

    const logout = () => {
      emit("logout");
    };

    watch(
      [
        () => props.user.firstname,
        () => props.user.lastname,
        () => props.user.email,
      ],
      () => {
        emit("clearError")
        errorMessage.value = null;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (props.user.email && emailPattern.test(props.user.email)) {
          changed.value = true;
          errorMessage.value = null;
        } else {
          changed.value = false;
          if (!emailPattern.test(props.user.email)) {
            errorMessage.value = "Invalid email address";
          } else {
            errorMessage.value = "Please fill out all fields";
          }
        }
      }
    );

    return {
      password,
      errorMessage,
      showErrorMessage,
      changed,
      updateProfile,
      changePassword,
      logout,
    };
  },
});
</script>
