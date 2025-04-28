<template>
  <div class="settings-container">
    <a-card title="设置">
      <a-form layout="vertical">
        <a-form-item label="主题">
          <a-select v-model:value="theme" style="width: 200px">
            <a-select-option value="light">浅色</a-select-option>
            <a-select-option value="dark">深色</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const theme = ref("light");
</script>

<style scoped>
.settings-container {
  padding: 24px;
}
</style> 