<template>
  <div class="activity-publish">
    <a-card title="发布活动">
      <a-form ref="formRef" :model="form" layout="vertical" style="max-width: 800px">
        <a-divider orientation="left">基本信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="活动名称" name="name" :rules="[{ required: true, message: '请输入活动名称' }]">
              <a-input v-model="form.name" placeholder="如：2024 年秋季校运会" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="活动类型" name="type" :rules="[{ required: true, message: '请选择活动类型' }]">
              <a-select v-model="form.type" placeholder="请选择">
                <a-select-option value="校运会">校运会</a-select-option>
                <a-select-option value="志愿活动">志愿活动</a-select-option>
                <a-select-option value="学术讲座">学术讲座</a-select-option>
                <a-select-option value="文艺晚会">文艺晚会</a-select-option>
                <a-select-option value="社团活动">社团活动</a-select-option>
                <a-select-option value="竞赛">竞赛</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="主办方" name="organizer" :rules="[{ required: true, message: '请输入主办方' }]">
              <a-input v-model="form.organizer" placeholder="如：大数据学院团委" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属学院" name="college" :rules="[{ required: true, message: '请选择学院' }]">
              <a-select v-model="form.college" placeholder="请选择">
                <a-select-option value="大数据学院">大数据学院</a-select-option>
                <a-select-option value="电气学院">电气学院</a-select-option>
                <a-select-option value="机械学院">机械学院</a-select-option>
                <a-select-option value="经管学院">经管学院</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="活动时间" name="activityTime" :rules="[{ required: true, message: '请选择活动时间' }]">
              <a-date-picker 
                v-model="form.activityTime" 
                show-time
                placeholder="选择活动时间"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="活动地点" name="location" :rules="[{ required: true, message: '请输入活动地点' }]">
              <a-input v-model="form.location" placeholder="如：学校操场" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="人数上限" name="maxParticipants" :rules="[{ required: true, message: '请输入人数上限' }]">
              <a-input-number v-model:value="form.maxParticipants" :min="1" :max="10000" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="报名开始时间" name="registrationStartTime">
              <a-date-picker 
                v-model="form.registrationStartTime" 
                show-time
                placeholder="可选"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="报名截止" name="registrationEndTime">
              <a-date-picker 
                v-model="form.registrationEndTime" 
                show-time
                placeholder="可选"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="参与对象" name="targetAudience">
          <a-select v-model="form.targetAudience" placeholder="请选择">
            <a-select-option value="全校">全校</a-select-option>
            <a-select-option value="全院">全院</a-select-option>
            <a-select-option value="指定班级">指定班级</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="活动描述" name="description">
          <a-textarea v-model="form.description" :rows="4" placeholder="活动详细介绍" />
        </a-form-item>
        
        <a-divider orientation="left">奖励设置</a-divider>
        
        <a-form-item label="奖励类型">
          <a-checkbox-group v-model="form.awardSettings">
            <a-checkbox value="计入综测">计入综测</a-checkbox>
            <a-checkbox value="可获奖项">可获奖项</a-checkbox>
            <a-checkbox value="同步到档案">同步到档案</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        
        <a-row :gutter="16" v-if="form.awardSettings.includes('计入综测')">
          <a-col :span="12">
            <a-form-item label="综测加分">
              <a-input-number v-model="form.comprehensiveScore" :min="0" :max="100" addon-after="分" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16" v-if="form.awardSettings.includes('可获奖项')">
          <a-col :span="12">
            <a-form-item label="奖项等级">
              <a-select v-model="form.awardLevel" placeholder="请选择">
                <a-select-option value="一等奖">一等奖</a-select-option>
                <a-select-option value="二等奖">二等奖</a-select-option>
                <a-select-option value="三等奖">三等奖</a-select-option>
                <a-select-option value="优秀奖">优秀奖</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item>
          <a-button type="primary" @click="handleSubmit" :loading="loading">
            <template #icon><plus-outlined /></template>
            立即发布
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';

export default {
  name: 'ActivityPublish',
  components: { PlusOutlined },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        type: '',
        organizer: '',
        college: '',
        activityTime: null,
        location: '',
        maxParticipants: null,
        registrationStartTime: null,
        registrationEndTime: null,
        targetAudience: '全校',
        description: '',
        awardSettings: [],
        comprehensiveScore: null,
        awardLevel: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$message.success('活动发布成功！');
        this.resetForm();
      }, 1000);
    },
    resetForm() {
      this.form = {
        name: '', type: '', organizer: '', college: '',
        activityTime: null, location: '', maxParticipants: null,
        registrationStartTime: null, registrationEndTime: null,
        targetAudience: '全校', description: '',
        awardSettings: [], comprehensiveScore: null, awardLevel: ''
      };
    }
  }
};
</script>

<style scoped>
.activity-publish { padding: 20px; }
</style>
