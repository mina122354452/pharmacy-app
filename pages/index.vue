<template>
  <div
    class="bg-gradient-to-r from-blue-50 to-white text-gray-800 min-h-screen"
  >
    <!-- Header Section -->
    <div class="container mx-auto py-12 px-4 text-center">
      <div class="flex justify-center mb-8">
        <NuxtImg
          src="/app.png"
          quality="100"
          class="rounded-lg shadow-xl max-w-md hover:scale-105 transition-transform ease-out"
        />
      </div>
      <h1 class="text-4xl font-extrabold text-blue-600 mb-6 lobster-two-bold">
        Pharmacy Management App
      </h1>
      <p
        class="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto lobster-two-regular"
      >
        Welcome to our pharmacy management app! We provide pharmacists and
        healthcare professionals with the tools to manage their operations
        efficiently and effectively. From prescription processing to inventory
        management, we help you improve workflows, reduce errors, and enhance
        customer satisfaction.
      </p>
    </div>

    <!-- What is Our App Section -->
    <div class="bg-white py-12">
      <div class="container mx-auto px-4 text-center">
        <h3 class="text-2xl font-bold text-gray-800 mb-4 playwrite-in-regular">
          What is our app?
        </h3>
        <p
          class="text-gray-700 max-w-2xl mx-auto leading-relaxed playwrite-in-light"
        >
          Our app is a comprehensive solution designed to streamline and
          optimize pharmacy operations. Built for pharmacists, healthcare
          providers, and staff, this app offers powerful tools for efficient
          inventory management, prescription processing, and customer service.
        </p>
      </div>
    </div>

    <!-- Why Choose Our App Section -->
    <div class="bg-blue-50 py-12">
      <div class="container mx-auto px-4">
        <h3
          class="text-3xl font-bold text-gray-800 text-center mb-6 caveat-bold"
        >
          What makes our app your best choice?
        </h3>
        <ul
          class="space-y-4 text-gray-700 max-w-3xl mx-auto caveat-semibold text-2xl"
        >
          <li class="flex items-start caveat-semibold">
            <span
              class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4"
              >1</span
            >
            <p>
              Prescription Management: Handle and process prescriptions with
              accuracy and speed.
            </p>
          </li>
          <li class="flex items-start">
            <span
              class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4"
              >2</span
            >
            <p>
              Inventory Control: Track and manage stock levels, expiry dates,
              and reordering processes seamlessly.
            </p>
          </li>
          <li class="flex items-start">
            <span
              class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4"
              >3</span
            >
            <p>
              Customer Profiles: Maintain detailed records of customers,
              including medical history and purchase history.
            </p>
          </li>
          <li class="flex items-start">
            <span
              class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4"
              >4</span
            >
            <p>
              Sales and Billing: Generate invoices, process payments, and manage
              transactions efficiently.
            </p>
          </li>
          <li class="flex items-start">
            <span
              class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4"
              >5</span
            >
            <p>
              Notifications and Alerts: Stay updated with stock expiry alerts,
              low-stock warnings, and customer reminders.
            </p>
          </li>
          <li class="flex items-start">
            <span
              class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4"
              >6</span
            >
            <p>
              Analytics and Reports: Access detailed reports on sales,
              inventory, and performance for better decision-making.
            </p>
          </li>
          <li class="flex items-start">
            <span
              class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4"
              >7</span
            >
            <p>
              Multi-Platform Accessibility: Use the app across devices,
              including desktops, tablets, and mobile phones.
            </p>
          </li>
        </ul>
      </div>
    </div>
    <!-- Footer Section -->
  </div>
</template>

<script lang="ts" setup>
import { useSeoMeta } from "#imports";

useSeoMeta({
  title: "home page",
  description:
    "The best app for pharmacy management and healthcare professionals.",
});
</script>

<style>
/* Add global styles or additional customizations here if needed */
</style>
