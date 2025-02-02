<template>
  <div
    class="fixed bg-white shadow-2xl rounded-2xl p-8 max-w-md text-center space-y-6 mx-3"
  >
    <div v-if="response?.status != 'success'">
      <h2 class="text-2xl font-bold text-gray-800 mb-2 lobster-two-bold">
        Change Password
      </h2>
      <p class="text-gray-500 playwrite-in-light text-sm">
        Please enter your current password and new password.
      </p>
      <input
        v-model="currentPassword"
        type="password"
        class="border-2 border-gray-300 rounded-md p-4 w-full mt-3"
        placeholder="Enter current password"
      />
      <p class="text-gray-500 playwrite-in-light text-sm mt-3">
        Please enter your new password and confirm it.
      </p>
      <input
        v-model="password"
        type="password"
        class="border-2 border-gray-300 rounded-md p-4 w-full mt-3"
        placeholder="Enter new password"
      />
      <input
        v-model="passwordConfirm"
        type="password"
        class="border-2 border-gray-300 rounded-md p-4 w-full mt-4"
        placeholder="Confirm new password"
      />
      <div
        v-show="
          (error || errorMessage) &&
          serverError === false &&
          networkError === false &&
          showErrorMessage === true
        "
        class="mb-4 flex items-center mt-4"
      >
        <span class="inline-block mr-3"
          ><iconsInvalid class="size-6 text-red-800" />
        </span>
        <p class="inline caveat-bold text-lg text-red-800">
          {{ error || errorMessage }}
        </p>
      </div>
      <button
        @click="updatePassword()"
        class="w-full mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md"
        :class="{
          'opacity-50 cursor-not-allowed pointer-events-none':
            formCompleted === false || error !== null || errorMessage !== null,
        }"
      >
        Change Password
      </button>
    </div>
    <div v-else-if="response?.status == 'success'">
      <div
        class="text-green-500 flex justify-center items-center shadow-lg rounded-full bg-green-100 w-20 h-20 mx-auto mb-4"
      >
        <iconsSuccess class="size-20" />
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2 lobster-two-bold">
        Password Change Successful
      </h2>
      <p class="text-gray-500 playwrite-in-light text-sm">
        Your password has been updated successfully. You can now log in using
        your new credentials.
      </p>
      <button
        @click="closeModal()"
        class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md cursor-pointer"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const componentName = "updatePass";

import { ref, watch, defineEmits } from "vue";
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";

const emit = defineEmits(["closeModal"]);
const userStore = useUserStore();
const { isLoading, error, networkError, serverError } = storeToRefs(userStore);
const currentPassword = ref("");
const password = ref("");
const passwordConfirm = ref("");
const errorMessage = ref<string | null>(null);
const showErrorMessage = ref(false);
const response = ref<{ status: string; error?: any; message?: any } | null>(
  null
);
const formCompleted = ref(false);
watch([currentPassword, password, passwordConfirm], () => {
  error.value = null;
  errorMessage.value = null;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (
    !currentPassword.value ||
    !password.value ||
    !passwordConfirm.value ||
    password.value !== passwordConfirm.value ||
    !passwordPattern.test(password.value) ||
    password.value === currentPassword.value
  ) {
    formCompleted.value = false;
    if (!currentPassword.value || !password.value || !passwordConfirm.value) {
      errorMessage.value = "Please fill out all fields";
    } else if (password.value !== passwordConfirm.value) {
      errorMessage.value = "Passwords do not match";
    } else if (!passwordPattern.test(password.value)) {
      errorMessage.value =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character";
    } else if (password.value === currentPassword.value) {
      errorMessage.value = "you did not change the new password";
    }
  } else {
    formCompleted.value = true;
  }
});
watch([passwordConfirm], () => {
  if (password.value !== "") {
    showErrorMessage.value = true;
  } else {
    showErrorMessage.value = false;
  }
});
async function updatePassword() {
  response.value = await userStore.updatePassword({
    currentPassword: currentPassword,
    password: password,
    passwordConfirm: passwordConfirm,
  });
}
function closeModal() {
  emit("closeModal");
}
</script>

<style></style>
