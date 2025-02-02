<template>
  <div
    class="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 transform transition duration-500 hover:scale-105"
  >
    <div
      class="text-yellow-500 flex justify-center items-center shadow-lg rounded-full bg-yellow-100 w-20 h-20 mx-auto"
    >
      <iconsNetworkError class="size-20" />
    </div>
    <h2 class="text-2xl font-bold text-yellow-600 caveat-bold mb-2">
      Network Error
    </h2>
    <p class="text-gray-500 playwrite-in-light">
      Please check your internet connection and try again.
    </p>
  </div>
</template>

<script>
export default {
  name: "networkErrorBlock",
};
</script>
<style></style>
