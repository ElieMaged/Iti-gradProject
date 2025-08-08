<template>
  <div class="chatbot bg-white rounded-2xl shadow border border-gray-100 relative" style="margin:0;">

    <div class="flex items-center gap-3 my-2">
      <img src="/images/Avatar.png" alt="AI" class="w-16 h-16 rounded-full" />
      <h2 class="text-xl font-bold text-secondary mb-2 mt-20">AI Assistant</h2>
    </div>

    <div id="chatWindow" ref="chatWindow" class="flex flex-col gap-2 min-h-[20px]" style="margin-top:0;">
      <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-bubble', msg.sender, 'flex items-start gap-2']">
        <img v-if="msg.sender === 'ai'" src="/images/Avatar.png" alt="AI" class="w-7 h-7 rounded-full" />
        <span class="text-sm" v-html="msg.text"></span>
        <img v-if="msg.sender === 'user'" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User"
          class="w-7 h-7 rounded-full" />
      </div>
    </div>
    <form class="flex items-center gap-2 mt-2" @submit.prevent="sendMessage">
      <input type="text"
        class="flex-1 input-text rounded-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-secondary text-sm"
        placeholder="Type your message..." v-model="input">
      <button type="submit" id="send-btn"
        class="bg-secondary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary transition-colors text-base"
        :disabled="loading">
        <i class="fas fa-paper-plane"></i>
      </button>
    </form>
  </div>
</template>

<script>

import { db } from '../firebase.js';
import { collection, getDocs, where, query, or } from 'firebase/firestore';

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
      // Removed suggestedStockTechnicians - no stock technicians
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
              { role: 'system', content: 'You are a helpful assistant for a home services app. Given a user problem, reply ONLY with a JSON object containing the needed profession (e.g., "wall finishing", "plumber", "electrician") and the location (e.g., "Cairo", "Giza", "Alexandria").' },
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

        let aiContent = data.choices?.[0]?.message?.content?.trim();
        let aiJson = {};
        try {
          if (aiContent.startsWith('```json') && aiContent.endsWith('```')) {
            aiContent = aiContent.slice(7, -3).trim(); // Remove ```json and ```
          }
          aiJson = JSON.parse(aiContent);
        } catch (e) {
          console.error(e);
        }
        const profession = this.normalizeProfession(aiJson.profession);
        const location = aiJson.location ? aiJson.location.trim() : null;

        if (!profession && !location) {
          this.messages.push({ sender: 'ai', text: `Sorry, I couldn't match your problem to a technician category. Please try describing your problem differently.` });
          this.loading = false;
          return;
        }

        this.suggestedProfession = profession;
        await this.fetchTechnicians(profession, location);
      } catch (e) {
        this.messages.push({ sender: 'ai', text: 'Sorry, there was an error connecting to the AI.' });
      }
      this.loading = false;
      this.scrollToBottom();
    },
    async fetchTechnicians(profession, location) {
      let registered = [];
      try {
        const techniciansCollection = collection(db, 'technicians');
        let queryRef = query(
          techniciansCollection,
          where('status', '==', 'approved')
        );

        if (profession && profession !== 'unknown') {
          queryRef = query(queryRef, where('specialization', '==', profession));
        }

        if (location && location !== 'unknown') {
          queryRef = query(
            queryRef,
            or(
              where('government', '==', location),
              where('district', '==', location)
            )
          );
        }

        const querySnapshot = await getDocs(queryRef);

        registered = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          registered.push({
            id: doc.id,
            name: data.fullName || data.name || 'Unknown Technician',
            rating: data.averageRating || 0,
            specialization: data.specialization || 'General Technician',
            experience: data.experience || data.yearsOfExperience ? `${data.yearsOfExperience || data.experience}+ years` : '0+ years',
            basePrice: data.basePrice,
            status: data.status,
            location: data.government + ' - ' + data.district,
            phone: data.phone,
            email: data.email
          });
        });

        registered = registered.sort((a, b) => (a.experience || 0) - (b.experience || 0));
      } catch (e) {
        console.error('Firebase error:', e);
        this.messages.push({ sender: 'ai', text: 'Sorry, there was an error connecting to the technician database.' });
      }
      // No stock technicians - only show registered technicians
      this.suggestedTechnicians = registered;
      let msg = '';
      if (registered.length > 0) {
        this.messages.push({ sender: 'ai', text: `You need a ${profession ? profession : 'technician'}. Here are some suggestions:` });

        msg += '<b>Registered Technicians:</b><br>' +
          registered.map(t =>
            `<div style="margin-bottom: 8px;">
      <b>Name:</b> ${t.name}<br>
      <b>Phone:</b> ${t.phone || 'N/A'}<br>
      <b>Email:</b> ${t.email || 'N/A'}<br>
      <b>Specialization:</b> ${t.specialization || 'N/A'}<br>
      <b>Rating:</b> ${t.rating ? t.rating + '/5' : 'No ratings yet'}<br>
      <b>Location:</b> ${t.location || 'N/A'}<br>
      <b>Base Price:</b> ${t.basePrice || 'N/A'}<br>
      <b>Experience:</b> ${t.experience || 'N/A'}<br>
      <button onclick="window.open('/technician/${t.id}', '_blank', 'noopener')" style="border-radius: 2vw;" class="bg-[#7c6bb0] text-white my-2 px-3 py-2 font-semibold hover:bg-primary transition-colors text-base">View Profile</button>
    </div>`
          ).join('') + '<br>';
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
        'hvac': 'Air Conditioning',
        'hvac technician': 'Air Conditioning',
        'air conditioning': 'Air Conditioning',
        'ac technician': 'Air Conditioning',
        'wall finishing': 'Wall Finishing',
        'plumber': 'Plumbing',
        'plumbing': 'Plumbing',
        'electrician': 'Electrical',
        'electrical': 'Electrical',
        'electrical': 'Electrical Appliances',
        'electrician': 'Electrical Appliances',
        'painter': 'Painting',
        'painting': 'Painting',
        'carpenter': 'Carpentry',
        'carpentry': 'Carpentry',
        'mason': 'Masonry',
        'masonry': 'Masonry',
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
.dark #chatbot-container {
  background-color: var(--primary-bg) !important;

}

.chatbot {
  /* Double the height of the chat window */
  padding: 1rem;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1000px;
  min-height: 450px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  overflow: scroll;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#chatWindow {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow: auto;
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
