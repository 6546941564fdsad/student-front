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
export default {
  name: 'PunishmentAdd',
  components: {
    PunishmentForm: () => import('./PunishmentForm.vue')
  },
  methods: {
    handleSave(punishmentData) {
      // 保存惩处记录
      console.log('新增惩处:', punishmentData);
      this.$message.success('新增惩处成功');
      // 可以跳转到惩处记录列表
      this.$router.push('/punishment-list');
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