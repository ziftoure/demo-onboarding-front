<template>
  <div v-if="qrCode">
    <div v-if="!isMobile()">
      <p class="text-lg mb-5 text-center text-gray-800">
        Scannez le QR code avec l'application mobile :
      </p>
      <div class="flex items-center justify-center mb-3">
        <custom-loader v-if="loading" class="mr-2" color="#151838" size="20px">
        </custom-loader>
        <p class="text-md text-gray-700">
          {{ status }}
        </p>
      </div>
      <div class="flex items-center justify-center mb-8">
        <qrcode-vue v-if="qrCode" :value="qrCode" :size="200" level="M" />
      </div>
    </div>
    <div v-else class="flex flex-col items-center">
      <p class="text-lg mb-4 text-center text-gray-800">
        <i class="fas fa-mobile-alt mr-2"></i>
        Ouvrez l'application myDid
      </p>
      <div class="my-5 w-full max-w-xs">
        <a
          :href="qrCode"
          target="_blank"
          class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
        >
          <img
            :src="require('/assets/images/mydid_app_logo.png')"
            alt="myDid App"
            class="w-8 h-8 mr-2"
          />
          Ouvrir l'application
        </a>
      </div>
    </div>
  </div>
  <div v-else>
    <custom-loader
      class="w-full h-full fixed top-0 left-0 z-50 flex items-center justify-center"
      color="#151838"
      size="50px"
    ></custom-loader>
  </div>
</template>

<script>
import { ref, inject, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

export default {
  props: {
    schema: Object,
  },
  setup(props) {
    const $api = inject('$api');

    const qrCode = ref('');
    const status = ref('');
    const verifiableCredentials = ref({});
    const loading = ref(null);
    const displayQrCode = ref(false);
    const router = useRouter();
    onBeforeUnmount(() => {
      $api.closeChallengeValidation();
    });

    $api.createChallenge(props.schema || {}).then((res) => {
      const onboardingRequest = res.data;

      console.log(JSON.stringify(onboardingRequest));
      const deepLink =
        'https://mydid.link?data=' +
        encodeURIComponent(JSON.stringify(onboardingRequest));
      $api.shortenLink('/?data=' + encodeURIComponent(deepLink)).then((res) => {
        qrCode.value = res.data.dynamicLink;
      });
      // CREATE SSE CONNECTION
      $api.waitChallengeValidation(onboardingRequest.sessionId, (response) => {
        switch (response.status) {
          case 'waiting':
            status.value = 'Waiting scan from mobile application';
            loading.value = true;
            break;
          case 'expired':
            status.value = 'Error : ' + response.message;
            loading.value = false;
            break;
          case 'validated':
            status.value = 'Response received. Redirecting...';
            console.log(response);
            router.push('/received-infos/' + response.challenge);
            loading.value = false;
            break;
        }
      });
    });

    function isMobile() {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    }

    return {
      qrCode,
      status,
      verifiableCredentials,
      loading,
      isMobile,
      displayQrCode,
    };
  },
};
</script>
<style scoped></style>
