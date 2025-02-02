<template>
  <div
    class="bg-gray-800 text-white flex w-full items-center"
    :class="
      ({ 'justify-items-start': greeterThanMd == true },
      {
        'justify-between': greeterThanMd == false,
      })
    "
  >
    <div
      class="flex justify-center items-center size-20 ml-5 hover:scale-105 transition-transform ease-out"
    >
      <!-- assets cant access -->
      <NuxtImg src="/logo.ico" quality="100" />
    </div>
    <div
      class="flex w-full justify-between items-center"
      v-if="greeterThanMd == true"
    >
      <div
        class="flex justify-between items-center p-4 w-3/4 max-w-[440px] ml-5 lobster-two-regular text-2xl"
      >
        <div class="hover:scale-110 transition-transform ease-out">
          <nuxtLink to="/">Home</nuxtLink>
        </div>
        <div class="hover:scale-110 transition-transform ease-out">
          <nuxtLink to="/pricing">Pricing</nuxtLink>
        </div>
        <div class="hover:scale-110 transition-transform ease-out">
          <nuxtLink to="/contact-us">Contact us</nuxtLink>
        </div>
        <div class="hover:scale-110 transition-transform ease-out">
          <nuxtLink to="/dashboard">dashboard</nuxtLink>
        </div>
      </div>
      <div
        class="flex justify-center items-center p-4 w-1/4 max-w-40 lobster-two-regular text-xl"
      >
        <div class="hover:scale-110 transition-transform ease-out">
          <nuxtLink v-if="isAuthenticated === false" to="/user/sign-up"
            >Sign up</nuxtLink
          >
          <nuxtLink v-else to="/user/profile"
            ><iconsProfile class="size-12 text-white"
          /></nuxtLink>
        </div>
      </div>
    </div>
    <div v-else-if="greeterThanMd == false">
      <iconsArcticonsHamburgerMenu
        class="text-3xl mr-5 cursor-pointer"
        v-if="openedMenu == false"
        @click="triggerMenu()"
      />
      <iconsMaterialSymbolsCancelOutline
        class="text-3xl mr-5 cursor-pointer"
        v-else
        @click="triggerMenu()"
      />
    </div>
  </div>
  <div
    class="bg-gray-700 w-full h-full fixed transition-opacity ease-out duration-300 z-50"
    :class="{ 'pointer-events-none opacity-0': openedMenu == false }"
    v-if="greeterThanMd == false"
  >
    <div
      @click="triggerMenu()"
      class="bg-gray-800 text-white w-full items-start h-full flex justify-center"
    >
      <div
        class="flex justify-center items-center flex-col mt-24 *:p-4 lobster-two-regular text-2xl *:hover:scale-110 *:transition-transform *:ease-out"
      >
        <div>
          <nuxtLink to="/">Home</nuxtLink>
        </div>
        <div>
          <nuxtLink to="/pricing">Pricing</nuxtLink>
        </div>
        <div>
          <nuxtLink to="/contact-us">Contact us</nuxtLink>
        </div>
        <div>
          <nuxtLink to="/dashboard">dashboard</nuxtLink>
        </div>
        <div>
          <nuxtLink v-if="isAuthenticated === false" to="/user/sign-up"
            >Sign up</nuxtLink
          >
          <nuxtLink v-else to="/user/profile"
            ><iconsProfile class="size-12 text-white"
          /></nuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const componentName = "navBar";

import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "~/stores/userStore";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { isAuthenticated } = storeToRefs(userStore);
const greeterThanMd = ref(false);
const openedMenu = ref(false);

const handleResize = () => {
  if (window.innerWidth > 768) {
    greeterThanMd.value = true;
  } else if (window.innerWidth < 768) {
    greeterThanMd.value = false;
  }
};

const triggerMenu = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  openedMenu.value = !openedMenu.value;
  document.body.classList.toggle("overflow-hidden");
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
