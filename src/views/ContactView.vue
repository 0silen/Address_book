<template>
  <div class="mobile-container">
    <div class="header">
      <el-input
        v-model="searchQuery"
        placeholder="搜索联系人..."
        prefix-icon="Search"
        clearable
        @input="handleSearch"
        class="search-input"
      />
      <el-dropdown @command="handleCommand" trigger="hover">
        <el-button icon="MoreFilled" class="dropdown-btn" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="add">添加联系人</el-dropdown-item>
            <el-dropdown-item command="export">导出为 CSV</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div v-if="!loading">
      <div v-for="(group, letter) in groupedContacts" :key="letter" class="group">
        <div class="group-title">{{ letter }}</div>
        <div
          v-for="contact in group"
          :key="contact.id"
          class="contact-card"
          @click="editContact(contact)"
        >
          <div class="contact-name">{{ contact.name }}</div>
          <div class="contact-info">{{ contact.phoneNumber }}</div>
        </div>
      </div>
    </div>
    <div v-else class="loading">加载中...</div>

    <el-drawer v-model="drawerVisible" title="联系人信息" direction="btt" size="100%">
      <ContactForm
        :contact="currentContact"
        @save="handleSave"
        @close="closeDrawer"
        @deleted="handleDelete"
      />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ContactForm from '@/components/ContactForm.vue';
import api from '@/utils/api';
import { ElMessage } from 'element-plus';

const contacts = ref([]);
const searchQuery = ref('');
const drawerVisible = ref(false);
const currentContact = ref({});
const loading = ref(false);

const loadContacts = async () => {
  loading.value = true;
  try {
    const res = await api.getContacts();
    contacts.value = res.data;
  } catch {
    ElMessage.error('加载联系人失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  const query = searchQuery.value.trim();
  if (query) {
    try {
      const res = await api.searchContacts(query);
      contacts.value = res.data;
    } catch {
      ElMessage.error('搜索失败');
    }
  } else {
    await loadContacts();
  }
};

const handleCommand = (command) => {
  if (command === 'add') showAddDialog();
  if (command === 'export') exportToCSV();
};

const showAddDialog = () => {
  currentContact.value = {};
  drawerVisible.value = true;
};

const editContact = (contact) => {
  currentContact.value = { ...contact };
  drawerVisible.value = true;
};

const handleSave = async (contact) => {
  try {
    if (contact.id) {
      await api.updateContact(contact.id, contact);
    } else {
      await api.createContact(contact);
    }
    await loadContacts();
    drawerVisible.value = false;
    ElMessage.success('保存成功');
  } catch {
    ElMessage.error('保存失败');
  }
};

const handleDelete = async (id) => {
  try {
    await api.deleteContact(id);
    ElMessage.success('删除成功');
    await loadContacts();
    drawerVisible.value = false;
  } catch {
    ElMessage.error('删除失败');
  }
};

const exportToCSV = () => {
  const headers = ['姓名', '电话', '邮箱', '地址', '关键词'];
  const rows = contacts.value.map(c => [
    c.name || '',
    c.phoneNumber || '',
    c.email || '',
    c.address || '',
    c.keywords || ''
  ]);
  const csvContent = [headers, ...rows]
    .map(row => row.map(v => `"${v.replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'contacts.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const closeDrawer = () => {
  drawerVisible.value = false;
};

const groupedContacts = computed(() => {
  const map = {};
  for (const contact of contacts.value) {
    const first = (contact.name?.charAt(0) || '#').toUpperCase();
    const key = /^[A-Z]$/.test(first) ? first : '#';
    if (!map[key]) map[key] = [];
    map[key].push(contact);
  }
  const sortedKeys = Object.keys(map).sort();
  return Object.fromEntries(sortedKeys.map(k => [k, map[k]]));
});

onMounted(() => {
  loadContacts();
});
</script>

<style scoped>
.mobile-container {
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 80px;
  background-color: #f8f9fa;
  min-height: 100vh;
  overflow-x: hidden;
}
.header {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 12px 16px;
  z-index: 10;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-input {
  flex: 1;
}
.dropdown-btn {
  padding: 8px;
  min-width: 40px;
}
.group {
  padding: 0 16px;
}
.group-title {
  font-size: 14px;
  font-weight: bold;
  color: #999;
  margin: 16px 0 4px;
}
.contact-card {
  background: white;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.contact-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.contact-info {
  font-size: 13px;
  color: #666;
}
.loading {
  text-align: center;
  color: #999;
  margin-top: 40px;
}
</style>
