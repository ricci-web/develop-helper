<template>
  <div class="preview-sandbox">
    <iframe
      ref="iframeRef"
      class="preview-iframe"
      sandbox="allow-scripts allow-same-origin"
      :srcdoc="sandboxTemplate"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
});

const iframeRef = ref(null);
const isIframeLoaded = ref(false);

const sandboxTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; }
  </style>
</head>
<body>
  <div id="app"></div>
</body>
</html>
`;

const updatePreview = () => {
  if (!iframeRef.value || !isIframeLoaded.value) return;

  try {
    const iframe = iframeRef.value;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    const templateMatch = props.code.match(/<template>([\s\S]*)<\/template>/);
    const styleMatch = props.code.match(/<style[^>]*>([\s\S]*)<\/style>/);

    // 重置内容
    const appDiv = iframeDoc.getElementById("app");
    if (!appDiv) return;

    if (templateMatch) {
      const template = templateMatch[1].trim();
      appDiv.innerHTML = template;
    }

    // 清理旧样式
    const oldStyle = iframeDoc.querySelector("#preview-style");
    if (oldStyle) {
      oldStyle.remove();
    }

    if (styleMatch) {
      const style = styleMatch[1].trim();
      const styleEl = iframeDoc.createElement("style");
      styleEl.id = "preview-style";
      styleEl.textContent = style;
      iframeDoc.head.appendChild(styleEl);
    }
  } catch (error) {
    console.error("Preview update failed:", error);
  }
};

const handleIframeLoad = () => {
  isIframeLoaded.value = true;
  updatePreview();
};

watch(
  () => props.code,
  () => {
    updatePreview();
  }
);
</script>

<style lang="scss" scoped>
.preview-sandbox {
  height: 100%;
  width: 100%;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
