<script setup lang="ts">
function getPopupContainer(
  el: any,
  dialogContext: { getDialogWrap: () => any },
) {
  if (dialogContext) {
    return dialogContext.getDialogWrap();
  } else {
    return document.body;
  }
}
</script>

<template>
  <a-config-provider :getPopupContainer="getPopupContainer">
    <router-view />
  </a-config-provider>
</template>

<style scoped>
</style>
