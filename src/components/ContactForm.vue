<template>
  <el-card class="form-card">
    <el-form
      ref="formRef"
      :model="formData"
      label-width="80px"
      :rules="formRules"
      class="contact-form"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="电话" prop="phoneNumber">
        <el-input v-model="formData.phoneNumber" placeholder="请输入电话号码" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" clearable />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="formData.address" placeholder="请输入地址" clearable />
      </el-form-item>
      <el-form-item label="关键词" prop="keywords">
        <el-input v-model="formData.keywords" placeholder="多个关键词请用逗号分隔" clearable />
      </el-form-item>

      <el-form-item class="form-actions">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button v-if="formData.id" type="danger" @click="confirmDelete">删除</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { ElMessageBox } from 'element-plus';

const props = defineProps({
  contact: { type: Object, required: true },
});

const emit = defineEmits(['save', 'close', 'deleted']);
const formRef = ref(null);
const formData = ref({});

watch(
  () => props.contact,
  (newVal) => {
    formData.value = { ...newVal };
  },
  { deep: true, immediate: true }
);

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phoneNumber: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入有效的邮箱', trigger: ['blur', 'change'] }],
};

const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit('save', formData.value);
    }
  });
};

const confirmDelete = async () => {
  try {
    await ElMessageBox.confirm('确定删除该联系人？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    emit('deleted', formData.value.id);
  } catch {}
};

const close = () => emit('close');
</script>

<style scoped>
.form-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  background: #fff;
}
.contact-form :deep(.el-form-item) {
  margin-bottom: 18px;
}
.contact-form :deep(.el-input__inner) {
  font-size: 15px;
  padding: 10px 12px;
  border-radius: 8px;
}
.contact-form :deep(.el-form-item__label) {
  font-size: 14px;
  color: #333;
}
.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
.form-actions :deep(.el-button) {
  padding: 8px 20px;
  border-radius: 8px;
}
</style>
