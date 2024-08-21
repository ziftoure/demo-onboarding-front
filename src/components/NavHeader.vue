<template>
  <div class="flex items-center p-10 pb-3">
    <a href="/">
      <img
        :src="require('/assets/images/mydid-logo.png')"
        alt=""
        class="w-28"
      />
    </a>
    <div class="grow"></div>
    <div class="mr-3 lg:mr-10">
      <a href="https://support.mydid.com/" target="_blank"
        ><p class="flex">
          <icon name="help" class="w-5 fill-black mr-2" /><span
            class="hidden lg:block"
            >Aide</span
          >
        </p></a
      >
    </div>
    <div class="hidden lg:block text-xl font-bold">Demo</div>
  </div>
</template>

<script>
export default {
  props: {},
  setup(props, context) {},
};
</script>
