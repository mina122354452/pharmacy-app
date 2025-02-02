import { useUserStore } from "~/stores/userStore";

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server side
  if (process.server) {
    console.log("Middleware skipped on server side.");
    return;
  }

  console.log("Middleware running on client side.");

  const authStore = useUserStore();
  console.log("isAuthenticated:", authStore.isAuthenticated);

  if (!authStore.isAuthenticated) {
    console.log("User is not authenticated. Redirecting to login...");
    return navigateTo("/user/login");
  }
});
