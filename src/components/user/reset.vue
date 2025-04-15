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

            <a-form-item label="上传头像" name="avatar">
                <a-upload
                    :before-upload="beforeUpload"
                    :custom-request="handleUpload"
                    :show-upload-list="false"
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
const loading = ref(false)
const avatarUrl = ref<string | null>(null)
// 使用 v-model 语法糖优化 props 传递

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["update:modelValue"]);
const formRef = ref();
const passwordRules = [
    { required: true, message: "请输入密码" },
    { min: 6, message: "密码长度至少6位" },
    {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
        message: "密码必须包含字母和数字",
    },
];

const rules = {
    oldPassword: passwordRules,
    password: passwordRules,
};

// 头像上传逻辑
function beforeUpload(file: File) {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
        notification.error({
            message: "错误",
            description: "只能上传图片文件",
        });
    }
    return isImage;
}

function handleUpload({ file }: { file: File }) {
    const formData = new FormData();
    formData.append("file", file);

     uploadFile.uploadFile(file, "/api/user/Uploadavatar")
        .then((response: any) => {
            avatarUrl.value = response.data; // 假设返回的 URL 是头像地址
            notification.success({
                message: "成功",
                description: "头像上传成功",
            });
        })
        .catch(() => {
            notification.error({
                message: "错误",
                description: "头像上传失败",
            });
        });
}

function submit() {
    loading.value = true;
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
        .catch((error: any) => {
            console.error("Validation failed:", error);
        })
        .finally(() => {
            loading.value = false;
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

.avatar-preview {
    margin-top: 10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ddd;
}
</style>
