<template>
  <footer class="footer">
    <div class="inner">
      <div class="left">
        <div class="miniTitle">Journaling Analyzer</div>
        <div class="hint">A calm place for your thoughts.</div>
      </div>

      <div class="links">
        <a href="#" class="link" @click.prevent>About</a>
        <a href="#" class="link" @click.prevent>Privacy</a>
        <a href="#" class="link" @click.prevent>Support</a>
      </div>

      <div class="right">
        <span class="statusDot"></span>
        <span class="statusText">Saved</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer {
  border-top: 1px solid #eef2f7;
  background: #ffffff;
}

.inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: center;
}

.miniTitle {
  font-weight: 900;
  color: #1f2937;
}
.hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.links {
  display: flex;
  gap: 14px;
  justify-content: center;
}
.link {
  text-decoration: none;
  font-weight: 800;
  font-size: 13px;
  color: #4b5563;
  padding: 8px 10px;
  border-radius: 10px;
}
.link:hover {
  background: #f3f4f6;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}
.statusDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.12);
}
.statusText {
  font-size: 12px;
  color: #6b7280;
  font-weight: 800;
}

@media (max-width: 900px) {
  .inner {
    grid-template-columns: 1fr;
  }
  .links {
    justify-content: flex-start;
  }
  .right {
    justify-content: flex-start;
  }
}
</style>
