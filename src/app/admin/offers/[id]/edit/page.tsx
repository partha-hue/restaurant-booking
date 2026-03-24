'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '../../../components/AdminLayout';
import toast from 'react-hot-toast';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white shadow rounded-lg">{children}</div>;
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b border-gray-200">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-medium text-gray-900">{children}</h3>;
}

function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className || ''}`.trim()}>{children}</div>;
}

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700 block">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ' +
        (props.className || '')
      }
    />
  );
}

interface Offer {
      _id: string;
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
      usageCount: number;
}

export default function EditOfferPage() {
      const router = useRouter();
      const params = useParams();
      const offerId = params.id as string;

      const [isLoading, setIsLoading] = useState(false);
      const [isFetching, setIsFetching] = useState(true);
      const [formData, setFormData] = useState<Offer | null>(null);

      useEffect(() => {
            if (offerId) {
                  fetchOffer();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [offerId]);

      const fetchOffer = async () => {
            try {
                  const response = await fetch(`/api/offers/${offerId}`);
                  if (!response.ok) {
                        throw new Error('Failed to fetch offer');
                  }
                  const offer: Offer = await response.json();
                  setFormData(offer);
            } catch (error) {
                  console.error('Error fetching offer:', error);
                  toast.error('Failed to load offer details');
                  router.push('/admin/offers');
            } finally {
                  setIsFetching(false);
            }
      };

      const handleInputChange = <K extends keyof Offer>(field: K, value: Offer[K]) => {
            if (formData) {
                  setFormData({
                        ...formData,
                        [field]: value,
                  });
            }
      };

      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!formData) return;

            setIsLoading(true);

            try {
                  const response = await fetch(`/api/offers/${offerId}`, {
                        method: 'PUT',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                  });

                  if (!response.ok) {
                        throw new Error('Failed to update offer');
                  }

                  toast.success('Offer updated successfully!');
                  router.push('/admin/offers');
            } catch (error) {
                  console.error('Error updating offer:', error);
                  toast.error('Failed to update offer. Please try again.');
            } finally {
                  setIsLoading(false);
            }
      };

      if (isFetching) {
            return (
                  <AdminLayout>
                        <div className="flex items-center justify-center h-64">
                              <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                                    <p className="mt-2 text-muted-foreground">Loading offer details...</p>
                              </div>
                        </div>
                  </AdminLayout>
            );
      }

      if (!formData) {
            return (
                  <AdminLayout>
                        <div className="flex items-center justify-center h-64">
                              <div className="text-center">
                                    <p className="text-muted-foreground">Offer not found</p>
                                    <Button
                                          variant="outline"
                                          onClick={() => router.push('/admin/offers')}
                                          className="mt-4"
                                    >
                                          Back to Offers
                                    </Button>
                              </div>
                        </div>
                  </AdminLayout>
            );
      }

      return (
            <AdminLayout>
                  <div className="space-y-6">
                        <div className="flex items-center justify-between">
                              <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Edit Offer</h1>
                                    <p className="text-muted-foreground">
                                          Update the details of this promotional offer
                                    </p>
                              </div>
                              <Button
                                    variant="outline"
                                    onClick={() => router.push('/admin/offers')}
                              >
                                    Back to Offers
                              </Button>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 text-blue-800">
                                    <span className="font-medium">Usage Statistics:</span>
                                    <span>This offer has been used {formData.usageCount || 0} times</span>
                              </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                              {/* Basic Information */}
                              <Card>
                                    <CardHeader>
                                          <CardTitle>Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <Label htmlFor="title">Offer Title *</Label>
                                                      <Input
                                                            id="title"
                                                            type="text"
                                                            value={formData.title}
                                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                                            placeholder="e.g., 20% Off on First Order"
                                                            required
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label htmlFor="discountType">Discount Type *</Label>
                                                      <select
                                                            id="discountType"
                                                            value={formData.discountType}
                                                            onChange={(e) =>
                                                                  handleInputChange(
                                                                        'discountType',
                                                                        e.target.value as 'percentage' | 'fixed'
                                                                  )
                                                            }
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                                      >
                                                            <option value="percentage">Percentage</option>
                                                            <option value="fixed">Fixed Amount</option>
                                                      </select>
                                                </div>
                                          </div>

                                          <div className="space-y-2">
                                                <Label htmlFor="description">Description *</Label>
                                                <textarea
                                                      id="description"
                                                      value={formData.description}
                                                      onChange={(e) =>
                                                            handleInputChange('description', e.target.value)
                                                      }
                                                      placeholder="Describe the offer details..."
                                                      rows={3}
                                                      required
                                                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                          </div>
                                    </CardContent>
                              </Card>

                              {/* Discount Details */}
                              <Card>
                                    <CardHeader>
                                          <CardTitle>Discount Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                      <Label htmlFor="discountValue">
                                                            Discount Value * (
                                                            {formData.discountType === 'percentage' ? '%' : '$'})
                                                      </Label>
                                                      <Input
                                                            id="discountValue"
                                                            type="number"
                                                            min={0}
                                                            step={formData.discountType === 'percentage' ? 1 : 0.01}
                                                            max={formData.discountType === 'percentage' ? 100 : undefined}
                                                            value={formData.discountValue}
                                                            onChange={(e) =>
                                                                  handleInputChange(
                                                                        'discountValue',
                                                                        (e.target.value === ''
                                                                              ? 0
                                                                              : Number(e.target.value)) as number
                                                                  )
                                                            }
                                                            required
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label htmlFor="minimumOrder">Minimum Order ($)</Label>
                                                      <Input
                                                            id="minimumOrder"
                                                            type="number"
                                                            min={0}
                                                            step={0.01}
                                                            value={formData.minimumOrder}
                                                            onChange={(e) =>
                                                                  handleInputChange(
                                                                        'minimumOrder',
                                                                        (e.target.value === ''
                                                                              ? 0
                                                                              : Number(e.target.value)) as number
                                                                  )
                                                            }
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label htmlFor="maximumDiscount">Max Discount ($)</Label>
                                                      <Input
                                                            id="maximumDiscount"
                                                            type="number"
                                                            min={0}
                                                            step={0.01}
                                                            value={formData.maximumDiscount}
                                                            onChange={(e) =>
                                                                  handleInputChange(
                                                                        'maximumDiscount',
                                                                        (e.target.value === ''
                                                                              ? 0
                                                                              : Number(e.target.value)) as number
                                                                  )
                                                            }
                                                      />
                                                </div>
                                          </div>
                                    </CardContent>
                              </Card>

                              {/* Validity Period */}
                              <Card>
                                    <CardHeader>
                                          <CardTitle>Validity Period</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <Label htmlFor="startDate">Start Date *</Label>
                                                      <div className="relative">
                                                            <Input
                                                                  id="startDate"
                                                                  type="datetime-local"
                                                                  value={
                                                                        formData.startDate
                                                                              ? new Date(formData.startDate)
                                                                                    .toISOString()
                                                                                    .slice(0, 16)
                                                                              : ''
                                                                  }
                                                                  onChange={(e) =>
                                                                        handleInputChange('startDate', e.target.value)
                                                                  }
                                                                  required
                                                            />
                                                            <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                                      </div>
                                                </div>
                                                <div className="space-y-2">
                                                      <Label htmlFor="endDate">End Date *</Label>
                                                      <div className="relative">
                                                            <Input
                                                                  id="endDate"
                                                                  type="datetime-local"
                                                                  value={
                                                                        formData.endDate
                                                                              ? new Date(formData.endDate)
                                                                                    .toISOString()
                                                                                    .slice(0, 16)
                                                                              : ''
                                                                  }
                                                                  onChange={(e) =>
                                                                        handleInputChange('endDate', e.target.value)
                                                                  }
                                                                  required
                                                            />
                                                            <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                                      </div>
                                                </div>
                                          </div>
                                    </CardContent>
                              </Card>

                              {/* Usage Limits */}
                              <Card>
                                    <CardHeader>
                                          <CardTitle>Usage Limits</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <Label htmlFor="usageLimit">
                                                            Total Usage Limit (0 = unlimited)
                                                      </Label>
                                                      <Input
                                                            id="usageLimit"
                                                            type="number"
                                                            min={0}
                                                            value={formData.usageLimit}
                                                            onChange={(e) =>
                                                                  handleInputChange(
                                                                        'usageLimit',
                                                                        (e.target.value === ''
                                                                              ? 0
                                                                              : Number(e.target.value)) as number
                                                                  )
                                                            }
                                                      />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label htmlFor="usagePerUser">Usage Per User</Label>
                                                      <Input
                                                            id="usagePerUser"
                                                            type="number"
                                                            min={1}
                                                            value={formData.usagePerUser}
                                                            onChange={(e) =>
                                                                  handleInputChange(
                                                                        'usagePerUser',
                                                                        (e.target.value === ''
                                                                              ? 1
                                                                              : Number(e.target.value)) as number
                                                                  )
                                                            }
                                                      />
                                                </div>
                                          </div>
                                    </CardContent>
                              </Card>

                              {/* Settings */}
                              <Card>
                                    <CardHeader>
                                          <CardTitle>Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                          <div className="flex items-center space-x-2">
                                                <input
                                                      type="checkbox"
                                                      id="isActive"
                                                      checked={formData.isActive}
                                                      onChange={(e) =>
                                                            handleInputChange('isActive', e.target.checked)
                                                      }
                                                      className="rounded border-gray-300"
                                                />
                                                <Label htmlFor="isActive">
                                                      Active (Offer will be available immediately)
                                                </Label>
                                          </div>
                                    </CardContent>
                              </Card>

                              <div className="flex justify-end space-x-4">
                                    <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => router.push('/admin/offers')}
                                          disabled={isLoading}
                                    >
                                          Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                          {isLoading ? 'Updating...' : 'Update Offer'}
                                    </Button>
                              </div>
                        </form>
                  </div>
            </AdminLayout>
      );
}
