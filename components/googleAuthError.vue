<template>
  <div
    class="bg-gradient-to-r from-blue-50 to-white min-h-[100vh] flex items-center justify-center px-4"
  >
    <div
      class="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 transform transition duration-500 hover:scale-105"
    >
      <div
        class="text-red-500 flex justify-center items-center shadow-lg rounded-full bg-red-300 w-24 h-24 mx-auto"
      >
        <iconsNotAllowed class="size-20" />
      </div>
      <h2 class="text-2xl font-bold text-red-600 caveat-bold mb-2">
        Google authentication error
      </h2>
      <p class="text-gray-500 playwrite-in-light">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ["error"],
  name: "googleAuthError",
};
</script>

<style></style>
