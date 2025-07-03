<script setup>
import logo from '@/assets/images/SolgeoWord.png'
</script>
<template>
  <div class="fixed inset-0 bg-white dark:bg-black flex items-center justify-center z-50 transition-opacity duration-300 splash-screen">
    <div class="flex items-center">
      <!-- Animated Bars -->
        <div class="flex flex-row items-end  gap-8">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                width="5rem"
                height="5rem"
                class="animated-bars"
            >
                <!-- Bar 4 (leftmost, shortest) -->
                <g transform="translate(0, 40)">
                <path fill="#c5122f" d="M0,-3a61.4,61.4,0,0,0,8,-2.6V0H0Z">
                    <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="1,0;1,1;1,1"
                    keyTimes="0;0.5;1"
                    dur="0.6s"
                    begin="0.04s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1; 0 0 1 1"
                    />
                    <animate
                    attributeName="opacity"
                    values="0;1"
                    keyTimes="0;1"
                    dur="0.6s"
                    begin="0.04s"
                    repeatCount="indefinite"
                    />
                </path>
                </g>

                <!-- Bar 3 -->
                <g transform="translate(10, 40)">
                <path fill="#c5122f" d="M0,-8a62.4,62.4,0,0,0,8,-4V0H0Z">
                    <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="1,0;1,1;1,1"
                    keyTimes="0;0.5;1"
                    dur="0.6s"
                    begin="0.08s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1; 0 0 1 1"
                    />
                    <animate
                    attributeName="opacity"
                    values="0;1"
                    keyTimes="0;1"
                    dur="0.6s"
                    begin="0.08s"
                    repeatCount="indefinite"
                    />
                </path>
                </g>

                <!-- Bar 2 -->
                <g transform="translate(20, 40)">
                <path fill="#c5122f" d="M0,-16a72,72,0,0,0,8,-6V0H0Z">
                    <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="1,0;1,1;1,1"
                    keyTimes="0;0.5;1"
                    dur="0.6s"
                    begin="0.12s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1; 0 0 1 1"
                    />
                    <animate
                    attributeName="opacity"
                    values="0;1"
                    keyTimes="0;1"
                    dur="0.6s"
                    begin="0.12s"
                    repeatCount="indefinite"
                    />
                </path>
                </g>

                <!-- Bar 1 (rightmost, tallest) -->
                <g transform="translate(30, 40)">
                <path fill="#c5122f" d="M0,-28a90.63,90.63,0,0,0,8,-9V0H0Z">
                    <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="1,0;1,1;1,1"
                    keyTimes="0;0.5;1"
                    dur="0.6s"
                    begin="0.16s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.42 0 0.58 1; 0 0 1 1"
                    />
                    <animate
                    attributeName="opacity"
                    values="0;1"
                    keyTimes="0;1"
                    dur="0.6s"
                    begin="0.16s"
                    repeatCount="indefinite"
                    />
                </path>
                </g>
            </svg>

            <!-- Solgeo Wordmark -->
            <img :src="logo" class="h-16" />
        </div>
    </div>
  </div>
</template>


<style scoped>
.bar {
  width: 1.5rem;
  background-color: #ae1e3b;
  opacity: 0.5;
  animation: pulse 1.5s infinite;
  transform-origin: bottom;
  border-radius: 1px;
}

.animate-bar-delay-0 {
  animation-delay: 0s;
}
.animate-bar-delay-1 {
  animation-delay: 0.2s;
}
.animate-bar-delay-2 {
  animation-delay: 0.4s;
}
.animate-bar-delay-3 {
  animation-delay: 1.5s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scaleY(0.3);
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
  }
}
</style>
