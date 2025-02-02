<template>
  <div
    class="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 transform transition duration-500 hover:scale-105"
  >
    <div
      class="text-red-500 flex justify-center items-center shadow-lg rounded-full bg-red-100 w-20 h-20 mx-auto"
    >
      <iconsServerError class="size-20" />
    </div>

    <h2 class="text-3xl font-bold text-red-600 caveat-bold mb-2">
      Server Error
    </h2>
    <p class="text-gray-500 playwrite-in-light">
      We’re currently facing technical issues. Please try again in a few
      moments.
    </p>
  </div>
</template>

<script>
export default {
  name: "serverErrorBlock",
};
</script>
