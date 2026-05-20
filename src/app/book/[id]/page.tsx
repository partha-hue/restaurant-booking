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
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue, trigger } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
    mode: 'onChange',
  });

  const watchedName = watch('name');
  const watchedPhone = watch('phone');
  const watchedDate = watch('date');
  const watchedGuests = watch('guests');
  const watchedPayment = watch('payment');

  useEffect(() => {
    if (id) {
      setRestaurantLoading(true);
      setRestaurantError(null);
      fetch('/api/restaurants')
        .then((res) => res.json())
        .then((data) => {
          const restaurants = Array.isArray(data) ? data : [];
          const found = restaurants.find((item: Restaurant) => String(item._id) === String(id)) || null;
          setRestaurant(found);
          if (!found) {
            setRestaurantError('Restaurant details are not available right now.');
          }
        })
        .catch(() => setRestaurantError('Failed to load restaurant details.'))
        .finally(() => setRestaurantLoading(false));
    }
  }, [id]);

  const onSubmit = async (data: BookingFormData) => {
    if (!restaurant && !id) return;

    setLoading(true);
    try {
      const booking = {
        restaurantId: id,
        restaurantName: restaurant?.name || 'Restaurant',
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

      setTimeout(() => router.push('/bookings'), 1800);
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

  const stepMeta = [
    { id: 1, title: 'Review', subtitle: 'Restaurant' },
    { id: 2, title: 'Details', subtitle: 'Guest info' },
    { id: 3, title: 'Payment', subtitle: 'Confirm' },
  ];

  const formatDate = (value?: string) => {
    if (!value) return 'Select a date';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white/95 dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl w-full max-w-md"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Your reservation is saved. Redirecting to your bookings...</p>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
          </div>
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

      {/* Progress Bar + Stepper */}
      <div className="px-6 mb-8 space-y-4">
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
          {stepMeta.map((item) => {
            const active = step === item.id;
            const completed = step > item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border px-3 py-3 text-center transition-all ${active
                  ? 'border-yellow-400 bg-yellow-400/20 text-white'
                  : completed
                    ? 'border-green-400/40 bg-green-500/10 text-white'
                    : 'border-white/15 bg-white/5 text-white/65'
                  }`}
              >
                <div className="mb-1 flex items-center justify-center gap-2">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-yellow-400 text-black' : completed ? 'bg-green-400 text-black' : 'bg-white/15 text-white'}`}>
                    {completed ? '✓' : item.id}
                  </span>
                  <span className="font-semibold">{item.title}</span>
                </div>
                <div className="opacity-80">{item.subtitle}</div>
              </div>
            );
          })}
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
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                  Reservation preview
                </span>
                <h1 className="mt-4 text-3xl font-bold">Review your table booking</h1>
                <p className="mt-2 text-white/75">
                  Confirm the restaurant details before moving to guest and payment information.
                </p>
              </div>

              {restaurantLoading ? (
                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 animate-pulse">
                  <div className="h-44 rounded-xl bg-white/15 mb-6" />
                  <div className="h-7 w-2/3 mx-auto rounded bg-white/15 mb-3" />
                  <div className="h-4 w-full rounded bg-white/10 mb-2" />
                  <div className="h-4 w-5/6 mx-auto rounded bg-white/10 mb-6" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-lg bg-white/10" />
                    <div className="h-10 rounded-lg bg-white/10" />
                  </div>
                </div>
              ) : restaurant ? (
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
                  <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
                    <motion.img
                      src={restaurant.image || '/layer1.jpg'}
                      alt={restaurant.name || 'Restaurant'}
                      className="h-72 w-full object-cover md:h-full"
                      initial={{ scale: 1.05, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.45 }}
                    />
                    <div className="p-6 md:p-8">
                      <div className="mb-4 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full bg-white/10 px-3 py-1">{restaurant.location || 'Premium location'}</span>
                        <span className="rounded-full bg-yellow-400 px-3 py-1 text-black font-semibold">⭐ {restaurant.rating ?? '4.8'}</span>
                      </div>
                      <h2 className="text-3xl font-bold">{restaurant.name}</h2>
                      <p className="mt-3 text-white/75 leading-7">{restaurant.details}</p>

                      <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <div className="rounded-2xl bg-white/10 p-4">
                          <div className="text-white/60">Guests</div>
                          <div className="mt-1 text-lg font-semibold">{watchedGuests || 1}</div>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                          <div className="text-white/60">Booking date</div>
                          <div className="mt-1 text-sm font-semibold leading-5">{formatDate(watchedDate)}</div>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                          <div className="text-white/60">Guest name</div>
                          <div className="mt-1 text-sm font-semibold leading-5">{watchedName || 'Not entered yet'}</div>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                          <div className="text-white/60">Contact</div>
                          <div className="mt-1 text-sm font-semibold leading-5">{watchedPhone || 'Pending'}</div>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl bg-black/20 p-4">
                        <p className="text-sm text-white/75">
                          Step 1 is a quick review. Continue to add guest details and then confirm the booking.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-center text-white">
                  <p className="font-semibold">{restaurantError || 'Restaurant details could not be loaded.'}</p>
                </div>
              )}
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
                    type="button"
                    onClick={() => {
                      setValue('payment', method.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      trigger('payment');
                    }}
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
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
              >
                Previous
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-all ml-auto"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={loading || !watchedPayment || !isValid}
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
