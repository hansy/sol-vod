<template>
  <div class="flex flex-col my-5">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Video
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Public Key
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Embed code
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(video, index) in videos"
                :key="video.ipfsCid"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ video.metadata.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ video.publicKey }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <code class="bg-gray-200 px-2 py-1">{{
                    embedCode(video.publicKey)
                  }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageLibrary",
};
</script>

<script setup>
import { onMounted, ref } from "vue";
import { authorFilter, getVideos } from "@/api";
import { useWorkspace } from "@/composables";

const videos = ref([]);
const workspace = useWorkspace();

// this script doesn't actually do anything...yet
const embedCode = (videoKey) => {
  return (
    `<script src="http://localhost:8000/api/author/99rhKQbFU68uN2udxSaCtBjnUKcqXTGRMeGMWw9nZhxU/video/${videoKey}">` +
    "</scr" +
    "ipt>"
  );
  // return "hello";
};

onMounted(async () => {
  try {
    const POPEYE_PUB_KEY = "99rhKQbFU68uN2udxSaCtBjnUKcqXTGRMeGMWw9nZhxU";

    videos.value = await getVideos(workspace, [authorFilter(POPEYE_PUB_KEY)]);
  } finally {
    // loading.value = false;
  }
});
</script>
