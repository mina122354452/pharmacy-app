<template>
  <div
    class="bg-gradient-to-r from-blue-50 to-white min-h-[100vh] flex items-center justify-center px-4"
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
        logged in with Google
      </h2>
      <p class="text-gray-500 playwrite-in-light">
        You have logged in with Google account
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
  </div>
</template>

<script lang="ts">
export default {
  name: "googleAuthSuccess",
};
</script>

<style></style>
