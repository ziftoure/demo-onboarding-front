<template>
  <div class=" mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
      Select fields to display during onboarding
    </h1>
    <div class="flex flex-col md:flex-row gap-8">
      <!--  Left side of the screen -->
      <div class="w-full md:w-1/2 lg:w-1/3">
        <form class="bg-white shadow-md rounded px-8 pt-5 pb-8 mb-4">
          <div class="mb-4">
            <label
              for="fieldSelect"
              class="block text-gray-700 text-lg font-bold mb-2"
            >
              Select a field
            </label>
            <select
              id="fieldSelect"
              v-model="selectedField"
              @change="handleFieldSelection"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a field</option>
              <option
                v-for="field in availableFields"
                :key="field.id"
                :value="field.id"
              >
                {{ field.id }}
              </option>
            </select>
          </div>

          <div v-if="isCustomData" class="mb-4">
            <input
              v-model="customDataTitle.en"
              placeholder="Title in English"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            />
            <input
              v-model="customDataTitle.fr"
              placeholder="Title in French"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            />
            <div>
              <label for="customDataType" class="block text-gray-700 text-xs">
                Field type
              </label>
              <select
                v-model="customDataType"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option selected value="">--Please choose an option--</option>
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
            </div>
          </div>

          <button
            @click="addField"
            type="button"
            :disabled="!selectedField"
            :class="
              !selectedField
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-secondary cursor-pointer'
            "
            class="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Add field
          </button>
        </form>
      </div>

      <!-- 
      Right side of the screen
       -->
      <div class="w-full md:w-1/2 ">
        <div class="bg-white  px-8 pt-6 pb-8 mb-4">
          <h2 class="text-lg font-bold mb-4 text-gray-800">
            Selected fields preview
          </h2>
          <div
            v-for="field in addedFields"
            :key="field.id"
            class="mb-2 flex items-center justify-between"
          >
            <div>
              <strong>{{ field.id }}: </strong>
              <span v-if="field.type === 'file'"> {type: file} </span>
              <span v-else>{ type: {{ field.type }} }</span>
              <span v-if="field.title">
                { type: {{ field.type }} } title: { en: {{ field.title.en }},
                fr: {{ field.title.fr }} }
              </span>
            </div>
            <button
              @click="removeField(field)"
              class="text-red-500 hover:text-red-700"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
          <div class="flex items-center justify-end mt-16">
            <button
              @click="generateQRCode"
              :disabled="!addedFields.length"
              class="w-full md:w-1/2"
            >
              <span
                :class="
                  !addedFields.length
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-secondary cursor-pointer'
                "
                class="text-sm text-white text-center font-semibold w-56 md:w-96 rounded-lg py-3 px-5 cursor-pointer"
              >
                Generate QR code
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="displayQrCode"
      class="z-10 fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
    >
      <div
        class="bg-white md:w-1/2 md:h-1/2 mx-3 flex flex-col justify-center items-center rounded-lg shadow-md px-8 py-6 relative"
      >
        <div class="p-4 bg-white rounded-lg shadow-md">
          <QrCodeView :schema="addedFields" />
          <button
            @click="displayQrCode = false"
            class="absolute top-2 right-2 text-gray-700"
          >
            <svg
              class="w-6 text-red-500 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, inject } from 'vue';
import { createToast } from 'mosha-vue-toastify';

export default {
  setup() {
    const $api = inject('$api');
    const addedFields = ref([]);
    const selectedField = ref('');
    const isCustomData = ref(false);
    const customDataTitle = reactive({ en: '', fr: '' });
    const customDataType = ref('');
    const customDataCount = ref(0);
    const availableFields = ref([]);
    const displayQrCode = ref(false);

    $api.getAllowedFields().then(({ data }) => {
      availableFields.value = data.allowedFields;
    });

    const handleFieldSelection = () => {
      isCustomData.value = selectedField.value === 'customData';
    };

    const isFieldValid = (field) => field && field.trim() !== '';

    const addField = () => {
      const field = availableFields.value.find(
        (f) => f.id === selectedField.value
      );
      if (!field) return;

      if (field.id === 'customData') {
        if (
          !isFieldValid(customDataTitle.en) ||
          !isFieldValid(customDataTitle.fr) ||
          !isFieldValid(customDataType.value)
        ) {
          createToast('Please fill in all the fields to add custom data', {
            position: 'bottom-center',
            hideProgressBar: true,
            timeout: 3000,
            transition: 'slide',
            toastBackgroundColor: '#ff4545',
          });
          return;
        }
        addedFields.value.push({
          id: `customData${++customDataCount.value}`,
          type: customDataType.value,
          title: { ...customDataTitle },
        });
      } else {
        addedFields.value.push({
          ...field,
          type: field.id === 'idDocument' ? 'file' : 'text',
        });
      }

      availableFields.value = availableFields.value.filter(
        (f) => f.id !== field.id || f.id === 'customData'
      );
      selectedField.value = '';
      isCustomData.value = false;
      customDataTitle.en = customDataTitle.fr = customDataType.value = '';
    };

    const generateQRCode = () => {
      addedFields.value = [...addedFields.value];
      displayQrCode.value = true;
    };
    const removeField = (fieldToRemove) => {
      // delete field from addedFields
      addedFields.value = addedFields.value.filter(
        (field) => field.id !== fieldToRemove.id
      );
      
      // if it's not a customData field, add the removed field back to availableFields
      if (!fieldToRemove.id.startsWith('customData')) {
        // add the removed field back to availableFields
        availableFields.value.push({
          id: fieldToRemove.id,
        });
      }
      // if it's a customData field and there are no more customData fields in addedFields, reset customDataCount
      if (
        fieldToRemove.id.startsWith('customData') &&
        !addedFields.value.some((field) => field.id.startsWith('customData'))
      ) {
        customDataCount.value = 0;
      }
    };

    return {
      addedFields,
      availableFields,
      selectedField,
      isCustomData,
      customDataTitle,
      customDataType,
      handleFieldSelection,
      addField,
      generateQRCode,
      displayQrCode,
      removeField,
    };
  },
};
</script>
