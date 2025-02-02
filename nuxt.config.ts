import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  // devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss(), "./plugins/auth.client.ts"],
  },

  modules: ["@nuxt/image", "@pinia/nuxt", "nuxt-security", "@vite-pwa/nuxt"],

  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL,
    }, // Exposing to frontend
  },
  pwa: {
    registerType: "autoUpdate", // Automatically updates the service worker
    manifest: {
      name: "pharmacy App",
      short_name: "PWA App",
      description: "pharmacy App PWA Application",
      lang: "en",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#4a90e2",
      icons: [
        {
          src: "/app.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/app.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"], // Cache all relevant assets
      runtimeCaching: [
        {
          urlPattern: /^\/$/, // Cache homepage
          handler: "NetworkFirst",
          options: {
            cacheName: "html-cache",
          },
        },
        {
          urlPattern: /^https:\/\/your-api\.com\/.*$/, // Cache API responses
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "api-cache",
            expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
          },
        },
      ],
    },
    devOptions: {
      enabled: true, // Enables PWA in development mode
      type: "module",
    },
  },
  app: {
    buildAssetsDir: "/pharmacyApp/",

    head: {
      titleTemplate: (titleChunk) =>
        titleChunk ? `${titleChunk} - Pharmacy App` : "Pharmacy App",
      title: "The Best Pharmacy Management App",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Manage your pharmacy efficiently with our app! From prescriptions to inventory, we optimize workflows & enhance customer experience.",
        },
        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Best Pharmacy Management App" },
        {
          property: "og:description",
          content:
            "The best app for pharmacy management and healthcare professionals.",
        },
        { property: "og:image", content: "/logo.ico" },
        { property: "og:url", content: process.env.APP_URL },
        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Pharmacy App - Manage Your Pharmacy Efficiently",
        },
        {
          name: "twitter:description",
          content:
            "The best pharmacy management solution for healthcare professionals.",
        },
        { name: "twitter:image", content: "/logo.ico" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/logo.ico" },
        { rel: "canonical", href: process.env.APP_URL },
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Pharmacy App",
            image: process.env.APP_URL + "/logo.ico",
            url: process.env.APP_URL + "/",
            description:
              "The best pharmacy management solution for healthcare professionals.",
            operatingSystem: "Web, iOS, Android",
            applicationCategory: "HealthApplication",
          }),
        },
      ],
    },
  },

  security: {
    headers: {
      crossOriginResourcePolicy: "same-origin",
      crossOriginOpenerPolicy: "same-origin",
      crossOriginEmbedderPolicy: "require-corp",

      // Update the CSP for cross-origin requests
      contentSecurityPolicy: {
        "base-uri": ["'none'"],
        "default-src": ["'self'"],
        "connect-src": ["'self'", process.env.BACKEND_URL], // API connections
        "font-src": ["'self'", "https:", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "script-src": [
          "'self'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
          "'unsafe-inline'",
          "https:",
        ],
        "upgrade-insecure-requests": true,
      },

      originAgentCluster: "?1",
      referrerPolicy: "strict-origin-when-cross-origin",

      // Strict Transport Security
      strictTransportSecurity: {
        maxAge: 63072000,
        includeSubdomains: true,
        preload: true,
      },

      xContentTypeOptions: "nosniff",
      xDNSPrefetchControl: "off",
      xDownloadOptions: "noopen",
      xFrameOptions: "DENY",
      xPermittedCrossDomainPolicies: "none",
      xXSSProtection: "0", // Modern browsers use CSP instead

      permissionsPolicy: {
        camera: [],
        "display-capture": [],
        fullscreen: ["self"],
        geolocation: [],
        microphone: [],
        usb: [],
        bluetooth: [],
        payment: [],
      },
    },

    csrf: {
      enabled: true, // Enable CSRF protection
      methods: ["POST", "PUT", "DELETE"], // Protect POST/PUT/DELETE methods
      cookie: {
        name: "XSRF-TOKEN",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        sameSite: "strict",
      },
    },
  },
});
