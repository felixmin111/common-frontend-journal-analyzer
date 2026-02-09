<template>
  <footer class="footer">
    <div class="inner">
      <div class="left">
        <div class="miniTitle">Journaling Analyzer</div>
        <div class="hint">Private • Simple • Reflective</div>
      </div>

      <div class="links">
        <a href="#" class="link" @click.prevent>About</a>
        <a href="#" class="link" @click.prevent>Privacy</a>
        <a href="#" class="link" @click.prevent>Support</a>
      </div>

      <div class="right">
        <span class="statusDot" />
        <span class="statusText">All changes saved</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer {
  border-top: 1px solid rgba(229, 231, 235, 0.9);
  background: linear-gradient(180deg, #ffffff, #fafafa);
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

.left .miniTitle {
  font-weight: 900;
  color: #111827;
  letter-spacing: 0.2px;
}
.left .hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* Links */
.links {
  display: flex;
  gap: 14px;
  justify-content: center;
}
.link {
  text-decoration: none;
  font-weight: 700;
  font-size: 13px;
  color: #374151;
  padding: 8px 10px;
  border-radius: 10px;
  transition: background 0.12s ease;
}
.link:hover {
  background: rgba(17, 24, 39, 0.06);
}

/* Status */
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
  background: #16a34a;
  box-shadow: 0 0 0 6px rgba(22, 163, 74, 0.12);
}
.statusText {
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 900px) {
  .inner {
    grid-template-columns: 1fr;
    text-align: left;
  }
  .links {
    justify-content: flex-start;
  }
  .right {
    justify-content: flex-start;
  }
}
</style>
