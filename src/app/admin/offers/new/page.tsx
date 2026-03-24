'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import toast, { Toaster } from 'react-hot-toast';
import { CalendarIcon, PercentIcon, DollarSignIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfferFormData {
      title: string;
      description: string;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
      minimumOrder: number;
      maximumDiscount: number;
      startDate: string;
      endDate: string;
      applicableTo: 'all' | 'specific_restaurants';
      restaurantIds: string[];
      usageLimit: number;
      usagePerUser: number;
      isActive: boolean;
}

export default function NewOfferPage() {
      const router = useRouter();
      const [isLoading, setIsLoading] = useState(false);
      const [formData, setFormData] = useState<OfferFormData>({
            title: '',
            description: '',
            discountType: 'percentage',
            discountValue: 0,
            minimumOrder: 0,
            maximumDiscount: 0,
            startDate: '',
            endDate: '',
            applicableTo: 'all',
            restaurantIds: [],
            usageLimit: 0,
            usagePerUser: 1,
            isActive: true,
      });

      const handleInputChange = (field: keyof OfferFormData, value: any) => {
            setFormData(prev => ({
                  ...prev,
                  [field]: value
            }));
      };

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);

            try {
                  const response = await fetch('/api/offers', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                  });

                  if (!response.ok) {
                        throw new Error('Failed to create offer');
                  }

                  toast.success('Offer created successfully!');
                  router.push('/admin/offers');
            } catch (error) {
                  console.error('Error creating offer:', error);
                  toast.error('Failed to create offer. Please try again.');
            } finally {
                  setIsLoading(false);
            }
      };

      return (
            <AdminLayout>
                  <div className="space-y-6">
                        <div className="flex items-center justify-between">
                              <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Create New Offer</h1>
                                    <p className="text-muted-foreground">
                                          Create a new promotional offer for your customers
                                    </p>
                              </div>
                              <Button
                                    variant="outline"
                                    onClick={() => router.push('/admin/offers')}
                              >
                                    Back to Offers
                              </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="bg-white shadow rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Offer Title *</label>
                                                      <input
                                                            id="title"
                                                            type="text"
                                                            value={formData.title}
                                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                                            placeholder="e.g., 20% Off on First Order"
                                                            required
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Discount Type *</label>
                                                      <select
                                                            id="discountType"
                                                            value={formData.discountType}
                                                            onChange={(e) => handleInputChange('discountType', e.target.value as 'percentage' | 'fixed')}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                      >
                                                            <option value="percentage">
                                                                  <div className="flex items-center gap-2">
                                                                        <PercentIcon className="h-4 w-4" />
                                                                        Percentage
                                                                  </div>
                                                            </option>
                                                            <option value="fixed">
                                                                  <div className="flex items-center gap-2">
                                                                        <DollarSignIcon className="h-4 w-4" />
                                                                        Fixed Amount
                                                                  </div>
                                                            </option>
                                                      </select>
                                                </div>
                                          </div>

                                          <div className="space-y-2">
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                                                <textarea
                                                      id="description"
                                                      value={formData.description}
                                                      onChange={(e) => handleInputChange('description', e.target.value)}
                                                      placeholder="Describe the offer details..."
                                                      rows={3}
                                                      required
                                                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                          </div>
                                    </div>
                              </div>
                              <div className="bg-white shadow rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                          <h3 className="text-lg font-medium text-gray-900">Discount Details</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                      <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                                                            Discount Value * ({formData.discountType === 'percentage' ? '%' : '$'})
                                                      </label>
                                                      <input
                                                            id="discountValue"
                                                            type="number"
                                                            min="0"
                                                            step={formData.discountType === 'percentage' ? '1' : '0.01'}
                                                            max={formData.discountType === 'percentage' ? '100' : undefined}
                                                            value={formData.discountValue}
                                                            onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                                                            required
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700">Minimum Order ($)</label>
                                                      <input
                                                            id="minimumOrder"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={formData.minimumOrder}
                                                            onChange={(e) => handleInputChange('minimumOrder', parseFloat(e.target.value) || 0)}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <label htmlFor="maximumDiscount" className="block text-sm font-medium text-gray-700">Max Discount ($)</label>
                                                      <input
                                                            id="maximumDiscount"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={formData.maximumDiscount}
                                                            onChange={(e) => handleInputChange('maximumDiscount', parseFloat(e.target.value) || 0)}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                      />
                                                </div>
                                          </div>
                                    </div>
                              </div>

                              <div className="bg-white shadow rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                          <h3 className="text-lg font-medium text-gray-900">Validity Period</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date *</label>
                                                      <div className="relative">
                                                            <input
                                                                  id="startDate"
                                                                  type="datetime-local"
                                                                  value={formData.startDate}
                                                                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                                  required
                                                                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                            />
                                                            <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                                      </div>
                                                </div>
                                                <div className="space-y-2">
                                                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date *</label>
                                                      <div className="relative">
                                                            <input
                                                                  id="endDate"
                                                                  type="datetime-local"
                                                                  value={formData.endDate}
                                                                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                                                                  required
                                                                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                            />
                                                            <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>

                              <div className="bg-white shadow rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                          <h3 className="text-lg font-medium text-gray-900">Usage Limits</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">Total Usage Limit (0 = unlimited)</label>
                                                      <input
                                                            id="usageLimit"
                                                            type="number"
                                                            min="0"
                                                            value={formData.usageLimit}
                                                            onChange={(e) => handleInputChange('usageLimit', parseInt(e.target.value) || 0)}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <label htmlFor="usagePerUser" className="block text-sm font-medium text-gray-700">Usage Per User</label>
                                                      <input
                                                            id="usagePerUser"
                                                            type="number"
                                                            min="1"
                                                            value={formData.usagePerUser}
                                                            onChange={(e) => handleInputChange('usagePerUser', parseInt(e.target.value) || 1)}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                      />
                                                </div>
                                          </div>
                                    </div>
                              </div>

                              <div className="bg-white shadow rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                          <h3 className="text-lg font-medium text-gray-900">Settings</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                          <div className="flex items-center">
                                                <input
                                                      type="checkbox"
                                                      id="isActive"
                                                      checked={formData.isActive}
                                                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                                      Active (Offer will be available immediately)
                                                </label>
                                          </div>
                                    </div>
                              </div>

                              <div className="flex justify-end space-x-4">
                                    <button
                                          type="button"
                                          onClick={() => router.push('/admin/offers')}
                                          disabled={isLoading}
                                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                          Cancel
                                    </button>
                                    <button
                                          type="submit"
                                          disabled={isLoading}
                                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                          {isLoading ? 'Creating...' : 'Create Offer'}
                                    </button>
                              </div>
                        </form>
                  </div>
                  <Toaster position="top-right" />
            </AdminLayout>
      );
}