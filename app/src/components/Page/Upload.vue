<template>
  <div>
    <form @submit.prevent="addVideo" class="space-y-8 divide-y divide-gray-200">
      <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div class="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Upload video
            </h3>
          </div>
          <div class="space-y-6 sm:space-y-5">
            <div
              class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
            >
              <label
                for="first-name"
                class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                IPFS Cid
              </label>
              <div class="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="ipfs_cid"
                  v-model="ipfsCid"
                  class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div
              class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
            >
              <label
                for="last-name"
                class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Price (USD)
              </label>
              <div class="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="price"
                  v-model="price"
                  class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-5">
        <div class="flex justify-end">
          <button
            type="submit"
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "PageUpload",
};
</script>

<script setup>
import { ref } from "vue";
import { createVideo } from "@/api";
import { useWorkspace } from "@/composables";

const ipfsCid = ref(null);
const price = ref(null);
const workspace = useWorkspace();

const addVideo = async () => {
  try {
    const video = await createVideo(
      workspace,
      ipfsCid.value,
      Number(price.value * 100)
    );

    ipfsCid.value = null;
    price.value = null;

    console.log(video);
  } catch (e) {
    console.log("Error adding video", e);
  }
};
</script>
