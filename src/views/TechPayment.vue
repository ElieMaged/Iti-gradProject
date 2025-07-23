<template>
  <div class="main-content">
    <Sidebar
            :activeMenu="activeMenu"
            @navigate="handleSidebarNavigate"
        />
    <div class="payment-content">
      <h1 class="payment-title">Payment</h1>
      <div class="payment-balance-card">
        <div class="balance-labels">
          <span class="current-balance-label">Current Balance</span>
          <span class="pending-label">Pending</span>
        </div>
        <div class="balance-amounts">
          <span class="current-balance-amount">600 EGP</span>
          <span class="pending-amount">200 EGP</span>
        </div>
      </div>
      <div class="payment-method-card">
        <div class="payment-method-header">
          <span class="payment-method-title">Your Payment Method</span>
          <button class="edit-btn">Edit</button>
        </div>
        <div class="payment-method-type">Paypal</div>
        <div class="payment-method-email">exampletech@gmail.com</div>
      </div>
      <div class="withdraw-card">
        <div class="withdraw-title">Withdraw Funds</div>
        <form class="withdraw-form">
          <div class="withdraw-fields">
            <div class="withdraw-field">
              <label>Amount</label>
              <input type="number" placeholder="Enter amount" />
            </div>
            <div class="withdraw-field">
              <label>Paypal email</label>
              <input type="email" placeholder="example email" />
            </div>
          </div>
          <button class="withdraw-btn" type="submit">Withdraw</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';


export default {
  components: {
    Sidebar
  },
  data() {
    return {
      activeMenu: 'Techpayment',
    }
  },
  methods: {
    handleSidebarNavigate(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.main-content {
  display: flex;
  min-height: 100vh;
}
.payment-content {
  flex: 1;
  padding: 32px 0 0 0;
}
.payment-page {
  background: #f5f5f7;
  min-height: 100vh;
  padding: 32px 0 0 0;
}
.payment-title {
  color: #625397;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  font-family: Outfit, sans-serif;
  margin-left: 48px;
}
.payment-balance-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 40px 24px 40px;
  margin: 0 0 32px 48px;
  max-width: 900px;
}
.balance-labels {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.current-balance-label {
  color: #625397;
  font-size: 2rem;
  font-weight: bold;
  padding-right: 20px;
}
.pending-label {
  color: #222;
  font-size: 2rem;
  font-weight: bold;
  padding-right: 20px;
}
.balance-amounts {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.current-balance-amount {
  font-size: 2rem;
  font-weight: bold;
}
.pending-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: grey;
  align-self: center;
  padding-right: 20px;
}
.payment-method-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 28px 40px 24px 40px;
  margin: 0 0 32px 48px;
  max-width: 900px;
}
.payment-method-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.payment-method-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
}
.edit-btn {
  background: #948AB8;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 6px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-btn:hover {
  background: #625397;
}
.payment-method-type {
  color: #948AB8;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 2px;
}
.payment-method-email {
  color: #222;
  font-size: 1.1rem;
}
.withdraw-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 28px 40px 24px 40px;
  margin: 0 0 32px 48px;
  max-width: 900px;
}
.withdraw-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 18px;
}
.withdraw-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.withdraw-fields {
  display: flex;
  gap: 18px;
  margin-bottom: 10px;
}
.withdraw-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.withdraw-field label {
  font-size: 1rem;
  color: #222;
  font-weight: 500;
}
.withdraw-field input {
  border: none;
  background: #ececec;
  border-radius: 25px;
  padding: 10px 18px;
  font-size: 1rem;
  color: #222;
  outline: none;
}
.withdraw-btn {
  background: #625397;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 10px 38px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.2s;
}
.withdraw-btn:hover {
  background: #948AB8;
}
@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }
  .sidebar {
    width: 100% !important;
    max-height: 220px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem 0 !important;
    margin-bottom: 1rem;
  }
  .payment-content {
    padding: 16px 0 0 0;
  }
  .payment-balance-card,
  .payment-method-card,
  .withdraw-card {
    margin: 0 0 24px 0;
    max-width: 100%;
    padding: 24px 16px 18px 16px;
  }
  .payment-title {
    margin-left: 0;
  }
}
@media (max-width: 768px) {
  .payment-content {
    padding: 1rem 0 0 0;
  }
  .payment-title {
    font-size: 1.2rem;
    margin-left: 0;
    margin-bottom: 1rem;
  }
  .payment-balance-card,
  .payment-method-card,
  .withdraw-card {
    padding: 12px 6px 10px 6px;
    border-radius: 12px;
  }
  .withdraw-btn {
    padding: 8px 18px;
    font-size: 1rem;
  }
  .edit-btn {
    padding: 4px 12px;
    font-size: 0.95rem;
  }
  .current-balance-label,
  .pending-label {
    font-size: 1.1rem;
    padding-right: 8px;
  }
  .current-balance-amount,
  .pending-amount {
    font-size: 1.1rem;
    padding-right: 8px;
  }
}
@media (max-width: 600px) {
  .payment-content {
    padding: 8px 0 0 0;
  }
  .payment-title {
    font-size: 1rem;
    margin-left: 0;
    margin-bottom: 0.5rem;
  }
  .payment-balance-card,
  .payment-method-card,
  .withdraw-card {
    padding: 8px 2px 6px 2px;
    border-radius: 10px;
  }
  .withdraw-btn {
    padding: 6px 12px;
    font-size: 0.95rem;
  }
  .edit-btn {
    padding: 3px 8px;
    font-size: 0.9rem;
  }
  .current-balance-label,
  .pending-label {
    font-size: 1rem;
    padding-right: 4px;
  }
  .current-balance-amount,
  .pending-amount {
    font-size: 1rem;
    padding-right: 4px;
  }
}
.payment-balance-card,
.payment-method-card,
.withdraw-card {
  transition: box-shadow 0.2s, border 0.2s;
  border: 1.5px solid #ececec;
}
.payment-balance-card:hover,
.payment-method-card:hover,
.withdraw-card:hover {
  box-shadow: 0 4px 16px rgba(98,83,151,0.10);
  border: 1.5px solid #948AB8;
}
.payment-balance-card:not(:last-child),
.payment-method-card:not(:last-child),
.withdraw-card:not(:last-child) {
  border-bottom: 1px solid #ececec;
}
.withdraw-field input:focus {
  border: 1.5px solid #948AB8;
  background: #f5f5fa;
}
.edit-btn:focus,
.withdraw-btn:focus {
  outline: 2px solid #948AB8;
}
</style> 