<template>
  <div class="h-full my-auto">
    <p class="text-xl font-bold mb-5">
      Bienvenue dans la démonstration myDid !
    </p>
    <p class="">
      Explorez un univers où la sécurité numérique rencontre l'innovation. myDid
      vous invite à découvrir son processus de demande d'information
      révolutionnaire.
    </p>
    <p class="mb-5">Prêt à plonger dans le monde de l'identité numérique ?</p>
    <p class="mb-3">Choisissez votre chemin :</p>
    <div class="flex items-center gap-5 my-3">
      <p class="text-xl leading-none">•</p>
      <p>
        <span class="font-bold">Scannez le QR code</span>
        Pour demander une information, scannez le QR code et suivez les
        instructions.
      </p>
    </div>

    <div class="lg:flex justify-center my-5 gap-5">
      <button @click="displayQrCode = true" class="w-full md:w-1/2">
        <span
          class="text-sm text-white text-center bg-secondary font-semibold w-56 md:w-96 rounded-lg py-3 px-5 cursor-pointer"
        >
          Affichez le QR code
        </span>
      </button>
    </div>

    <div
      v-if="displayQrCode"
      class="z-10 fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
    >
      <div
        class="bg-white md:w-1/2 md:h-1/2 mx-3 flex flex-col justify-center items-center rounded-lg shadow-md px-8 py-6 relative"
      >
        <div class="p-4 bg-white rounded-lg shadow-md">
          <QrCodeView></QrCodeView>
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
import { ref } from 'vue';
export default {
  setup() {
    const displayQrCode = ref(false);
    return {
      displayQrCode,
    };
  },
};
</script>
