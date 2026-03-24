import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
      LayoutDashboard,
      Building2,
      Calendar,
      Users,
      Tag,
      BarChart3,
      Settings,
      LogOut,
      Menu,
      X
} from 'lucide-react';

interface AdminLayoutProps {
      children: React.ReactNode;
}

const navigation = [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Restaurants', href: '/admin/restaurants', icon: Building2 },
      { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Offers', href: '/admin/offers', icon: Tag },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
      const [sidebarOpen, setSidebarOpen] = React.useState(false);
      const pathname = usePathname();

      const handleSignOut = () => {
            signOut({ callbackUrl: '/' });
      };

      return (
            <div className="min-h-screen bg-gray-50">
                  {/* Mobile sidebar */}
                  <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
                        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg">
                              <div className="flex items-center justify-between p-4 border-b">
                                    <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                                    <button
                                          onClick={() => setSidebarOpen(false)}
                                          className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                                    >
                                          <X className="h-6 w-6" />
                                    </button>
                              </div>
                              <nav className="mt-4">
                                    {navigation.map((item) => {
                                          const isActive = pathname === item.href;
                                          return (
                                                <Link
                                                      key={item.name}
                                                      href={item.href}
                                                      className={`flex items-center px-4 py-3 text-sm font-medium ${isActive
                                                                  ? 'bg-indigo-50 border-r-2 border-indigo-600 text-indigo-700'
                                                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                            }`}
                                                      onClick={() => setSidebarOpen(false)}
                                                >
                                                      <item.icon className="mr-3 h-5 w-5" />
                                                      {item.name}
                                                </Link>
                                          );
                                    })}
                              </nav>
                        </div>
                  </div>

                  {/* Desktop sidebar */}
                  <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                              <div className="flex items-center flex-shrink-0 px-4 py-6 border-b border-gray-200">
                                    <Building2 className="h-8 w-8 text-indigo-600" />
                                    <span className="ml-2 text-xl font-bold text-gray-900">FoodHub Admin</span>
                              </div>
                              <nav className="mt-8 flex-1 px-2 space-y-1">
                                    {navigation.map((item) => {
                                          const isActive = pathname === item.href;
                                          return (
                                                <Link
                                                      key={item.name}
                                                      href={item.href}
                                                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                                                  ? 'bg-indigo-50 border-r-2 border-indigo-600 text-indigo-700'
                                                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                            }`}
                                                >
                                                      <item.icon className="mr-3 h-5 w-5" />
                                                      {item.name}
                                                </Link>
                                          );
                                    })}
                              </nav>
                              <div className="flex-shrink-0 p-4 border-t border-gray-200">
                                    <button
                                          onClick={handleSignOut}
                                          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
                                    >
                                          <LogOut className="mr-3 h-5 w-5" />
                                          Sign Out
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Main content */}
                  <div className="lg:pl-64">
                        {/* Top bar */}
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 lg:hidden">
                              <div className="flex items-center justify-between px-4 py-4">
                                    <button
                                          onClick={() => setSidebarOpen(true)}
                                          className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                                    >
                                          <Menu className="h-6 w-6" />
                                    </button>
                                    <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                                    <button
                                          onClick={handleSignOut}
                                          className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                                    >
                                          <LogOut className="h-6 w-6" />
                                    </button>
                              </div>
                        </div>

                        {/* Page content */}
                        <main className="flex-1">
                              {children}
                        </main>
                  </div>
            </div>
      );
}