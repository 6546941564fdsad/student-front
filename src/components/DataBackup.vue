<!-- src/components/DataBackup.vue -->
<template>
  <div class="data-backup">
    <a-card title="数据备份">
      <a-alert message="数据备份管理" description="支持手动备份和自动备份，确保数据安全" type="info" show-icon style="margin-bottom: 16px" />
      
      <!-- 备份操作 -->
      <a-card title="备份操作" style="margin-bottom: 16px">
        <a-space size="large">
          <a-button type="primary" @click="manualBackup" :loading="backupLoading">
            <template #icon><database-outlined /></template>
            立即备份
          </a-button>
          <a-button @click="showRestoreModal">
            <template #icon><undo-outlined /></template>
            恢复数据
          </a-button>
          <a-button @click="downloadBackup">
            <template #icon><download-outlined /></template>
            下载备份
          </a-button>
        </a-space>
      </a-card>
      
      <!-- 自动备份设置 -->
      <a-card title="自动备份设置" style="margin-bottom: 16px">
        <a-form layout="inline">
          <a-form-item label="自动备份">
            <a-switch v-model:checked="autoBackupEnabled" @change="toggleAutoBackup" />
          </a-form-item>
          <a-form-item label="备份频率">
            <a-select v-model:value="backupFrequency" style="width: 150px" :disabled="!autoBackupEnabled">
              <a-option value="daily">每天</a-option>
              <a-option value="weekly">每周</a-option>
              <a-option value="monthly">每月</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="备份时间">
            <a-time-picker v-model:value="backupTime" format="HH:mm" :disabled="!autoBackupEnabled" />
          </a-form-item>
          <a-form-item label="保留份数">
            <a-input-number v-model:value="retainCount" :min="1" :max="30" :disabled="!autoBackupEnabled" />
          </a-form-item>
        </a-form>
      </a-card>
      
      <!-- 备份历史 -->
      <a-card title="备份历史">
        <a-table :columns="columns" :data-source="backupHistory" row-key="id" :loading="loading">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'type'">
              <a-tag :color="record.type === '自动备份' ? 'blue' : 'green'">{{ record.type }}</a-tag>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === '成功' ? 'green' : 'red'">{{ record.status }}</a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-space size="small">
                <a-button type="primary" size="small" @click="restoreFromBackup(record)">
                  <template #icon><undo-outlined /></template>
                  恢复
                </a-button>
                <a-button danger size="small" @click="deleteBackup(record.id)">
                  <template #icon><delete-outlined /></template>
                  删除
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-card>
    
    <!-- 恢复确认对话框 -->
    <a-modal
      title="确认恢复"
      :open="showRestoreConfirm"
      @ok="handleRestoreOk"
      @cancel="handleRestoreCancel"
    >
      <a-alert message="警告" description="数据恢复将覆盖当前所有数据，此操作不可撤销！" type="warning" show-icon style="margin-bottom: 16px" />
      <p>确定要从 <strong>{{ currentBackup?.time }}</strong> 的备份恢复吗？</p>
    </a-modal>
  </div>
</template>

<script>
import { DatabaseOutlined, UndoOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'DataBackup',
  components: { DatabaseOutlined, UndoOutlined, DownloadOutlined, DeleteOutlined },
  data() {
    return {
      loading: false,
      backupLoading: false,
      showRestoreConfirm: false,
      currentBackup: null,
      autoBackupEnabled: true,
      backupFrequency: 'daily',
      backupTime: dayjs('02:00', 'HH:mm'),
      retainCount: 7,
      backupHistory: [
        {
          id: 1,
          type: '自动备份',
          time: '2026-04-05 02:00:00',
          size: '125 MB',
          status: '成功',
          remark: '日常自动备份'
        },
        {
          id: 2,
          type: '手动备份',
          time: '2026-04-04 15:30:00',
          size: '123 MB',
          status: '成功',
          remark: '系统更新前备份'
        },
        {
          id: 3,
          type: '自动备份',
          time: '2026-04-04 02:00:00',
          size: '122 MB',
          status: '成功',
          remark: '日常自动备份'
        },
        {
          id: 4,
          type: '自动备份',
          time: '2026-04-03 02:00:00',
          size: '120 MB',
          status: '失败',
          remark: '磁盘空间不足'
        }
      ],
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '备份类型', dataIndex: 'type', key: 'type', width: 120 },
        { title: '备份时间', dataIndex: 'time', key: 'time', width: 180 },
        { title: '备份大小', dataIndex: 'size', key: 'size', width: 120 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        { title: '操作', key: 'action', width: 200 }
      ]
    };
  },
  methods: {
    manualBackup() {
      this.backupLoading = true;
      setTimeout(() => {
        const newBackup = {
          id: this.backupHistory.length + 1,
          type: '手动备份',
          time: new Date().toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
          }).replace(/\//g, '-'),
          size: '126 MB',
          status: '成功',
          remark: '手动触发备份'
        };
        this.backupHistory.unshift(newBackup);
        this.backupLoading = false;
        this.$message.success('数据备份成功');
      }, 2000);
    },
    showRestoreModal() {
      if (this.backupHistory.length === 0) {
        this.$message.warning('暂无备份记录');
        return;
      }
      this.currentBackup = this.backupHistory[0];
      this.showRestoreConfirm = true;
    },
    restoreFromBackup(backup) {
      this.currentBackup = backup;
      this.showRestoreConfirm = true;
    },
    handleRestoreOk() {
      this.$message.success('数据恢复成功');
      this.showRestoreConfirm = false;
    },
    handleRestoreCancel() {
      this.showRestoreConfirm = false;
    },
    downloadBackup() {
      this.$message.success('开始下载备份文件');
    },
    toggleAutoBackup(enabled) {
      this.$message.success(enabled ? '已开启自动备份' : '已关闭自动备份');
    },
    deleteBackup(id) {
      this.$confirm({
        title: '删除确认',
        content: '确定要删除该备份记录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.backupHistory = this.backupHistory.filter(b => b.id !== id);
          this.$message.success('删除备份成功');
        }
      });
    }
  }
};
</script>

<style scoped>
.data-backup {
  padding: 20px;
}
</style>
