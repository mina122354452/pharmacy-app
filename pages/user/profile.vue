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
    <transition name="fade" mode="out-in">
      <!-- Server Error    -->
      <serverErrorBlock v-if="serverError === true" />
      <!-- Network Error  -->
      <networkErrorBlock v-else-if="networkError === true" />
      <loader v-else-if="isLoading" />
      <!-- User Information -->
      <userInfoBlock
        v-else-if="response?.user"
        :user="response?.user"
        @updateProfile="updateProfile()"
        @logout="userStore.logout(true)"
        @changePassword="changePassword()"
        :error="error"
        @clearError="clearError()"
      />
      <emailVerification
        v-else-if="
          response?.status === 'success' && Object.keys(user).length === 0
        "
      />
    </transition>
    <div
      v-if="changePasswordPanel && !networkError && !serverError"
      class="fixed inset-0 bg-black/50 flex justify-center items-center"
      @click="closePanel"
    >
      <updatePass ref="passwordPanel" @click.stop @closeModal="closePanel()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSeoMeta } from "#imports";

useSeoMeta({
  title: "user profile",
  description: "edit your info and see your pharmacies information",
});
definePageMeta({
  middleware: "is-auth",
});
import { onMounted, ref, watchEffect } from "vue";
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { serverError, networkError, isLoading, user, error } =
  storeToRefs(userStore);
const changePasswordPanel = ref(false);
const response = ref(null);

async function fetchData() {
  try {
    response.value = await userStore.getUser();
    console.log("Response:", response.value); // Log the response
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function updateProfile() {
  try {
    if (user.value.googleId) {
      return;
    } else {
      response.value = await userStore.updateProfile({
        firstname: response.value.user.firstname,
        lastname: response.value.user.lastname,
        email: response.value.user.email,
      });

      console.log("Response:", response.value);
      console.log("Profile updated successfully");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}
async function changePassword() {
  try {
    if (user.value.googleId) {
      return;
    } else {
      changePasswordPanel.value = true;
      document.body.classList.add("overflow-hidden");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}
function closePanel() {
  changePasswordPanel.value = false;
  document.body.classList.remove("overflow-hidden");
}
function clearError() {
  error.value = null;
}

// Watch for changes in accessToken and fetch data when it's available
onMounted(() => {
  Promise.resolve().then(() => fetchData()); // Delay fetchData slightly
});
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
