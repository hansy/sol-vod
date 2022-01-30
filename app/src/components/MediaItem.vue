<template>
  <div>
    <div class="group w-full bg-gray-100 overflow-hidden relative">
      <video-player
        v-if="video.purchased"
        :ipfs-hash="video.ipfsCid"
        :poster="video.metadata.thumb_url"
      />
      <img
        v-else
        :src="video.metadata.thumb_url"
        alt=""
        class="object-cover pointer-events-none"
      />
      <div
        v-if="!video.purchased"
        class="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <button
          @click="emitPurchase"
          type="button"
          class="absolute focus:outline-none border-white border-2 rounded-md px-6 py-4 text-white hover:bg-white hover:text-black"
        >
          <div class="flex flex-col justify-center items-center">
            <div>
              <svg
                class="h-10 w-10 inline-block"
                clip-rule="evenodd"
                fill-rule="evenodd"
                stroke-linejoin="round"
                stroke-miterlimit="2"
                viewBox="0 0 560 400"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <linearGradient id="a">
                  <stop offset="0" stop-color="#00ffa3" />
                  <stop offset="1" stop-color="#dc1fff" />
                </linearGradient>
                <linearGradient
                  id="b"
                  gradientTransform="matrix(-219.666 420.749 -420.749 -219.666 360.879 -37.4553)"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  x2="1"
                  xlink:href="#a"
                  y1="0"
                  y2="0"
                />
                <linearGradient
                  id="c"
                  gradientTransform="matrix(-219.666 420.749 -420.749 -219.666 264.829 -87.6014)"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  x2="1"
                  xlink:href="#a"
                  y1="0"
                  y2="0"
                />
                <linearGradient
                  id="d"
                  gradientTransform="matrix(-219.666 420.749 -420.749 -219.666 312.548 -62.688)"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  x2="1"
                  xlink:href="#a"
                  y1="0"
                  y2="0"
                />
                <g
                  fill-rule="nonzero"
                  transform="matrix(.641643 0 0 .641643 152.409 100)"
                >
                  <path
                    d="m64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8h-317.4c-5.8 0-8.7-7-4.6-11.1z"
                    fill="url(#b)"
                  />
                  <path
                    d="m64.6 3.8c2.5-2.4 5.8-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8h-317.4c-5.8 0-8.7-7-4.6-11.1z"
                    fill="url(#c)"
                  />
                  <path
                    d="m333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8h-317.4c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1z"
                    fill="url(#d)"
                  />
                </g>
              </svg>
              <span class="-ml-1 text-lg">{{ solPrice }}</span>
            </div>
          </div>
          <div class="text-center font-bold uppercase mt-3">Unlock</div>
        </button>
      </div>
    </div>
    <p
      class="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none"
    >
      {{ video.metadata.title }}
    </p>
    <p class="block text-sm font-medium text-gray-500 pointer-events-none">
      ${{ usdPrice }} ~=
      <span
        ><svg
          class="h-6 w-6 inline-block"
          clip-rule="evenodd"
          fill-rule="evenodd"
          stroke-linejoin="round"
          stroke-miterlimit="2"
          viewBox="0 0 560 400"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <linearGradient id="a">
            <stop offset="0" stop-color="#00ffa3" />
            <stop offset="1" stop-color="#dc1fff" />
          </linearGradient>
          <linearGradient
            id="b"
            gradientTransform="matrix(-219.666 420.749 -420.749 -219.666 360.879 -37.4553)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            xlink:href="#a"
            y1="0"
            y2="0"
          />
          <linearGradient
            id="c"
            gradientTransform="matrix(-219.666 420.749 -420.749 -219.666 264.829 -87.6014)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            xlink:href="#a"
            y1="0"
            y2="0"
          />
          <linearGradient
            id="d"
            gradientTransform="matrix(-219.666 420.749 -420.749 -219.666 312.548 -62.688)"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="1"
            xlink:href="#a"
            y1="0"
            y2="0"
          />
          <g
            fill-rule="nonzero"
            transform="matrix(.641643 0 0 .641643 152.409 100)"
          >
            <path
              d="m64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8h-317.4c-5.8 0-8.7-7-4.6-11.1z"
              fill="url(#b)"
            />
            <path
              d="m64.6 3.8c2.5-2.4 5.8-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8h-317.4c-5.8 0-8.7-7-4.6-11.1z"
              fill="url(#c)"
            />
            <path
              d="m333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8h-317.4c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1z"
              fill="url(#d)"
            />
          </g></svg></span
      >{{ solPrice }}
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import VideoPlayer from "@/components/VideoPlayer";

const SOLANA_PRICE = 87.79;

const props = defineProps({
  video: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["onPurchase"]);

const solPrice = computed(() => {
  return (props.video.price / 100 / SOLANA_PRICE).toFixed(5);
});

const usdPrice = computed(() => {
  return (props.video.price / 100).toFixed(2);
});

const emitPurchase = () => {
  emit("onPurchase", props.video.publicKey);
};
</script>
