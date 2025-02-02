<template>
  <div>
    <div
      class="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 transform transition duration-500 hover:scale-105"
    >
      <div
        class="text-green-500 flex justify-center items-center shadow-lg rounded-full bg-green-100 w-20 h-20 mx-auto"
      >
        <iconsEmailVerificationSent class="size-20" />
      </div>
      <h2 class="text-2xl font-bold text-green-600 caveat-bold mb-2 capitalize">
        Email verification
      </h2>
      <p class="text-gray-500 playwrite-in-light">
        You have received an email verification. Please check your email to
        verify your account.
      </p>
      <div class="mt-4">
        <div>
          <span class="lobster-two-regular-italic"> Note: </span>
          <p class="text-gray-500 playwrite-in-light text-sm">
            1 - If you don't see the email in your inbox, please check your spam
            folder.
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
</template>

<script lang="ts">
export default {
  name: "emailVerification",
};
</script>

<style></style>
