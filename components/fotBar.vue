<template>
  <footer class="bg-blue-600 text-white py-10">
    <div class="container mx-auto px-4">
      <!-- Footer Content -->
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Company Logo -->
        <div class="mb-6 md:mb-0 flex justify-center md:justify-start flex-col">
          <p class="p-2 playwrite-in-regular">MADE BY:</p>

          <NuxtImg
            src="/company-logo.png"
            alt="Company Logo"
            class="h-32 w-auto object-contain rounded shadow-2xl cursor-pointer hover:opacity-80 hover:scale-110 ease-in-out duration-300"
            <!--
          />
        </div>

        <!-- Policy Links -->
        <div class="flex flex-col text-center md:text-left">
          <h4 class="font-semibold mb-2 lobster-two-bold text-2xl">
            Quick Links
          </h4>
          <ul class="space-y-2">
            <li>
              <nuxtLink
                to="/privacy-policy"
                class="hover:underline lobster-two-regular"
              >
                Privacy Policy
              </nuxtLink>
            </li>
            <li>
              <nuxtLink to="/terms" class="hover:underline lobster-two-regular"
                >Terms of Service</nuxtLink
              >
            </li>
            <li>
              <nuxtLink
                to="/about-us"
                class="hover:underline lobster-two-regular"
                >About Us</nuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Social Media Links -->
        <div class="flex space-x-4 mt-6 md:mt-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icons/facebook.svg"
              alt="Facebook"
              class="h-8 w-8 hover:opacity-80"
            />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icons/twitter.svg"
              alt="Twitter"
              class="h-8 w-8 hover:opacity-80"
            />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icons/linkedin.svg"
              alt="LinkedIn"
              class="h-8 w-8 hover:opacity-80"
            />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icons/instagram.svg"
              alt="Instagram"
              class="h-8 w-8 hover:opacity-80"
            />
          </a>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="mt-10 text-center text-sm border-t border-blue-500 pt-4">
        <p class="playwrite-in-light">
          &copy; {{ new Date().getFullYear() }} Pharmacy Management App. All
          rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
export default {
  name: "fotBar",
};
</script>

<style></style>
