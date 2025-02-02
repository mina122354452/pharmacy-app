import { useUserStore } from "~/stores/userStore";
import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useNuxtApp,
  useFetch as fetchFromNuxt,
} from "nuxt/app";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const backendUrl = config.public.backendUrl;
  //! for test. rm in production
  if (!backendUrl) {
    console.error("Backend URL is not set in runtime config.");
  }

  const { data, error } = await fetchFromNuxt(`${backendUrl}/csrf-token`, {
    credentials: "include", // Include cookies
  });

  nuxtApp.provide("csrfToken", data.value?.csrfToken);
  // Inject the backendUrl globally so it can be accessed across your app

  nuxtApp.provide("backendUrl", backendUrl);
  const userStore = useUserStore();

  // Run this logic only on the client side
  if (import.meta.client) {
    // console.log("kjkk");

    await userStore.initializeAuth();
  }
});
function useFetch(
  arg0: string,
  arg1: { credentials: string }
): { data: any } | PromiseLike<{ data: any }> {
  throw new Error("Function not implemented.");
}
