<template>
  <div>
    <div
      class="fixed-chatbot-icon"
      @click="showChatbot = !showChatbot"
      title="Open Chatbot"
      tabindex="0"
      role="button"
      aria-label="Open chatbot"
    >
      <img src="/images/Avatar.png" alt="AI" class="full-width sm:w-8 sm:h-8 rounded-full">
    </div>
    <div v-if="showChatbot" class="fixed-chatbot-popup">
      <chatbot @close="showChatbot = false" />
      <button class="close-btn" @click="showChatbot = false" aria-label="Close chatbot">&times;</button>
    </div>
  </div>
</template>

<script>
import chatbot from './chatbot.vue'
export default {
  name: 'chatbotIcon',
  components: { chatbot },
  props: {
    icon: {
      type: String,
      default: 'chatbot',
    },
  },
  data() {
    return {
      showChatbot: false
    }
  }
};
</script>

<style scoped>
.full-width {
  width: 100%;
  height: 100%;
}
.fixed-chatbot-icon {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1000;
  background: #7c6bb0;
  color: #fff;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  cursor: pointer;
  font-size: 2rem;
  transition: background 0.2s;
}
.fixed-chatbot-icon:hover, .fixed-chatbot-icon:focus {
  background: #5a4a8c;
  outline: none;
}
.fixed-chatbot-popup {
  position: fixed;
  bottom: 80px;
  right: 45px;
  z-index: 1001;
  width: 500px;
  height: 500px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  border-radius: 1.5rem;
  overflow: scroll;
  background: #fff;
  padding: 0;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 18px;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #aaa;
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #7c6bb0;
}
@media (max-width: 640px) {
  .fixed-chatbot-icon {
    width: 44px;
    height: 44px;
    font-size: 1.4rem;
    bottom: 16px;
    right: 16px;
  }
  .fixed-chatbot-popup {
    width: 98vw;
    right: 1vw;
    bottom: 70px;
    border-radius: 1rem;
  }
}
</style>