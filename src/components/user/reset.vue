<template>
    <div class="reset-password">
        <form @submit.prevent="submit" class="reset-form">
            <div class="form-group">
                <label>旧密码</label>
                <div class="input-wrapper">
                    <input
                        :type="showOldPassword ? 'text' : 'password'"
                        v-model="formData.oldPassword"
                        placeholder="请输入旧密码"
                        maxlength="20"
                        @input="validateOldPassword"
                    />
                    <span 
                        class="toggle-password"
                        @click="showOldPassword = !showOldPassword"
                    >
                        👁️
                    </span>
                </div>
                <span class="error-message" v-if="errors.oldPassword">{{ errors.oldPassword }}</span>
            </div>

            <div class="form-group">
                <label>新密码</label>
                <div class="input-wrapper">
                    <input
                        :type="showNewPassword ? 'text' : 'password'"
                        v-model="formData.password"
                        placeholder="请输入新密码"
                        maxlength="20"
                        @input="validateNewPassword"
                    />
                    <span 
                        class="toggle-password"
                        @click="showNewPassword = !showNewPassword"
                    >
                        👁️
                    </span>
                </div>
                <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
                <div class="password-strength" v-if="formData.password">
                    <div class="strength-bar">
                        <div :class="['strength-level', strengthClass]"></div>
                    </div>
                    <span class="strength-text">{{ strengthText }}</span>
                </div>
            </div>

            <div class="form-group">
                <label>头像上传</label>
                <div class="upload-area" @click="triggerFileInput" @drop.prevent="handleDrop" @dragover.prevent>
                    <input
                        type="file"
                        ref="fileInput"
                        accept="image/*"
                        class="file-input"
                        @change="handleFileChange"
                    />
                    <div class="upload-content" v-if="!avatarUrl">
                        <div class="upload-icon">📷</div>
                        <div class="upload-text">点击或拖拽图片至此处</div>
                        <div class="upload-hint">支持 jpg、png 格式，大小不超过 2MB</div>
                    </div>
                    <img v-else :src="avatarUrl" alt="头像预览" class="avatar-preview" />
                </div>
            </div>

            <button 
                type="submit" 
                class="submit-button" 
                :class="{ loading }" 
                :disabled="loading || hasErrors"
            >
                <span class="button-text">{{ loading ? '提交中...' : '确认修改' }}</span>
            </button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import type { UpdateUserRequest } from "@/api/user/user";
import { modifyPassword } from "@/api/user/index";
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
const fileInput = ref<HTMLInputElement | null>(null);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const errors = ref({
    oldPassword: '',
    password: ''
});

// 密码强度计算
const strengthClass = computed(() => {
    const password = formData.value.password;
    if (!password) return '';
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const length = password.length;
    
    if (length < 6) return 'weak';
    if (hasLetter && hasNumber && hasSpecial && length >= 8) return 'strong';
    if ((hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial)) return 'medium';
    return 'weak';
});

const strengthText = computed(() => {
    const strengthMap = {
        weak: '弱',
        medium: '中',
        strong: '强'
    } as const;
    
    return strengthClass.value ? strengthMap[strengthClass.value] : '';
});

const hasErrors = computed(() => {
    return Object.values(errors.value).some(error => error !== '');
});

function validateOldPassword() {
    const value = formData.value.oldPassword;
    if (!value) {
        errors.value.oldPassword = '请输入旧密码';
    } else if (value.length < 6 || value.length > 20) {
        errors.value.oldPassword = '密码长度6-20位';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(value)) {
        errors.value.oldPassword = '密码必须包含字母和数字';
    } else {
        errors.value.oldPassword = '';
    }
}

function validateNewPassword() {
    const value = formData.value.password;
    if (!value) {
        errors.value.password = '请输入新密码';
    } else if (value.length < 6 || value.length > 20) {
        errors.value.password = '密码长度6-20位';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(value)) {
        errors.value.password = '密码必须包含字母和数字';
    } else {
        errors.value.password = '';
    }
}

function triggerFileInput() {
    fileInput.value?.click();
}

function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
        handleFile(input.files[0]);
    }
}

function handleDrop(event: DragEvent) {
    const files = event.dataTransfer?.files;
    if (files?.length) {
        handleFile(files[0]);
    }
}

function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
        showError("只能上传图片文件");
        return;
    }
    if (file.size / 1024 / 1024 > 2) {
        showError("图片大小不能超过 2MB");
        return;
    }
    uploadAvatar(file);
}

async function uploadAvatar(file: File) {
    try {
        const response = await uploadFile.uploadFile(file, "/api/user/Uploadavatar");
        avatarUrl.value = response.data;
        showSuccess("头像上传成功");
    } catch (error) {
        console.error("头像上传失败:", error);
        showError("头像上传失败，请重试");
    }
}

async function submit() {
    validateOldPassword();
    validateNewPassword();
    
    if (hasErrors.value) return;
    
    try {
        loading.value = true;
        await modifyPassword(formData.value);
        TokenStorage.clear();
        emit("update:modelValue", false);
        
        showSuccess("修改密码成功，请重新登录");
        setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
        console.error("表单提交失败:", error);
        showError("修改密码失败，请重试");
    } finally {
        loading.value = false;
    }
}

function showSuccess(message: string) {
    // 这里可以使用你喜欢的提示组件
    alert(message);
}

function showError(message: string) {
    // 这里可以使用你喜欢的提示组件
    alert(message);
}

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped>
.reset-password {
    max-width: 440px;
    margin: 0 auto;
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.reset-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

input {
    width: 100%;
    height: 40px;
    padding: 0 40px 0 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #1f2937;
    background: #fff;
    transition: all 0.3s;
}

input:focus {
    outline: none;
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.toggle-password {
    position: absolute;
    right: 12px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s;
}

.toggle-password:hover {
    opacity: 1;
}

.error-message {
    font-size: 12px;
    color: #dc2626;
}

.password-strength {
    margin-top: 8px;
}

.strength-bar {
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
}

.strength-level {
    height: 100%;
    width: 0;
    transition: all 0.3s;
}

.strength-level.weak {
    width: 33.33%;
    background: #dc2626;
}

.strength-level.medium {
    width: 66.66%;
    background: #f59e0b;
}

.strength-level.strong {
    width: 100%;
    background: #10b981;
}

.strength-text {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
}

.upload-area {
    position: relative;
    width: 100%;
    height: 160px;
    border: 2px dashed #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
}

.upload-area:hover {
    border-color: #1677ff;
    background: rgba(22, 119, 255, 0.02);
}

.file-input {
    display: none;
}

.upload-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.upload-icon {
    font-size: 32px;
    color: #6b7280;
}

.upload-text {
    font-size: 14px;
    color: #374151;
}

.upload-hint {
    font-size: 12px;
    color: #6b7280;
}

.avatar-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.submit-button {
    height: 40px;
    background: #1677ff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
}

.submit-button:not(:disabled):hover {
    background: #0958d9;
}

.submit-button:disabled {
    background: #e5e7eb;
    cursor: not-allowed;
}

.submit-button.loading {
    background: #1677ff;
    cursor: wait;
}

.button-text {
    position: relative;
    z-index: 1;
}

@media (max-width: 768px) {
    .reset-password {
        padding: 16px;
        margin: 16px;
        max-width: none;
    }
    
    .reset-form {
        gap: 16px;
    }
    
    .upload-area {
        height: 120px;
    }
}
</style>
