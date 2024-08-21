<template>
  <div class="flex h-screen">
    <div
      class="w-full"
    >
      <NavHeader v-if="!isProtectedRoute"></NavHeader>
      <div
        class="w-10/12 2xl:w-3/4 mx-auto py-10"
        :class="isProtectedRoute ? 'w-full lg:w-full' : ''"
      >
        <router-view v-slot="slotProps" :key="$route.fullPath">
          <component :is="slotProps.Component"></component>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavHeader from './components/NavHeader.vue';
export default {
  setup() {
    const route = useRoute();
    const isProtectedRoute = ref(false);
    watch(route, () => {
      isProtectedRoute.value = route.path == '/protected';
    });

    return { isProtectedRoute };
  },
  components: {
    NavHeader,
  },
};
</script>
