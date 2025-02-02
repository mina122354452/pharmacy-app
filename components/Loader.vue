<template>
  <div>
    <!-- Loader Container -->
    <div class="relative w-[120px] h-[120px] flex justify-center items-center">
      <!-- Pulse Circle -->
      <div
        class="pulse-circle w-[75px] h-[75px] rounded-full bg-linear-to-r from-cyan-500 to-blue-500 opacity-60 animate-pulse-glow backdrop-blur-sm"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loader",
};
</script>

<style scoped>
/* Pulse Animation */
@keyframes pulse-glow {
  0% {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.8);
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
    box-shadow: 0 0 30px rgba(0, 123, 255, 0.9);
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.8);
  }
}

/* Pulse Circle */
.pulse-circle {
  animation: pulse-glow 2s ease-in-out infinite;
}
</style>
