<template>
  <div class="detail">
    <el-header class="detail-header">
      <div class="header-content">
        <div class="left">
          <el-button @back="goBack" :icon="ArrowLeft" link>返回</el-button>
          <h2>{{ layout?.name }}</h2>
          <div class="tags">
            <el-tag
              v-for="tag in layout?.tags"
              :key="tag"
              size="small"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        <div class="right">
          <el-button @click="copyCode(layout?.code)" :icon="CopyDocument">
            复制代码
          </el-button>
        </div>
      </div>
    </el-header>

    <el-main class="detail-main">
      <div class="editor-section">
        <el-card class="editor-card">
          <div ref="editorContainer" class="editor-container"></div>
        </el-card>
      </div>
      <div class="preview-section">
        <el-card class="preview-card">
          <preview-sandbox :code="editingCode || layout?.code" />
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import PreviewSandbox from "../components/PreviewSandbox.vue";
import * as monaco from "monaco-editor";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, CopyDocument } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import layoutsData from "../layouts/data/layouts.json";
import CenterLayout from "../layouts/components/CenterLayout.vue";
import HolyGrailLayout from "../layouts/components/HolyGrailLayout.vue";
import GridGallery from "../layouts/components/GridGallery.vue";

const route = useRoute();
const router = useRouter();

const componentMap = {
  CenterLayout,
  HolyGrailLayout,
  GridGallery,
};

const layout = computed(() => {
  const layoutData = layoutsData.layouts.find(
    (l) => l.id === Number(route.params.id)
  );
  return layoutData
    ? { ...layoutData, component: componentMap[layoutData.componentName] }
    : null;
});

const goBack = () => {
  router.back();
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

const editorContainer = ref(null);
let editor = null;
const editingCode = ref("");

// 编辑器初始化
onMounted(() => {
  if (editorContainer.value && layout.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: layout.value.code,
      language: "vue",
      theme: "vs",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      wordWrap: "on",
    });

    // 监听编辑器内容变化
    editor.onDidChangeModelContent(() => {
      editingCode.value = editor.getValue();
    });
  }
});

onUnmounted(() => {
  if (editor) {
    editor.dispose();
  }
});

// 监听布局数据变化，更新编辑器内容
watch(
  () => layout.value?.code,
  (newCode) => {
    if (editor && newCode) {
      editor.setValue(newCode);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $background-color;
}

.detail-header {
  background: #fff;
  border-bottom: 1px solid $border-color;
  padding: 0;
  height: 60px;
  line-height: 60px;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 $spacing-base;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  .left {
    display: flex;
    align-items: center;
    gap: $spacing-base;

    h2 {
      margin: 0;
      font-size: 18px;
    }
  }

  .tags {
    display: flex;
    gap: $spacing-small;
  }
}

.detail-main {
  flex: 1;
  padding: $spacing-large;
  display: flex;
  gap: $spacing-large;
  overflow: hidden;
}

.editor-section {
  flex: 1;
  min-width: 0;
}

.preview-section {
  flex: 1;
  min-width: 0;
}

.editor-card,
.preview-card {
  height: 100%;

  :deep(.el-card__body) {
    height: 100%;
    padding: 0;
  }
}

.editor-card {
  pre {
    height: 100%;
    margin: 0;
    padding: $spacing-base;
    background: #f5f7fa;
    overflow: auto;
  }
}

.editor-container {
  height: 100%;
  width: 100%;
}

.editor-card {
  :deep(.el-card__body) {
    height: 100%;
  }
}
</style>
