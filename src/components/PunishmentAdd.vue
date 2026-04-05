<!-- src/components/PunishmentAdd.vue -->
<template>
  <div class="punishment-add">
    <a-card title="新增惩处">
      <PunishmentForm 
        ref="punishmentFormRef"
        @save="handleSave"
      />
    </a-card>
  </div>
</template>

<script>
import PunishmentForm from './PunishmentForm.vue';

export default {
  name: 'PunishmentAdd',
  components: {
    PunishmentForm
  },
  methods: {
    handleSave(punishmentData) {
      // 保存惩处记录
      console.log('新增惩处:', punishmentData);
      this.$message.success('新增惩处成功');
      // 触发返回父组件，切换到惩处列表
      this.$emit('back-to-list');
    }
  }
};
</script>

<style scoped>
.punishment-add {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 80vh;
}
</style>