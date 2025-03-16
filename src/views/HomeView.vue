<template>
  <div class="home">
    <el-header :class="['header', { 'header-top': isSearchActive }]">
      <div :class="['search-container', { 'search-active': isSearchActive }]">
        <el-input
          v-model="searchQuery"
          placeholder="搜索布局..."
          :prefix-icon="Search"
          clearable
          class="search-input"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        />
        <div class="filter-buttons">
          <el-tag
            v-for="tag in tags"
            :key="tag"
            :type="selectedTags.includes(tag) ? 'primary' : 'info'"
            class="filter-tag"
            :effect="selectedTags.includes(tag) ? 'light' : 'plain'"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </el-header>

    <el-main :class="['main-container', { 'main-active': isSearchActive }]">
      <div class="layout-container">
        <el-row :gutter="20" class="layout-grid">
          <el-col
            v-for="layout in filteredLayouts"
            :key="layout.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <el-card class="layout-card" :body-style="{ padding: '0px' }">
              <div class="layout-preview">
                <component :is="layout.component" />
              </div>
              <div class="layout-info">
                <h3>{{ layout.name }}</h3>
                <div class="layout-tags">
                  <el-tag
                    v-for="tag in layout.tags"
                    :key="tag"
                    size="small"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <div class="layout-actions">
                  <el-button
                    type="primary"
                    @click="viewDetail(layout.id)"
                    :icon="View"
                  >
                    查看详情
                  </el-button>
                  <el-button
                    @click="copyCode(layout.code)"
                    :icon="CopyDocument"
                  >
                    复制代码
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>

    <!-- <el-footer class="footer">
      <p>© 2024 Layout Helper. All rights reserved.</p>
    </el-footer> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Search, View, CopyDocument } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import layoutsData from "../layouts/data/layouts.json";

// 导入所有布局组件
import CenterLayout from "../layouts/components/CenterLayout.vue";
import HolyGrailLayout from "../layouts/components/HolyGrailLayout.vue";
import GridGallery from "../layouts/components/GridGallery.vue";

const componentMap = {
  CenterLayout,
  HolyGrailLayout,
  GridGallery,
};

const router = useRouter();
const searchQuery = ref("");
const selectedTags = ref([]);

const tags = ["Flex", "Grid", "响应式", "居中对齐", "导航栏"];

// 处理布局数据
const layouts = ref(
  layoutsData.layouts.map((layout) => ({
    ...layout,
    component: componentMap[layout.componentName],
  }))
);

const filteredLayouts = computed(() => {
  return layouts.value.filter((layout) => {
    const matchesSearch = layout.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesTags =
      selectedTags.value.length === 0 ||
      selectedTags.value.every((tag) => layout.tags.includes(tag));
    return matchesSearch && matchesTags;
  });
});

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

const viewDetail = (id) => {
  router.push(`/detail/${id}`);
};

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code);
    ElMessage.success("代码已复制到剪贴板！");
  } catch (err) {
    ElMessage.error("复制失败");
    console.error("复制失败：", err);
  }
};

const isScrolled = ref(false);
const isSearchFocused = ref(false);

// 监听滚动
const handleScroll = () => {
  const scrollTop = window.scrollY;
  isScrolled.value = scrollTop > 0;

  // 如果滚动到顶部，检查是否需要恢复初始态
  if (
    scrollTop === 0 &&
    !isSearchFocused.value &&
    !searchQuery.value &&
    selectedTags.value.length === 0
  ) {
    isScrolled.value = false;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const isSearchActive = computed(() => {
  return true;
  return (
    isScrolled.value ||
    isSearchFocused.value ||
    searchQuery.value.length > 0 ||
    selectedTags.value.length > 0
  );
});

const handleSearchFocus = () => {
  isSearchFocused.value = true;
};

const handleSearchBlur = () => {
  isSearchFocused.value = false;
};
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $background-color;
}

.header {
  background: transparent;
  box-shadow: none;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  top: 0;
  z-index: 100;

  &.header-top {
    height: auto;
    padding: 20px 0;
    // background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    // box-shadow: $box-shadow;
    justify-content: flex-start;
    position: sticky;
  }
}

.search-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: $spacing-base;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-container {
  // display: none;
  // opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.main-active {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }
}

.main-container {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.3;
  transform: translateY(20px);
  pointer-events: none;

  &.main-active {
    margin-top: 0;
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-large $spacing-base;
  .layout-grid {
    padding: 0;
  }
}

.layout-grid {
  // 移除之前的 max-width 和 margin
  padding: 0;
}

.search-input {
  margin-bottom: $spacing-base;
  :deep(.el-input__wrapper) {
    box-shadow: none;
    border: 1px solid $border-color;
    padding: 12px 20px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      border-color: $primary-color;
    }
  }
}

.main-active {
  padding-top: 0;
}

.filter-buttons {
  display: flex;
  gap: $spacing-small;
  flex-wrap: wrap;
}

.filter-tag {
  cursor: pointer;
  margin: $spacing-mini;

  &:hover {
    opacity: 0.8;
  }
}

.layout-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-large 0;
}

.layout-card {
  margin-bottom: $spacing-large;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
}

.layout-preview {
  height: 200px;
  overflow: auto;
  background: $background-color;
  border-bottom: 1px solid $border-color;
}

.layout-info {
  padding: $spacing-base;

  h3 {
    margin-bottom: $spacing-small;
    color: $text-primary;
  }
}

.layout-tags {
  display: flex;
  gap: $spacing-small;
  margin: $spacing-small 0;
  flex-wrap: wrap;
}

.layout-actions {
  display: flex;
  gap: $spacing-small;
  margin-top: $spacing-base;
}
</style>
