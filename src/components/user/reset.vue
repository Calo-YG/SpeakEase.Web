<template>
    <div class="reset-password">
        <a-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            @submit.prevent="submit"
            layout="vertical"
        >
            <a-form-item label="旧密码" name="oldPassword">
                <a-input-password
                    v-model:value="formData.oldPassword"
                    placeholder="请输入旧密码"
                    :maxLength="20"
                    allow-clear
                />
            </a-form-item>

            <a-form-item label="新密码" name="password">
                <a-input-password
                    v-model:value="formData.password"
                    placeholder="请输入新密码"
                    :maxLength="20"
                    allow-clear
                />
            </a-form-item>

            <a-form-item label="上传头像" name="avatar">
                <a-upload
                    :before-upload="beforeUpload"
                    :custom-request="handleUpload"
                    :show-upload-list="false"
                    accept="image/*"
                >
                    <a-button icon="upload">点击上传头像</a-button>
                </a-upload>
                <img v-if="avatarUrl" :src="avatarUrl" alt="头像预览" class="avatar-preview" />
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
import uploadFile from "@/http/request";

const router = useRouter();
const formData = ref<UpdateUserRequest>({
    oldPassword: "",
    password: "",
});
const loading = ref(false);
const avatarUrl = ref<string | null>(null);
const formRef = ref();

// 密码验证规则
const passwordRules = [
    { required: true, message: "请输入密码" },
    { min: 6, max: 20, message: "密码长度6-20位" },
    {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
        message: "密码必须包含字母和数字",
    },
];

const rules = {
    oldPassword: passwordRules,
    password: passwordRules,
};

// 头像上传前的验证
function beforeUpload(file: File): boolean {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;
    
    if (!isImage) {
        notification.error({
            message: "错误",
            description: "只能上传图片文件",
        });
        return false;
    }
    if (!isLt2M) {
        notification.error({
            message: "错误",
            description: "图片大小不能超过 2MB",
        });
        return false;
    }
    return true;
}

// 处理头像上传
async function handleUpload({ file }: { file: File }): Promise<void> {
    try {
        const response = await uploadFile.uploadFile(file, "/api/user/Uploadavatar");
        avatarUrl.value = response.data;
        notification.success({
            message: "成功",
            description: "头像上传成功",
        });
    } catch (error) {
        console.error("头像上传失败:", error);
        notification.error({
            message: "错误",
            description: "头像上传失败，请重试",
        });
    }
}

// 提交表单
async function submit(): Promise<void> {
    try {
        loading.value = true;
        await formRef.value.validateFields();
        
        await modifyPassword(formData.value);
        TokenStorage.clear();
        emit("update:modelValue", false);
        
        notification.success({
            message: "成功",
            description: "修改密码成功，请重新登录",
            duration: 1,
        });
        
        router.push("/login");
    } catch (error) {
        console.error("表单提交失败:", error);
        notification.error({
            message: "错误",
            description: "修改密码失败，请重试",
        });
    } finally {
        loading.value = false;
    }
}

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["update:modelValue"]);
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

.avatar-preview {
    margin-top: 10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ddd;
}
</style>
