<template>
  <div class="flex min-h-screen items-center justify-center px-2 sm:px-4 bg-[#fafbfc]">
    <div class="w-full max-w-2xl chatbot bg-white rounded-2xl shadow p-2 sm:p-8 flex flex-col h-[90vh] sm:h-[70vh] mt-4 sm:mt-8 border border-gray-100 relative">
      <h2 class="text-xl sm:text-2xl font-bold text-secondary mb-4 sm:mb-6">AI Assistant</h2>
      <div id="chatWindow" ref="chatWindow" class="flex-1 overflow-y-auto mb-4 sm:mb-6 flex flex-col gap-2 sm:gap-4 min-h-[200px]">
        <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-bubble', msg.sender, 'flex items-start gap-2 sm:gap-3']">
          <img v-if="msg.sender === 'ai'" src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
          <span class="text-sm sm:text-base" v-html="msg.text"></span>
          <img v-if="msg.sender === 'user'" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
        </div>
      </div>
      <form class="flex items-center gap-2 sm:gap-4 mt-2" @submit.prevent="sendMessage">
        <input type="text" class="flex-1 input-text rounded-full border border-gray-300 px-3 py-2 sm:px-4 sm:py-2 focus:outline-none focus:border-secondary text-sm sm:text-base" placeholder="Type your message..." v-model="input">
        <button type="submit" id="send-btn" class="bg-secondary text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold hover:bg-primary transition-colors text-base sm:text-base" :disabled="loading">
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>

import { db } from '../firebase.js'; // adjust the path as needed

export default {
  name: 'chatbot',
  data() {
    return {
      input: '',
      messages: [
        { sender: 'ai', text: 'Tell me about your problem' }
      ],
      loading: false,
      suggestedProfession: null,
      suggestedTechnicians: []
    }
  },
  methods: {
    async sendMessage() {
      const text = this.input.trim();
      if (!text) return;
      this.messages.push({ sender: 'user', text });
      this.input = '';
      this.loading = true;

      // Step 1: Ask OpenAI for the profession
      try {
        const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fw_3ZTPt67uoDD6Ly8YYZkNDBkW'
          },
          body: JSON.stringify({
            model: 'accounts/fireworks/models/deepseek-v3',
            messages: [
              { role: 'system', content: 'You are a helpful assistant for a home services app. Given a user problem, reply ONLY with the profession needed (e.g., "wall finishing", "plumber", "electrician").' },
              { role: 'user', content: text }
            ]
          })
        });
        const data = await response.json();
        console.log('AI API response:', data);

        if (data.error) {
          this.messages.push({ sender: 'ai', text: 'Sorry, there was an error connecting to the AI: ' + data.error.message });
          this.loading = false;
          return;
        }

        const aiProfession = data.choices?.[0]?.message?.content?.toLowerCase().trim();
        const profession = this.normalizeProfession(aiProfession);

        if (!profession) {
          this.messages.push({ sender: 'ai', text: `Sorry, I couldn't match your problem to a technician category. Please try describing your problem differently.` });
          this.loading = false;
          return;
        }

        this.suggestedProfession = profession;
        this.messages.push({ sender: 'ai', text: `You need a ${profession} technician. Here are some suggestions:` });
        await this.fetchTechnicians(profession);
      } catch (e) {
        this.messages.push({ sender: 'ai', text: 'Sorry, there was an error connecting to the AI.' });
      }
      this.loading = false;
      this.scrollToBottom();
    },
    async fetchTechnicians(profession) {
      try {
        const querySnapshot = await db.collection('technicians').where('profession', '==', profession).get();
        this.suggestedTechnicians = [];
        querySnapshot.forEach(doc => {
          this.suggestedTechnicians.push(doc.data());
        });
        if (this.suggestedTechnicians.length > 0) {
          this.messages.push({
            sender: 'ai',
            text: 'Suggested technicians:<br>' + this.suggestedTechnicians.map(t => t.name + ' - ' + t.phone).join('<br>')
          });
        } else {
          this.messages.push({ sender: 'ai', text: 'Sorry, no technicians found for this profession.' });
        }
        this.scrollToBottom();
      } catch (e) {
        console.error('Firebase error:', e);
        this.messages.push({ sender: 'ai', text: 'Sorry, there was an error connecting to the technician database.' });
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatWindow = this.$refs.chatWindow;
        if (chatWindow) {
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }
      });
    },
    normalizeProfession(aiProfession) {
      const PROFESSION_MAP = {
        'hvac': 'air conditioner',
        'hvac technician': 'air conditioner',
        'air conditioning': 'air conditioner ',
        'ac technician': 'air conditioner ',
        'wall finishing': 'wall finishing',
        'plumber': 'plumber',
        'plumbing': 'plumber',
        'electrician': 'electrician',
        'painter': 'painter',
        'painting': 'painter',
        'carpenter': 'carpenter',
        'carpentry': 'carpenter',
        'mason': 'mason',
        'masonry': 'mason',
        // Add more synonyms as needed
      };
      if (!aiProfession) return null;
      const key = aiProfession.toLowerCase().trim();
      return PROFESSION_MAP[key] || null;
    }
  }
}
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
