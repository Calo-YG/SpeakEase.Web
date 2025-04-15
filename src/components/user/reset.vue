<template>
    <div class="reset-password">
        <a-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            @submit.prevent="submit"
            layout="vertical"
            @finish="submit()"
        >
            <a-form-item label="旧密码" name="oldPassword">
                <a-input-password
                    v-model:value="formData.oldPassword"
                    placeholder="请输入旧密码"
                />
            </a-form-item>

            <a-form-item label="新密码" name="password">
                <a-input-password
                    v-model:value="formData.password"
                    placeholder="请输入新密码"
                />
            </a-form-item>

            <a-form-item>
                <a-button type="primary" html-type="submit" :loading="loading">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { UpdateUserRequest } from "@/api/user/user";
import { modifyPassword } from "@/api/user/index";
import { notification } from "ant-design-vue";
import { TokenStorage } from "@/utils/tokenStorage";
import { useRouter } from "vue-router";

const router = useRouter();
const formData = ref<UpdateUserRequest>({
    oldPassword: "",
    password: "",
});
const loading = ref(false)

const formRef = ref();
// Removed unused props declaration
const emit = defineEmits(["update:modelValue"]);

const passwordRules = [
  { required: true, message: "请输入密码" },
  { min: 6, message: "密码长度至少6位" },
  {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
    message: "密码必须包含字母和数字",
  },
]

const rules = {
  oldPassword: passwordRules,
  password: passwordRules,
}

function submit() {
    loading.value = true
    formRef.value
        .validateFields()
        .then(() => {
            modifyPassword(formData.value).then(() => {
                TokenStorage.clear();
                emit("update:modelValue", false); // 关闭弹窗
                router.push("/login");
                notification.success({
                    message: "成功",
                    description: "修改密码成功",
                    duration: 1,
                });
            });
        })
        .catch((error:any) => {
            console.error("Validation failed:", error);
        })
        .finally(()=>{
            loading.value= false
        });
}
</script>

<style scoped>
.reset-password {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
