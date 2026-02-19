'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Dummy SMS sending function stub
const sendSMSConfirmation = async (
  phone: string,
  name: string,
  restaurantName: string,
  date: string
) => {
  // Here you would integrate with an SMS provider (e.g., Twilio) via an API call
  // This is a stub—no SMS will be sent
  return false; // Always false for demo
};

type Restaurant = {
  _id: string;
  name?: string;
  image?: string;
  details?: string;
  location?: string;
  rating?: number | string;
};

export default function BookRestaurantPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [payment, setPayment] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/restaurants/${id}`)
        .then((res) => res.json())
        .then((data) => setRestaurant(data));
    }
  }, [id]);

  // Validation for stepping forward
  const canGoNext = () => {
    if (step === 1) return true; // No required inputs in step 1
    if (step === 2) return name.trim() !== '' && phone.trim() !== '' && date !== '';
    return false; // No 'Next' on step 3
  };

  const handleSubmit = async () => {
    // Validate inputs before submit
    if (!payment) {
      alert('Please select payment method.');
      return;
    }
    if (name.trim() === '' || phone.trim() === '' || date === '') {
      alert('Please fill all required fields.');
      setStep(2);
      return;
    }

    const booking = {
      restaurantId: id,
      restaurantName: restaurant?.name,
      name,
      phone,
      date,
      guests,
      payment,
      createdAt: new Date().toISOString(),
    };

    // Post/save booking
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });

    setSuccess(true);

    // Try to send SMS confirmation, stub only
    const smsResult = await sendSMSConfirmation(
      phone,
      name,
      restaurant?.name ?? 'the restaurant',
      date
    );
    setSmsSent(smsResult);

    // Redirect after short delay
    setTimeout(() => router.push('/bookings'), 2000);
  };

  return (
    <div
      className={`${
        darkMode
          ? 'bg-gray-900 text-gray-100'
          : 'bg-gradient-to-br from-purple-100 to-yellow-100 text-gray-900'
      } min-h-screen flex flex-col items-center justify-center p-6 transition-all`}
    >
      {/* Top Controls */}
      <div className="flex justify-between w-full max-w-2xl items-center mb-6">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-full shadow hover:scale-105 transition-all ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          }`}
          aria-label="Back"
        >
          ←
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full shadow hover:scale-105 transition-all ${
            darkMode ? 'bg-yellow-400 text-black' : 'bg-gray-900 text-white'
          }`}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Stepper */}
      <div className="flex gap-3 mb-8">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= num
                ? darkMode
                  ? 'bg-yellow-400 text-black'
                  : 'bg-blue-600 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-400'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Step Content Card */}
      <div
        className={`${darkMode ? 'bg-gray-800' : 'bg-white/90'} shadow-xl rounded-xl p-8 w-full max-w-md`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          {step === 1
            ? 'Step 1: Restaurant Details'
            : step === 2
            ? 'Step 2: Contact Information'
            : 'Step 3: Payment'}
        </h1>

        {/* Step 1 */}
        {step === 1 && restaurant && (
          <div className="space-y-4 animate-fade-in">
            <img
              src={restaurant.image || '/layer1.jpg'}
              alt={restaurant.name}
              className="w-full h-40 object-cover rounded-xl"
            />
            <h2 className="text-2xl font-bold">{restaurant.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{restaurant.details}</p>
            <div className="flex justify-between mt-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-semibold">
                {restaurant.location}
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-semibold">
                ⭐ {restaurant.rating}
              </span>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block font-semibold mb-1">Your Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full p-2 rounded-lg border"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered w-full p-2 rounded-lg border"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input input-bordered w-full p-2 rounded-lg border"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Guests</label>
              <input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="input input-bordered w-full p-2 rounded-lg border"
                required
              />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <p className="text-sm text-gray-500">Choose your payment method</p>
            <div className="grid grid-cols-2 gap-4">
              {['offline', 'gpay', 'phonepe', 'paytm', 'bank'].map((opt) => (
                <div
                  key={opt}
                  onClick={() => setPayment(opt)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer hover:scale-105 transition-all ${payment === opt ? 'ring-2 ring-primary' : ''
                    } ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'
                  }`}
                >
                  <img
                    src={
                      opt === 'offline'
                        ? '/window.svg'
                        : opt === 'gpay'
                        ? '/gpay.png'
                        : opt === 'phonepe'
                        ? '/phonepay.png'
                        : opt === 'paytm'
                        ? '/paytm.png'
                        : '/onlinebanking.png'
                    }
                    className="w-16 h-16 object-contain"
                    alt={opt}
                  />
                  <span className="capitalize mt-2">{opt}</span>
                </div>
              ))}
            </div>

            {payment !== 'offline' && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <span className="text-sm">Scan QR or enter UPI/Bank details</span>
                <input
                  className="input input-bordered w-full p-2 rounded-lg border"
                  placeholder="Enter UPI ID or Bank details"
                />
              </div>
            )}
          </div>
        )}

        {/* Step Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className={`px-4 py-2 rounded-lg font-semibold shadow ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              ← Back
            </button>
          )}
          {step < 3 && (
            <button
              onClick={() => {
                if (canGoNext()) {
                  setStep(step + 1);
                } else {
                  alert('Please fill all required fields before proceeding.');
                }
              }}
              className={`ml-auto px-4 py-2 rounded-lg font-bold text-white ${
                darkMode
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              Next →
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleSubmit}
              disabled={!payment}
              className={`ml-auto px-4 py-2 rounded-lg font-bold text-white ${
                darkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'
                } disabled:opacity-60`}
            >
              Confirm & Book
            </button>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="mt-4 text-center font-semibold animate-fade-in">
            <p className="text-green-500">Booking confirmed!</p>
            <p className="text-gray-400 text-sm">
              {smsSent ? 'Confirmation SMS sent.' : 'SMS confirmation not implemented.'}
            </p>
          </div>
        )}
      </div>

      {/* Animation style */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
