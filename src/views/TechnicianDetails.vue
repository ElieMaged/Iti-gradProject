<template>
    <div>
        <div class="max-w-4xl mx-auto px-4 py-10">
        <h1 class="text-3xl font-bold text-secondary mb-8 text-center">Complete Your Booking</h1>
        <div class="bg-white rounded-2xl border border-gray-300 p-6 md:p-12 shadow-lg">
            <!-- Steps -->
            <div class="flex justify-between items-center mb-8">
                <div class="flex-1 flex flex-col items-center">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full step-active font-bold mb-1">1</div>
                    <div class="text-xs font-semibold text-secondary">Details&Payment</div>
                </div>
                <div class="w-1/4 h-1 bg-gray-200 mx-2"></div>
                <div class="flex-1 flex flex-col items-center">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full step-inactive font-bold mb-1">2</div>
                    <div class="text-xs font-semibold text-secondary">Confirmation</div>
                </div>
            </div>
            <!-- Technician and Booking Form -->
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Technician Info -->
                <div class="flex flex-col items-center md:items-start md:w-1/4">
                    <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Technician Photo" class="w-20 h-20 rounded-full object-cover border-4 border-secondary mb-2">
                    <div class="text-lg font-bold text-text-main">Ahmed Hassan</div>
                    <div class="text-base text-secondary font-semibold">Plumber</div>
                </div>
                <!-- Booking Form -->
                <form class="flex-1 space-y-6">
                    <!-- Available Slots -->
                    <div class="mb-6">
                        <label class="block text-sm font-bold text-text-main mb-1">Available Appointment</label>
                        <div class="flex items-center gap-2">
                            <button class="text-secondary text-xl px-2" type="button">&#60;</button>
                            <div class="bg-gray-100 rounded-lg px-4 py-2">
                                <div class="font-bold">Friday</div>
                                <div class="text-sm">01:00 PM - 11:00 PM</div>
                            </div>
                            <div class="bg-gray-100 rounded-lg px-4 py-2">
                                <div class="font-bold">Saturday</div>
                                <div class="text-sm">12:00 PM - 12:00 PM</div>
                            </div>
                            <div class="bg-gray-100 rounded-lg px-4 py-2">
                                <div class="font-bold">Sunday</div>
                                <div class="text-sm">12:00 PM - 12:00 PM</div>
                            </div>
                            <button class="text-secondary text-xl px-2" type="button">&#62;</button>
                        </div>
                    </div>
                    <!-- Your Details Section -->
                    <div class="mb-2">
                        <h3 class="text-lg font-bold text-text-main mb-4">Your Details</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Date</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>7/5/2025 Friday</option>
                                    <option>7/6/2025 Saturday</option>
                                    <option>7/7/2025 Sunday</option>
                                    <option>7/8/2025 Monday</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Time</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>03:00 PM</option>
                                    <option>04:00 PM</option>
                                    <option>05:00 PM</option>
                                    <option>06:00 PM</option>
                                    <option>07:00 PM</option>
                                    <option>08:00 PM</option>
                                    <option>09:00 PM</option>
                                    <option>10:00 PM</option>
                                    <option>11:00 PM</option>
                                    <option>12:00 PM</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Full Name</label>
                                <input type="text" class="input-field w-full px-4 py-2 rounded-lg text-sm" placeholder="Enter Your Full Name">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Phone Number</label>
                                <input type="text" class="input-field w-full px-4 py-2 rounded-lg text-sm" placeholder="Enter Your Phone Number">
                            </div>
                        </div>
                        <div class="mb-6">
                            <label class="block text-sm font-bold text-text-main mb-1">Note</label>
                            <input type="text" class="input-field w-full px-4 py-2 rounded-lg text-sm" placeholder="Enter Your Note">
                        </div>
                    </div>
                    <!-- Location Details Section -->
                    <div class="mb-2">
                        <h3 class="text-lg font-bold text-text-main mb-4">Location Details</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">City</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option value="">Select Government</option>
                                    <option value="Cairo" selected>Cairo</option>
                                    <option value="Giza">Giza</option>
                                    <option value="Alexandria">Alexandria</option>
                                    <option value="Dakahlia">Dakahlia</option>
                                    <option value="Red Sea">Red Sea</option>
                                    <option value="Beheira">Beheira</option>
                                    <option value="Fayoum">Fayoum</option>
                                    <option value="Gharbiya">Gharbiya</option>
                                    <option value="Ismailia">Ismailia</option>
                                    <option value="Menoufia">Menoufia</option>
                                    <option value="Minya">Minya</option>
                                    <option value="Qaliubiya">Qaliubiya</option>
                                    <option value="New Valley">New Valley</option>
                                    <option value="Suez">Suez</option>
                                    <option value="Aswan">Aswan</option>
                                    <option value="Assiut">Assiut</option>
                                    <option value="Beni Suef">Beni Suef</option>
                                    <option value="Port Said">Port Said</option>
                                    <option value="Damietta">Damietta</option>
                                    <option value="Sharkia">Sharkia</option>
                                    <option value="South Sinai">South Sinai</option>
                                    <option value="Kafr Al sheikh">Kafr Al sheikh</option>
                                    <option value="Matrouh">Matrouh</option>
                                    <option value="Luxor">Luxor</option>
                                    <option value="Qena">Qena</option>
                                    <option value="North Sinai">North Sinai</option>
                                    <option value="Sohag">Sohag</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Area</label>
                                <select class="input-field w-full px-4 py-2 rounded-lg text-sm">
                                    <option>Dokki</option>
                                    <option>Maadi</option>
                                    <option>Zamalek</option>
                                    <option>6th of October</option>
                                    <option>Nasr City</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Street</label>
                                <input type="text" class="input-field w-full px-4 py-2 rounded-lg text-sm" value="EL sodan street">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-text-main mb-1">Detailed building address</label>
                                <input type="text" class="input-field w-full px-4 py-2 rounded-lg text-sm" value="Building 5">
                            </div>
                        </div>
                    </div>
                    <!-- Payment Method -->
                    <div class="mb-6">
                        <label class="block text-base font-bold text-text-main mb-2">Choose Your Payment Method</label>
                        <div class="flex flex-col gap-2">
                            <label class="inline-flex items-center text-lg font-semibold">
                                <input type="radio" name="payment" class="form-radio text-secondary mr-2" checked>
                                Paypal
                                <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" class="h-6 ml-2">
                            </label>
                            <label class="inline-flex items-center text-lg font-semibold">
                                <input type="radio" name="payment" class="form-radio text-secondary mr-2">
                                Cash On Visit
                            </label>
                        </div>
                    </div>
                    <div class="flex justify-end mt-6">
                        <button type="submit" class="btn-secondary text-white px-10 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-colors">Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import '../style.css'
export default {
    name: 'TechnicianDetails',
}
</script>

<style lang="scss" scoped>
@import '../style.css';

.step-active {
  background-color: var(--secondary);
  color: #fff;
}
.step-inactive {
  background-color: var(--sidebar);
  color: var(--secondary);
}
.star {
  color: var(--primary);
}
.input-field {
  background-color: #fff;
  border: 2px solid #e0e0e0;
  color: #333333;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-field:focus {
  outline: none;
  border-color: #7c6bb0; /* secondary */
  box-shadow: 0 0 0 2px rgba(124, 107, 176, 0.15);
}
.input-field:disabled {
  background-color: #f5f5f5;
  color: #aaaaaa;
  cursor: not-allowed;
}
.btn-secondary {
  background-color: var(--secondary);
  border-radius: 5px;
  cursor: pointer;
}
.btn-secondary:hover {
    opacity: 0.9;
}

</style>