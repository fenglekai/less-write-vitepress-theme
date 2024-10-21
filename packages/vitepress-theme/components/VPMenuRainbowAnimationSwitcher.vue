<script lang="ts" setup>
import { useLocalStorage, useMediaQuery } from "@vueuse/core";
import { inBrowser } from "vitepress";
import { computed, watch } from "vue";
import VPRainbowSwitcher from "./VPRainbowSwitcher.vue";
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
    <div class="group" :class="{ mobile: screenMenu }">
      <div class="NavScreenRainbowAnimation">
        <p class="text">
          {{ text ?? "Rainbow Animation" }}
        </p>
        <VPRainbowSwitcher
          :title="switchTitle"
          class="VPRainbowSwitcher"
          :aria-checked="animated ? 'true' : 'false'"
          @click="toggleRainbow"
        >
          <VPIconPlay class="i-play:rainbow animated" />
          <VPIconStop class="i-stop:rainbow-off non-animated" />
        </VPRainbowSwitcher>
      </div>
    </div>
</template>

<style scoped>
.items * + .group {
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 1rem !important;
}

.items .group:not(.mobile) .NavScreenRainbowAnimation {
  padding-top: 0;
}

.items * + .group:not(.mobile) .NavScreenRainbowAnimation {
  padding-top: 10px;
}

.group.mobile {
  border: none !important;
  margin-top: 8px;
}

.group.mobile .NavScreenRainbowAnimation {
  background-color: var(--vp-c-bg-soft);
}

.group.mobile .NavScreenRainbowAnimation::before {
  margin-top: 16px;
  background-color: var(--vp-c-bg);
}

@media (min-width: 768px) {
  .group:not(.mobile) {
    margin-bottom: -10px;
    padding-top: 0;
    width: 220px;
  }
}

.NavScreenRainbowAnimation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  padding: 12px 12px 12px 12px;
  background-color: var(--vp-c-bg-elv);
}
.group.mobile .NavScreenRainbowAnimation {
  max-width: unset;
}

.text {
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.animated {
  opacity: 0;
}

.non-animated {
  opacity: 0;
}

.VPRainbowSwitcher[aria-checked="false"] .non-animated {
  opacity: 1;
}

.VPRainbowSwitcher[aria-checked="true"] .animated {
  opacity: 1;
}

.VPRainbowSwitcher[aria-checked="false"] :deep(.check) {
  /*rtl:ignore*/
  transform: translateX(18px);
}
</style>
