<template>
  <a-modal
    :visible="visible"
    title="修改密码"
    @ok="handleSubmit"
    @cancel="$emit('cancel')"
    :confirmLoading="loading"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item label="当前密码" name="oldPassword">
        <a-input-password v-model:value="form.oldPassword" placeholder="请输入当前密码" />
      </a-form-item>
      <a-form-item label="新密码" name="password">
        <a-input-password v-model:value="form.password" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item label="确认新密码" name="confirmPassword">
        <a-input-password v-model:value="form.confirmPassword" placeholder="请再次输入新密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  visible: boolean;
  loading: boolean;
  form: {
    oldPassword: string;
    password: string;
    confirmPassword: string;
  };
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit'): void;
}>();

const handleSubmit = () => {
  emit('submit');
};
</script> 