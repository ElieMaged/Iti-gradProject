<template>
  <div class="chatbot bg-white rounded-2xl shadow border border-gray-100 relative" style="margin:0;">
    <!-- Fixed AI image at top left -->
    <div class="fixed-ai-image">
      <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI" class="w-16 h-16 rounded-full" />
    </div>
    <h2 class="text-xl font-bold text-secondary mb-2 mt-20">AI Assistant</h2>
    <div id="chatWindow" ref="chatWindow" class="flex flex-col gap-2 min-h-[20px]" style="margin-top:0;">
      <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-bubble', msg.sender, 'flex items-start gap-2']">
        <img v-if="msg.sender === 'ai'" src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI" class="w-7 h-7 rounded-full" />
        <span class="text-sm" v-html="msg.text"></span>
        <img v-if="msg.sender === 'user'" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User" class="w-7 h-7 rounded-full" />
      </div>
    </div>
    <form class="flex items-center gap-2 mt-2" @submit.prevent="sendMessage">
      <input type="text" class="flex-1 input-text rounded-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-secondary text-sm" placeholder="Type your message..." v-model="input">
      <button type="submit" id="send-btn" class="bg-secondary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary transition-colors text-base" :disabled="loading">
        <i class="fas fa-paper-plane"></i>
      </button>
    </form>
  </div>
</template>

<script>

import { db } from '../firebase.js'; // adjust the path as needed
import { stockTechnicians } from '../assets/stockTechnicians.js';

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
      suggestedTechnicians: [],
      suggestedStockTechnicians: []
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
      // Fetch registered technicians from Firestore
      let registered = [];
      try {
        const querySnapshot = await db.collection('technicians').where('profession', '==', profession).get();
        registered = [];
        querySnapshot.forEach(doc => {
          registered.push(doc.data());
        });
      } catch (e) {
        console.error('Firebase error:', e);
        this.messages.push({ sender: 'ai', text: 'Sorry, there was an error connecting to the technician database.' });
      }
      // Filter stock technicians by profession
      const stock = stockTechnicians.filter(t => {
        // Normalize profession for stock technicians (assume a 'profession' field or use skills/description)
        if (t.profession) {
          return t.profession.toLowerCase() === profession;
        }
        // Fallback: try to match profession in description or skills
        if (t.skills && t.skills.some(skill => skill.toLowerCase().includes(profession))) {
          return true;
        }
        if (t.description && t.description.toLowerCase().includes(profession)) {
          return true;
        }
        return false;
      });
      this.suggestedTechnicians = registered;
      this.suggestedStockTechnicians = stock;
      // Compose message
      let msg = '';
      if (registered.length > 0) {
        msg += '<b>Registered Technicians:</b><br>' + registered.map(t => `${t.name} - ${t.phone || ''}`).join('<br>') + '<br>';
      }
      if (stock.length > 0) {
        msg += '<b>Stock Technicians:</b><br>' + stock.map(t => `${t.name} - ${t.phone || ''}`).join('<br>');
      }
      if (!msg) {
        msg = 'Sorry, no technicians found for this profession.';
      }
      this.messages.push({ sender: 'ai', text: msg });
      this.scrollToBottom();
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
  /* Double the height of the chat window */
  padding: 0 !important;
  margin: 0 !important;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 1000px;
  min-height: 450px;
  max-height: 450px;
  display: flex;
  flex-direction: column;
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
.fixed-ai-image {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#chatWindow {
  margin-top: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
