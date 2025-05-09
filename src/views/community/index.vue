<template>
  <div class="community-container">
    <h1>语言学习社区</h1>

    <div class="community-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="讨论区" name="discussions">
          <div class="community-section">
            <div class="section-header">
              <h2>热门讨论</h2>
              <el-button type="primary" @click="showNewPostDialog = true">发起讨论</el-button>
            </div>

            <div class="post-list">
              <div v-for="post in discussionPosts" :key="post.id" class="post-item">
                <div class="post-header">
                  <el-avatar :src="post.authorAvatar" />
                  <div class="post-info">
                    <h3 @click="viewPostDetails(post.id)">{{ post.title }}</h3>
                    <div class="post-meta">
                      <span>{{ post.author }}</span>
                      <span>{{ post.publishTime }}</span>
                      <span>{{ post.views }} 浏览</span>
                      <span>{{ post.replies }} 回复</span>
                    </div>
                  </div>
                </div>
                <div class="post-tags">
                  <el-tag v-for="tag in post.tags" :key="tag" size="small" class="post-tag">{{ tag }}</el-tag>
                </div>
              </div>
            </div>

            <div class="pagination">
              <el-pagination
                layout="prev, pager, next"
                :total="100"
                :page-size="10"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="学习伙伴" name="partners">
          <div class="community-section">
            <div class="section-header">
              <h2>寻找学习伙伴</h2>
              <el-input
                v-model="partnerSearch"
                placeholder="搜索学习伙伴"
                prefix-icon="el-icon-search"
                clearable
                style="width: 300px"
              />
            </div>

            <div class="partner-list">
              <div v-for="partner in learningPartners" :key="partner.id" class="partner-card">
                <el-avatar :size="64" :src="partner.avatar" />
                <h3>{{ partner.name }}</h3>
                <div class="partner-info">
                  <div>
                    <i class="el-icon-location"></i>
                    <span>{{ partner.location }}</span>
                  </div>
                  <div>
                    <i class="el-icon-star-on"></i>
                    <span>目标语言: {{ partner.targetLanguage }}</span>
                  </div>
                  <div>
                    <i class="el-icon-trophy"></i>
                    <span>学习天数: {{ partner.learningDays }}</span>
                  </div>
                </div>
                <div class="partner-tags">
                  <el-tag v-for="interest in partner.interests" :key="interest" size="small">{{ interest }}</el-tag>
                </div>
                <el-button type="primary">添加好友</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="学习资源" name="resources">
          <div class="community-section">
            <div class="section-header">
              <h2>共享学习资源</h2>
              <el-button type="primary" @click="showNewResourceDialog = true">分享资源</el-button>
            </div>

            <el-tabs v-model="resourceType" class="resource-tabs">
              <el-tab-pane label="视频" name="video">
                <div class="resource-list">
                  <div v-for="resource in videoResources" :key="resource.id" class="resource-card">
                    <div class="resource-thumbnail">
                      <img :src="resource.thumbnail" alt="资源缩略图" />
                    </div>
                    <div class="resource-content">
                      <h3>{{ resource.title }}</h3>
                      <p>{{ resource.description }}</p>
                      <div class="resource-meta">
                        <span>分享者: {{ resource.uploader }}</span>
                        <span>{{ resource.uploadTime }}</span>
                        <span>{{ resource.views }} 浏览</span>
                      </div>
                      <div class="resource-tags">
                        <el-tag v-for="tag in resource.tags" :key="tag" size="small">{{ tag }}</el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="文档" name="document">
                <div class="resource-list">
                  <div v-for="resource in documentResources" :key="resource.id" class="resource-card">
                    <div class="resource-thumbnail">
                      <el-icon :size="40"><Document /></el-icon>
                    </div>
                    <div class="resource-content">
                      <h3>{{ resource.title }}</h3>
                      <p>{{ resource.description }}</p>
                      <div class="resource-meta">
                        <span>分享者: {{ resource.uploader }}</span>
                        <span>{{ resource.uploadTime }}</span>
                        <span>{{ resource.downloads }} 下载</span>
                      </div>
                      <div class="resource-tags">
                        <el-tag v-for="tag in resource.tags" :key="tag" size="small">{{ tag }}</el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 发起讨论对话框 -->
    <el-dialog v-model="showNewPostDialog" title="发起讨论" width="50%">
      <el-form :model="newPostForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newPostForm.title" placeholder="请输入讨论标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="newPostForm.content" type="textarea" :rows="6" placeholder="请输入讨论内容" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="newPostForm.tags" multiple placeholder="请选择标签" style="width: 100%">
            <el-option v-for="tag in availableTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showNewPostDialog = false">取消</el-button>
          <el-button type="primary" @click="submitNewPost">发布</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分享资源对话框 -->
    <el-dialog v-model="showNewResourceDialog" title="分享资源" width="50%">
      <el-form :model="newResourceForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newResourceForm.title" placeholder="请输入资源标题" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="newResourceForm.type" placeholder="请选择资源类型" style="width: 100%">
            <el-option label="视频" value="video" />
            <el-option label="文档" value="document" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newResourceForm.description" type="textarea" :rows="4" placeholder="请输入资源描述" />
        </el-form-item>
        <el-form-item label="资源文件">
          <el-upload
            action="#"
            :auto-upload="false"
            :limit="1"
          >
            <el-button type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="newResourceForm.tags" multiple placeholder="请选择标签" style="width: 100%">
            <el-option v-for="tag in availableTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showNewResourceDialog = false">取消</el-button>
          <el-button type="primary" @click="submitNewResource">分享</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'

// 选项卡
const activeTab = ref('discussions')
const resourceType = ref('video')

// 搜索
const partnerSearch = ref('')

// 对话框
const showNewPostDialog = ref(false)
const showNewResourceDialog = ref(false)

// 表单数据
const newPostForm = ref({
  title: '',
  content: '',
  tags: []
})

const newResourceForm = ref({
  title: '',
  type: 'video',
  description: '',
  tags: []
})

// 标签选项
const availableTags = [
  '听力', '口语', '阅读', '语法', '词汇', '考试', '日常交流', '商务', '旅游', '文化'
]

// 讨论区帖子
const discussionPosts = ref([
  {
    id: 1,
    title: '如何有效提高英语口语流利度？',
    author: '学习达人',
    authorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2023-08-15',
    views: 320,
    replies: 25,
    tags: ['口语', '学习方法']
  },
  {
    id: 2,
    title: '分享我的英语学习心得和资源',
    author: '英语爱好者',
    authorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2023-08-14',
    views: 256,
    replies: 18,
    tags: ['学习资源', '经验分享']
  },
  {
    id: 3,
    title: '准备雅思考试，求备考建议',
    author: '考试党',
    authorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2023-08-12',
    views: 189,
    replies: 15,
    tags: ['雅思', '考试']
  }
])

// 学习伙伴
const learningPartners = ref([
  {
    id: 1,
    name: '小明',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    location: '上海',
    targetLanguage: '英语',
    learningDays: 120,
    interests: ['旅游', '音乐', '电影']
  },
  {
    id: 2,
    name: '小红',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    location: '北京',
    targetLanguage: '法语',
    learningDays: 90,
    interests: ['美食', '文学', '艺术']
  },
  {
    id: 3,
    name: '小李',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    location: '广州',
    targetLanguage: '西班牙语',
    learningDays: 60,
    interests: ['体育', '游戏', '科技']
  }
])

// 视频资源
const videoResources = ref([
  {
    id: 1,
    title: '英语口语实用技巧分享',
    description: '本视频分享了提高英语口语的10个实用技巧，包括发音练习、语调训练等内容。',
    thumbnail: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    uploader: '英语老师',
    uploadTime: '2023-08-10',
    views: 520,
    tags: ['口语', '技巧']
  },
  {
    id: 2,
    title: '英语听力训练系列 - 第一课',
    description: '系统性听力训练课程的第一课，帮助你循序渐进提高英语听力能力。',
    thumbnail: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    uploader: '听力专家',
    uploadTime: '2023-08-05',
    views: 430,
    tags: ['听力', '训练']
  }
])

// 文档资源
const documentResources = ref([
  {
    id: 1,
    title: '英语常用词汇大全',
    description: '收录了5000个英语常用词汇，分类整理，方便学习和记忆。',
    uploader: '词汇达人',
    uploadTime: '2023-08-08',
    downloads: 320,
    tags: ['词汇', '资料']
  },
  {
    id: 2,
    title: '英语语法全解析',
    description: '详细讲解英语语法要点，包含大量例句和练习题。',
    uploader: '语法专家',
    uploadTime: '2023-08-03',
    downloads: 280,
    tags: ['语法', '学习资料']
  }
])

// 方法
const handlePageChange = (page: number) => {
  console.log('当前页：', page)
  // 加载对应页的数据
}

const viewPostDetails = (id: number) => {
  console.log('查看帖子详情，ID：', id)
  // 跳转到帖子详情页
}

const submitNewPost = () => {
  console.log('提交新帖子：', newPostForm.value)
  // 提交新帖子逻辑
  showNewPostDialog.value = false
}

const submitNewResource = () => {
  console.log('提交新资源：', newResourceForm.value)
  // 提交新资源逻辑
  showNewResourceDialog.value = false
}
</script>

<style scoped>
.community-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.community-tabs {
  margin-top: 20px;
}

.community-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.post-list {
  margin-bottom: 20px;
}

.post-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.post-item:hover {
  background-color: #f9f9f9;
}

.post-header {
  display: flex;
  align-items: flex-start;
}

.post-info {
  margin-left: 15px;
  flex: 1;
}

.post-info h3 {
  margin: 0 0 5px;
  color: #333;
}

.post-info h3:hover {
  color: #409EFF;
}

.post-meta {
  font-size: 12px;
  color: #999;
}

.post-meta span {
  margin-right: 15px;
}

.post-tags {
  margin-top: 10px;
}

.post-tag {
  margin-right: 5px;
}

.partner-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.partner-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.partner-info {
  margin: 15px 0;
  width: 100%;
  text-align: left;
}

.partner-info div {
  margin-bottom: 5px;
}

.partner-tags {
  margin: 10px 0 15px;
}

.partner-tags .el-tag {
  margin: 0 5px 5px 0;
}

.resource-tabs {
  margin-top: 20px;
}

.resource-list {
  margin-top: 20px;
}

.resource-card {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.resource-thumbnail {
  width: 120px;
  height: 80px;
  overflow: hidden;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.resource-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-content {
  flex: 1;
}

.resource-content h3 {
  margin: 0 0 5px;
  color: #333;
}

.resource-content p {
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;
}

.resource-meta {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.resource-meta span {
  margin-right: 15px;
}

.resource-tags {
  margin-top: 5px;
}

.resource-tags .el-tag {
  margin-right: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 