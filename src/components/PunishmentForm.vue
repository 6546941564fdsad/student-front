<!-- src/components/PunishmentForm.vue -->
<template>
  <div class="punishment-form">
    <a-form 
      :form="form" 
      layout="vertical"
      :model="formData"
    >
      <!-- 学生信息 -->
      <a-card title="学生信息" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-form-item label="学生姓名">
              <a-input v-model="formData.studentName" placeholder="请输入学生姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="学号">
              <a-input v-model="formData.studentId" placeholder="请输入学号" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="学院">
              <a-select v-model="formData.college" placeholder="请选择学院">
                <a-option value="大数据学院">大数据学院</a-option>
                <a-option value="电气学院">电气学院</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="专业">
              <a-select v-model="formData.major" placeholder="请选择专业">
                <a-option value="计算机科学与技术">计算机科学与技术</a-option>
                <a-option value="软件工程">软件工程</a-option>
                <a-option value="电器与信息工程">电器与信息工程</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="班级">
              <a-input v-model="formData.className" placeholder="请输入班级" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      
      <!-- 惩处信息 -->
      <a-card title="惩处信息" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-form-item label="惩处类型">
              <a-select v-model="formData.type" placeholder="请选择惩处类型">
                <a-option value="违纪">违纪</a-option>
                <a-option value="欠费">欠费</a-option>
                <a-option value="警告">警告</a-option>
                <a-option value="记过">记过</a-option>
                <a-option value="留校察看">留校察看</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="惩处时间">
              <a-date-picker 
                v-model="punishmentDate" 
                style="width: 100%" 
                placeholder="请选择惩处时间"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="惩处内容">
              <a-textarea 
                v-model="formData.content" 
                placeholder="请输入惩处内容（如：旷课3节、欠缴学费5000元）"
                :rows="4"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="处理状态">
              <a-select v-model="formData.status" placeholder="请选择处理状态">
                <a-option value="待处理">待处理</a-option>
                <a-option value="已处理">已处理</a-option>
                <a-option value="已销账">已销账</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="处理人">
              <a-input v-model="formData.handler" placeholder="请输入处理人" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      
      <!-- 备注信息 -->
      <a-card title="备注信息">
        <a-form-item label="备注">
          <a-textarea 
            v-model="formData.remark" 
            placeholder="请输入备注信息"
            :rows="3"
          />
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import dayjs from 'dayjs';

export default {
  name: 'PunishmentForm',
  props: {
    punishment: {
      type: Object,
      default: null
    }
  },
  emits: ['save'],
  setup(props, { emit }) {
    const formData = ref({
      studentName: '',
      studentId: '',
      college: '',
      major: '',
      className: '',
      type: '',
      content: '',
      punishmentDate: '',
      status: '待处理',
      handler: '',
      remark: ''
    });
    
    const punishmentDate = ref(null);
    
    // 监听punishment属性变化
    watch(() => props.punishment, (newPunishment) => {
      if (newPunishment) {
        formData.value = {
          ...newPunishment
        };
        // 处理日期
        if (newPunishment.punishmentDate) {
          punishmentDate.value = dayjs(newPunishment.punishmentDate);
        }
      } else {
        // 重置表单
        formData.value = {
          studentName: '',
          studentId: '',
          college: '',
          major: '',
          className: '',
          type: '',
          content: '',
          punishmentDate: '',
          status: '待处理',
          handler: '',
          remark: ''
        };
        punishmentDate.value = null;
      }
    }, { immediate: true, deep: true });
    
    // 处理表单提交
    const handleSubmit = () => {
      // 验证表单
      if (!formData.value.studentName) {
        this.$message.error('请输入学生姓名');
        return;
      }
      if (!formData.value.studentId) {
        this.$message.error('请输入学号');
        return;
      }
      if (!formData.value.type) {
        this.$message.error('请选择惩处类型');
        return;
      }
      if (!formData.value.content) {
        this.$message.error('请输入惩处内容');
        return;
      }
      if (!formData.value.punishmentDate && !punishmentDate.value) {
        this.$message.error('请选择惩处时间');
        return;
      }
      
      // 处理日期
      if (punishmentDate.value) {
        formData.value.punishmentDate = punishmentDate.value.format('YYYY-MM-DD');
      }
      
      // 提交数据
      emit('save', formData.value);
    };
    
    return {
      formData,
      punishmentDate,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.punishment-form {
  padding: 24px;
}
</style>