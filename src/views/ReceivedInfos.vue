<template>
  <div class="w-full lg:w-3/4  mx-auto p-4">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Informations reçues</h1>
      <button
        @click="refreshData"
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Rafraîchir
      </button>
    </header>

    <div v-if="loading" class="text-center py-12">
      <custom-loader color="#4B5563" size="70px" />
    </div>

    <div v-else-if="error" class="text-center text-red-500 py-12">
      Une erreur s'est produite. Veuillez réessayer.
    </div>

    <div v-else-if="receivedData" class="space-y-8">
      <section class="bg-white shadow rounded-lg overflow-hidden">
        <h2 class="text-xl font-semibold text-gray-700 p-6 border-b">
          Données textuelles
        </h2>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="(data, key) in receivedData.textData"
            :key="key"
            class="flex justify-between items-center p-4 hover:bg-gray-50"
          >
            <span class="font-medium text-gray-600 capitalize">{{
              data.id
            }}</span>
            <span class="text-gray-800">{{ data.value }}</span>
          </li>
        </ul>
      </section>

      <section class="bg-white shadow rounded-lg overflow-hidden">
        <h2 class="text-xl font-semibold text-gray-700 p-6 border-b">
          Fichiers reçus
        </h2>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="file in receivedData.files"
            :key="file.fieldname"
            class="flex items-center p-4 hover:bg-gray-50"
          >
            <component
              :is="getFileIcon(file.mimetype)"
              class="w-8 h-8 text-blue-500 flex-shrink-0"
            />
            <div class="ml-4 flex-grow">
              <p class="font-medium text-gray-900">
                {{
                  file.fieldname.startsWith('customData')
                    ? file.title[currentLanguage]
                    : file.fieldname
                }}
              </p>
              <p class="text-sm text-gray-500">
                {{ file.originalname }} ({{ formatFileSize(file.size) }})
              </p>
            </div>
            <button
              @click="downloadFile(file)"
              class="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Télécharger
            </button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { File, Image } from 'lucide-vue-next';
import { inject } from 'vue';

export default {
  setup() {
    const $api = inject('$api');
    const route = useRoute();
    const id = route.params.id;
    const currentLanguage = ref('fr');

    const receivedData = ref(null);
    const error = ref(null);
    const loading = ref(true);

    const fetchData = async () => {
      try {
        loading.value = true;
        const response = await $api.getRequestInfos(id);
        receivedData.value = response.data;
        error.value = null;
      } catch (err) {
        console.error('Error fetching data:', err);
        error.value = err;
      } finally {
        loading.value = false;
      }
    };

    fetchData();

    const refreshData = () => {
      fetchData();
    };

    const getFileIcon = (mimetype) =>
      mimetype.startsWith('image') ? Image : File;

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const downloadFile = (file) => {
      const fileUrl = `${process.env.VUE_APP_DOWNLOAD_URL}/${file.path}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.originalname;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return {
      receivedData,
      error,
      loading,
      refreshData,
      getFileIcon,
      formatFileSize,
      downloadFile,
      currentLanguage,
    };
  },
};
</script>
