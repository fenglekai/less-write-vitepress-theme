<script lang="ts" setup>
import { useLocalStorage, useMediaQuery } from "@vueuse/core";
import { inBrowser } from "vitepress";
import { computed, watch } from "vue";
import RainbowSwitcher from "./RainbowSwitcher.vue";
import VPIconPlay from "./icons/VPIconPlay.vue";
import VPIconStop from "./icons/VPIconStop.vue";

defineProps<{ text?: string; screenMenu?: boolean }>();

const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)").value;

const animated = useLocalStorage(
  "animate-rainbow",
  inBrowser ? !reduceMotion : true
);

function toggleRainbow() {
  animated.value = !animated.value;
}

watch(
  animated,
  (anim) => {
    document.documentElement.classList.remove("rainbow");
    if (anim) {
      document.documentElement.classList.add("rainbow");
    }
  },
  { immediate: inBrowser, flush: "post" }
);

const switchTitle = computed(() => {
  return animated.value
    ? "Disable rainbow animation"
    : "Enable rainbow animation";
});
</script>

<template>
  <div class="RainbowAnimationSwitcherOnNav">
    <div class="NavScreenRainbowAnimation">
      <RainbowSwitcher
        :title="switchTitle"
        class="RainbowAnimationSwitcher"
        :aria-checked="animated ? 'true' : 'false'"
        @click="toggleRainbow"
      >
        <VPIconPlay class="i-play:rainbow animated" />
        <VPIconStop class="i-stop:rainbow-off non-animated" />
      </RainbowSwitcher>
    </div>
  </div>
</template>

<style scoped>
.RainbowAnimationSwitcherOnNav {
  display: none;
}
@media (min-width: 1280px) {
  .RainbowAnimationSwitcherOnNav {
    display: flex;
    align-items: center;
  }
}

.animated {
  opacity: 0;
}

.non-animated {
  opacity: 0;
}

.RainbowAnimationSwitcher[aria-checked="false"] .non-animated {
  opacity: 1;
}

.RainbowAnimationSwitcher[aria-checked="true"] .animated {
  opacity: 1;
}

.RainbowAnimationSwitcher[aria-checked="false"] :deep(.check) {
  /*rtl:ignore*/
  transform: translateX(18px);
}
</style>
