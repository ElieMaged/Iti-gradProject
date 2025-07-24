<template>
  <div id="chatbot-container" class="flex min-h-screen items-center justify-center px-2 sm:px-4 bg-[#fafbfc]">
    <div class="w-full max-w-2xl chatbot bg-white rounded-2xl shadow p-2 sm:p-8 flex flex-col h-[90vh] sm:h-[70vh] mt-4 sm:mt-8 border border-gray-100">
      <h2 class="text-xl sm:text-2xl font-bold text-secondary mb-4 sm:mb-6">AI Assistant</h2>
      <div id="chatWindow" class="flex-1 overflow-y-auto mb-4 sm:mb-6 flex flex-col gap-2 sm:gap-4 min-h-[200px]">
        <div class="chat-bubble ai flex items-start gap-2 sm:gap-3">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full">
          <span class="text-sm sm:text-base">Hello! I am your BoltFix assistant. How can I help you today?</span>
        </div>
        <div class="chat-bubble user flex items-start gap-2 sm:gap-3">
          <span class="text-sm sm:text-base">Hi, I need to book a plumber for tomorrow.</span>
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full">
        </div>
        <div class="chat-bubble ai flex items-start gap-2 sm:gap-3">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full">
          <span class="text-sm sm:text-base">Sure! Please provide your address and preferred time for the visit.</span>
        </div>
      </div>
      <form class="flex items-center gap-2 sm:gap-4 mt-2">
        <input type="text" class="flex-1 input-text rounded-full border border-gray-300 px-3 py-2 sm:px-4 sm:py-2 focus:outline-none focus:border-secondary text-sm sm:text-base" placeholder="Type your message...">
        <button type="submit" id="send-btn" class="bg-secondary text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold hover:bg-primary transition-colors text-base sm:text-base">
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chatbot',
};
</script>

<style scoped>
.dark #chatbot-container{
  background-color: var(--primary-bg) !important;

}
.chatbot {
  height: 500px;
  min-height: 200px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 20px !important;
  /* Hide scrollbar for Chrome, Safari and Opera */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  margin-bottom: 20px !important;
}
.dark .chatbot {
  background-color: var(--secondary-bg) !important;
}
.chatbot::-webkit-scrollbar {
  display: none;
}

.text-secondary {
  color: #7c6bb0;
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  font-family: 'Outfit', sans-serif !important;
}
.bg-secondary {
  background-color: #7c6bb0;
}
.hover\:bg-primary:hover {
  background-color: #ffd54f;
}
.focus\:border-secondary:focus {
  border-color: #7c6bb0;
}
.chat-bubble {
  max-width: 90%;
  padding: 0.7rem 1rem;
  border-radius: 1.25rem;
  margin-bottom: 0.3rem;
  font-size: 1rem;
  line-height: 1.5;
}
.bg-secondary {
  background-color: #7c6bb0 !important;
}
.text-secondary {
  color: #7c6bb0 !important;
}
#send-btn {
  border-radius: 20px !important;
}
.input-text {
  border-radius: 20px !important;
  border: 1px solid #7c6bb0 !important;
}
@media (min-width: 640px) {
  .chat-bubble {
    max-width: 70%;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
}
.chat-bubble.user {
  background: #7c6bb0;
  color: #fff;
  border-bottom-right-radius: 0.25rem;
  margin-left: auto;
}
.chat-bubble.ai {
  background: #ede7f6;
  color: #333;
  border-bottom-left-radius: 0.25rem;
  margin-right: auto;
}
</style>
