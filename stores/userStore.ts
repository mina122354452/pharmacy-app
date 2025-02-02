import { defineStore } from "pinia";
import type { RegisterData } from "~/types/auth";
import { navigateTo, useFetch } from "#imports";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: {},
    error: null as string | null,
    isLoading: false,
    serverError: false,
    networkError: false,
    accessToken:
      typeof window !== "undefined"
        ? window.localStorage.getItem("accessToken") || null
        : null,
  }),
  getters: {
    backendUrl: () => useNuxtApp().$backendUrl,
    csrfToken: () => useNuxtApp().$csrfToken,
    getAccessToken: (state) =>
      (state.accessToken = window?.localStorage.getItem("accessToken") || null),

    isAuthenticated: (state) => state.accessToken != null,
    // Called only when accessed
  },
  actions: {
    async register(userData: RegisterData) {
      this.isLoading = true;
      this.error = null;

      try {
        const { data, error } = await useFetch(`/api/user/register`, {
          baseURL: this.backendUrl,
          method: "POST",
          body: userData,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": this.csrfToken, // Send the CSRF token in the header
          },
        });
        console.log(error);

        if (error.value && error.value.statusCode.toString().startsWith("4")) {
          this.error =
            error.value.data.error || "An error occurred during registration.";
          // Handle server error
          return {
            status: "failed",
            error:
              error.value.data.error ||
              "An error occurred during registration.",
          };
        }

        // Handle successful response
        if (data.value?.status === "success") {
          this.networkError = false;
          this.serverError = false;
          this.error = null;
          return {
            status: data.value.status,
            message: data.value.message,
          };
        }

        // Fallback for unexpected responses
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data
        ) {
          this.serverError = true;

          return {
            status: "failed",
            error: "Unexpected response from the server.",
          };
        }
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data === undefined
        ) {
          this.networkError = true;
          throw new Error("network error: " + error.value);
        }
      } catch (err) {
        // Handle network or unexpected errors
        console.log("err:" + err);

        this.networkError = true;
        return {
          status: "failed",
          error:
            "An error occurred while connecting to the server. Please try again later.",
        };
      } finally {
        this.isLoading = false;
      }
    },
    async emailVerification(token: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const { data, error } = await useFetch(
          `/api/user/Email-verification/${token}`,
          {
            baseURL: this.backendUrl,
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": this.csrfToken, // Send the CSRF token in the header
            },
          }
        );
        console.log(error);

        if (error.value && error.value.statusCode.toString().startsWith("4")) {
          this.error =
            error.value.data.error ||
            "An error occurred during email verifying.";
          // Handle server error
          return {
            status: "failed",
            error:
              error.value.data.error ||
              "An error occurred during email verifying..",
          };
        }

        // Handle successful response
        if (data.value?.status === "success") {
          this.networkError = false;
          this.serverError = false;
          this.error = null;
          return {
            status: data.value.status,
            message: data.value.message,
          };
        }

        // Fallback for unexpected responses
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data
        ) {
          this.serverError = true;

          return {
            status: "failed",
            error: "Unexpected response from the server.",
          };
        }
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data === undefined
        ) {
          this.networkError = true;
          throw new Error("network error: " + error.value);
        }
      } catch (err) {
        // Handle network or unexpected errors
        console.log("err:" + err);

        this.networkError = true;
        return {
          status: "failed",
          error:
            "An error occurred while connecting to the server. Please try again later.",
        };
      } finally {
        this.isLoading = false;
      }
    },
    async login(userData: { email: string; password: string }) {
      this.isLoading = true;
      this.error = null;

      try {
        const { data, error } = await useFetch(`/api/user/login`, {
          credentials: "include",
          baseURL: this.backendUrl,
          method: "POST",
          body: userData,
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": this.csrfToken, // Send the CSRF token in the header
          },
        });
        console.log(error);

        if (error.value && error.value.statusCode.toString().startsWith("4")) {
          this.error =
            error.value.data.error || "An error occurred during login.";
          // Handle server error
          return {
            status: "failed",
            error: error.value.data.error || "An error occurred during login.",
          };
        }

        // Handle successful response
        if (data.value?.status === "success") {
          this.networkError = false;
          this.serverError = false;
          this.error = null;
          // Update state to reflect authentication
          if (data.value.token) {
            this.accessToken = data.value.token;
            this.scheduleTokenRefresh();

            if (typeof window !== "undefined") {
              window.localStorage.setItem("accessToken", data.value.token);
            }
            this.user = data.value.user;
          }
          return {
            status: data.value.status,
            message: data.value.message,
          };
        }

        // Fallback for unexpected responses
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data
        ) {
          this.serverError = true;

          return {
            status: "failed",
            error: "Unexpected response from the server.",
          };
        }
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data === undefined
        ) {
          this.networkError = true;
          throw new Error("network error: " + error.value);
        }
      } catch (err) {
        // Handle network or unexpected errors
        console.log("err:" + err);

        this.networkError = true;
        return {
          status: "failed",
          error:
            "An error occurred while connecting to the server. Please try again later.",
        };
      } finally {
        this.isLoading = false;
      }
    },

    async refreshToken() {
      try {
        const { data } = await useFetch("/api/user/refresh", {
          baseURL: this.backendUrl,
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": this.csrfToken, // Send the CSRF token in the header
          },
          // Ensure cookies are sent
        });

        if (data.value.accessToken) {
          this.accessToken = data.value.accessToken;
          // this.setAuthHeader(data.value.token);

          if (typeof window !== "undefined") {
            window.localStorage.setItem("accessToken", data.value.accessToken);
          }
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);

        // If refresh fails, log out the user
        this.logout();
      }
    },
    async logout(redirect) {
      localStorage.removeItem("accessToken");
      this.accessToken = null;
      this.user = {};
      await useFetch("/api/user/logout", {
        baseURL: this.backendUrl,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": this.csrfToken, // Send the CSRF token in the header
        },
        // Ensure cookies are sent
      });
      // Redirect to login page
      if (typeof window !== "undefined" && redirect === true) {
        navigateTo("/user/login");
      }
      // Clear the default header

      // Optionally, clear refresh token cookie (handled on the backend)
    },
    scheduleTokenRefresh() {
      const tokenExpiresIn = 24 * 60 * 60 * 1000 - 5 * 60 * 1000; // Refresh 5 minutes before expiry
      setTimeout(() => {
        this.refreshToken();
      }, tokenExpiresIn);
    },

    async initializeAuth() {
      // Check if an access token exists
      if (!this.accessToken && import.meta.client) {
        this.accessToken = localStorage.getItem("accessToken");
      }
      if (this.accessToken) {
        console.log(2);

        const isTokenValid = this.isTokenValid(this.accessToken);

        if (!isTokenValid) {
          try {
            await this.refreshToken(); // Refresh the token
          } catch (error) {
            console.error("Failed to refresh token:", error);
            this.logout(false); // Clear session if refresh fails
          }
        }
        // Re-schedule token refresh after initialization
        this.scheduleTokenRefresh();
      } else {
        console.log(5);
      }
    },

    isTokenValid(token: string): boolean {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        const now: number = Math.floor(Date.now() / 1000); // Current time in seconds
        console.log(decoded.exp, now);

        return decoded.exp > now;
        // Token expiry time compared to now
      } catch {
        return false; // Invalid token
      }
    },
    async getUser() {
      this.isLoading = true;
      this.error = null;

      try {
        if (import.meta.client) {
          if (!this.accessToken) {
            this.accessToken = localStorage.getItem("accessToken");
            if (!this.accessToken) {
              throw new Error("Access token is not available.");
            }
          }

          const { data, error } = await useFetch(`/api/user/details`, {
            baseURL: this.backendUrl,
            method: "GET",
            credentials: "include",
            headers: {
              authorization: `Bearer ${this.accessToken || ""}`, // Use the hydrated token
            },
          });
          console.log(data);
          console.log(data.value);

          console.log("Error:", error);
          console.log("AccessToken:", this.accessToken);

          if (
            error.value &&
            error.value.statusCode.toString().startsWith("4")
          ) {
            if (
              error.value.data.error === "Invalid token, Please Login again" ||
              error.value.data.error === `Token expired, Please Login again`
            ) {
              this.refreshToken();
              window.location.reload();
            }
            this.error =
              error.value.data.error || "An error occurred during login.";
            return {
              status: "failed",
              error:
                error.value.data.error || "An error occurred during login.",
            };
          }

          if (data.value?.status === "success") {
            console.log("Success:", data.value);
            this.networkError = false;
            this.serverError = false;
            this.error = null;
            this.user = {
              ...this.user,
              firstname: data.value.user.firstname,
              lastname: data.value.user.lastname,
              email: data.value.user.email,
              googleId: data.value?.user?.googleId,
            };
            return {
              status: data.value.status,
              user: data.value.user,
            };
          }

          if (
            error.value &&
            error.value.statusCode.toString().startsWith("5")
          ) {
            this.serverError = true;
            return {
              status: "failed",
              error: "Unexpected response from the server.",
            };
          }
        }
      } catch (err) {
        console.error("Error during getUser:", err);
        this.networkError = true;
        return {
          status: "failed",
          error:
            "An error occurred while connecting to the server. Please try again later.",
        };
      } finally {
        this.isLoading = false;
      }
    },
    async updateProfile(userInfo: {
      firstname: string;
      lastname: string;
      email: string;
    }) {
      this.isLoading = true;
      this.error = null;
      try {
        const { data, error } = await useFetch(`/api/user/edit-user`, {
          baseURL: this.backendUrl,
          method: "PUT",
          credentials: "include",
          headers: {
            authorization: `Bearer ${this.accessToken || ""}`,
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": this.csrfToken, // Use the hydrated token
          },

          body: userInfo,
        });
        console.log(error);
        console.log(data);

        if (error.value && error.value.statusCode.toString().startsWith("4")) {
          this.error =
            error.value.data.error || "An error occurred during login.";
          if (error.value.data.user) {
            this.user = error.value.data.user;
          } else {
            this.logout();
          }
          return {
            status: "failed",
            user: error.value.data.user,
            error: error.value.data.error || "An error occurred during login.",
          };
        }

        // Handle successful response
        if (
          data.value?.status === "success" ||
          data.value?.status === "Not Modified"
        ) {
          this.networkError = false;
          this.serverError = false;
          this.error = null;
          // Update state to reflect authentication
          if (data.value.user) {
            this.user = data.value.user;
          } else {
            this.logout(false);
          }
          return {
            status: data.value.status,
            user: data?.value?.user,
            message: data.value.message,
          };
        }

        // Fallback for unexpected responses
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data
        ) {
          this.serverError = true;

          return {
            status: "failed",
            error: "Unexpected response from the server.",
          };
        }
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data === undefined
        ) {
          this.networkError = true;
          throw new Error("network error: " + error.value);
        }
      } catch (err) {
        // Handle network or unexpected errors
        console.log("err:" + err);

        this.networkError = true;
        return {
          status: "failed",
          error:
            "An error occurred while connecting to the server. Please try again later.",
        };
      } finally {
        this.isLoading = false;
      }
    },
    async socialLogin(token: string) {
      if (token) {
        try {
          const decoded: { exp: number } = jwtDecode(token);
          const now: number = Math.floor(Date.now() / 1000); // Current time in seconds

          if (decoded.exp > now) {
            this.accessToken = token;
            this.scheduleTokenRefresh();

            if (typeof window !== "undefined") {
              window.localStorage.setItem("accessToken", token);
            }
          } else {
            this.error = "Token has expired.";
          }
        } catch (err) {
          this.error = "Invalid token.";
        }
      } else {
        this.error = "there was no access token available for the user";
      }
    },
    async updatePassword(Data: {
      currentPassword: string;
      password: string;
      passwordConfirm: string;
    }) {
      this.isLoading = true;
      this.error = null;

      try {
        const { data, error } = await useFetch(`/api/user/password`, {
          credentials: "include",
          baseURL: this.backendUrl,
          method: "PUT",
          body: Data,
          headers: {
            authorization: `Bearer ${this.accessToken || ""}`,
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": this.csrfToken, // Use the hydrated token
          },
        });
        console.log(error);

        if (error.value && error.value.statusCode.toString().startsWith("4")) {
          this.error =
            error.value.data.error || "An error occurred during login.";
          // Handle server error
          return {
            status: "failed",
            error: error.value.data.error || "An error occurred during login.",
          };
        }

        // Handle successful response
        if (data.value?.status === "success") {
          this.networkError = false;
          this.serverError = false;
          this.error = null;
          // Update state to reflect authentication

          return {
            status: data.value.status,
            message: data.value.message,
          };
        }

        // Fallback for unexpected responses
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data
        ) {
          this.serverError = true;

          return {
            status: "failed",
            error: "Unexpected response from the server.",
          };
        }
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data === undefined
        ) {
          this.networkError = true;
          throw new Error("network error: " + error.value);
        }
      } catch (err) {
        // Handle network or unexpected errors
        console.log("err:" + err);

        this.networkError = true;
        return {
          status: "failed",
          error:
            "An error occurred while connecting to the server. Please try again later.",
        };
      } finally {
        this.isLoading = false;
      }
    },
    async sendResetPasswordEmail(Data: { email: string }) {
      this.isLoading = true;
      this.error = null;

      try {
        const { data, error } = await useFetch(
          `/api/user/forgot-password-token`,
          {
            credentials: "include",
            baseURL: this.backendUrl,
            method: "POST",
            body: Data,
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": this.csrfToken, // Send the CSRF token in the header
            },
          }
        );
        console.log(error);

        if (error.value && error.value.statusCode.toString().startsWith("4")) {
          this.error =
            error.value.data.error || "An error occurred during login.";
          // Handle server error
          return {
            status: "failed",
            error: error.value.data.error || "An error occurred during login.",
          };
        }

        // Handle successful response
        if (data.value?.status === "success") {
          this.networkError = false;
          this.serverError = false;
          this.error = null;
          // Update state to reflect authentication

          return {
            status: data.value.status,
            message: data.value.message,
          };
        }

        // Fallback for unexpected responses
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data
        ) {
          this.serverError = true;

          return {
            status: "failed",
            error: "Unexpected response from the server.",
          };
        }
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data === undefined
        ) {
          this.networkError = true;
          throw new Error("network error: " + error.value);
        }
      } catch (err) {
        // Handle network or unexpected errors
        console.log("err:" + err);

        this.networkError = true;
        return {
          status: "failed",
          error:
            "An error occurred while connecting to the server. Please try again later.",
        };
      } finally {
        this.isLoading = false;
      }
    },
    async resetPassword(
      Data: {
        password: string;
        passwordConfirm: string;
      },
      token: string
    ) {
      this.isLoading = true;
      this.error = null;

      try {
        const { data, error } = await useFetch(
          `/api/user/reset-password/${token}`,
          {
            credentials: "include",
            baseURL: this.backendUrl,
            method: "PUT",
            body: Data,
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": this.csrfToken, // Send the CSRF token in the header
            },
          }
        );
        console.log(error);

        if (error.value && error.value.statusCode.toString().startsWith("4")) {
          this.error =
            error.value.data.error || "An error occurred during login.";
          // Handle server error
          return {
            status: "failed",
            error: error.value.data.error || "An error occurred during login.",
          };
        }

        // Handle successful response
        if (data.value?.status === "success") {
          this.networkError = false;
          this.serverError = false;
          this.error = null;
          // Update state to reflect authentication

          return {
            status: data.value.status,
            message: data.value.message,
          };
        }

        // Fallback for unexpected responses
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data
        ) {
          this.serverError = true;

          return {
            status: "failed",
            error: "Unexpected response from the server.",
          };
        }
        if (
          error.value &&
          error.value.statusCode.toString().startsWith("5") &&
          error.value.data === undefined
        ) {
          this.networkError = true;
          throw new Error("network error: " + error.value);
        }
      } catch (err) {
        // Handle network or unexpected errors
        console.log("err:" + err);

        this.networkError = true;
        return {
          status: "failed",
          error:
            "An error occurred while connecting to the server. Please try again later.",
        };
      } finally {
        this.isLoading = false;
      }
    },
  },
});
