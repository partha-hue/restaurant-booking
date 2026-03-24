'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Validation schema
const bookingSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  phone: yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  date: yup.string().required('Date is required').test('future-date', 'Date must be in the future', (value) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }),
  guests: yup.number().required('Number of guests is required').min(1, 'At least 1 guest').max(20, 'Maximum 20 guests'),
  payment: yup.string().required('Payment method is required'),
});

type BookingFormData = {
  name: string;
  phone: string;
  date: string;
  guests: number;
  payment: string;
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
  const [success, setSuccess] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue, trigger } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
    mode: 'onChange',
  });

  const watchedPayment = watch('payment');

  useEffect(() => {
    if (id) {
      fetch(`/api/restaurants/${id}`)
        .then((res) => res.json())
        .then((data) => setRestaurant(data));
    }
  }, [id]);

  const onSubmit = async (data: BookingFormData) => {
    if (!restaurant) return;

    setLoading(true);
    try {
      const booking = {
        restaurantId: id,
        restaurantName: restaurant.name,
        ...data,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      if (!res.ok) throw new Error('Failed to book');

      toast.success('Booking confirmed successfully!');
      setSuccess(true);

      setTimeout(() => router.push('/bookings'), 2000);
    } catch (error) {
      toast.error('Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (step === 2) {
      const isStepValid = await trigger(['name', 'phone', 'date', 'guests']);
      if (!isStepValid) {
        toast.error('Please fix the errors before proceeding');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-2xl"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to your bookings...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
        >
          ← Back
        </button>
        <div className="text-sm opacity-75">Step {step} of 3</div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
        >
          {/* Step 1: Restaurant Details */}
          {step === 1 && restaurant && (
            <div className="text-center">
              <motion.img
                src={restaurant.image || '/layer1.jpg'}
                alt={restaurant.name}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-6 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-white/80 mb-4">{restaurant.details}</p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">{restaurant.location}</span>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full">⭐ {restaurant.rating}</span>
              </div>
            </div>
          )}

          {/* Step 2: Booking Form */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Enter Your Details</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    {...register('name')}
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.name ? 'border-red-400' : 'border-white/30'
                      }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    {...register('phone')}
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.phone ? 'border-red-400' : 'border-white/30'
                      }`}
                    placeholder="10-digit phone number"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Booking Date</label>
                  <input
                    {...register('date')}
                    type="date"
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.date ? 'border-red-400' : 'border-white/30'
                      }`}
                  />
                  {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Guests</label>
                  <input
                    {...register('guests')}
                    type="number"
                    min={1}
                    max={20}
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.guests ? 'border-red-400' : 'border-white/30'
                      }`}
                    placeholder="1-20 guests"
                  />
                  {errors.guests && <p className="text-red-400 text-sm mt-1">{errors.guests.message}</p>}
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Choose Payment Method</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { value: 'offline', label: 'Pay at Restaurant', icon: '🏪' },
                  { value: 'gpay', label: 'Google Pay', icon: '💳' },
                  { value: 'phonepe', label: 'PhonePe', icon: '📱' },
                  { value: 'paytm', label: 'Paytm', icon: '💰' },
                  { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setValue('payment', method.value)}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${watchedPayment === method.value
                      ? 'border-yellow-400 bg-yellow-400/20'
                      : 'border-white/30 bg-white/10 hover:bg-white/20'
                      }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="text-sm font-medium">{method.label}</div>
                  </button>
                ))}
              </div>
              {errors.payment && <p className="text-red-400 text-sm text-center">{errors.payment.message}</p>}

              {watchedPayment && watchedPayment !== 'offline' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Payment Details</label>
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter UPI ID or account details"
                  />
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
              >
                Previous
              </button>
            )}
            {step < 3 && (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-all ml-auto"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={loading || !isValid}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
