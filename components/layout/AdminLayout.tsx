
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaCar, FaBuilding, FaClipboardList, FaSignOutAlt, FaUserCircle, FaHome, FaCog } from 'react-icons/fa';
import { ToastProvider } from '../ui/Toast';

const AdminLayout: React.FC = () => {
    const navItems = [
        { name: 'لوحة التحكم', path: '/admin/dashboard', icon: FaTachometerAlt },
        { name: 'إدارة السيارات', path: '/admin/cars', icon: FaCar },
        { name: 'إدارة العقارات', path: '/admin/properties', icon: FaBuilding },
        { name: 'إعدادات الموقع', path: '/admin/settings', icon: FaCog },
        { name: 'إدارة الطلبات', path: '/admin/orders', icon: FaClipboardList },
    ];
    
    return (
        <ToastProvider>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col transition-colors duration-300">
                <div className="p-4 border-b dark:border-gray-700 text-center">
                    <h1 className="text-2xl font-bold text-primary dark:text-blue-400">لوحة التحكم</h1>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => 
                                `flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-md transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-blue-400 ${isActive ? 'bg-blue-100 dark:bg-gray-700 text-primary dark:text-blue-400 font-semibold' : ''}`
                            }
                        >
                            <item.icon className="me-3" />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                    <hr className="my-2 dark:border-gray-700"/>
                     <NavLink
                        to="/"
                        className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-blue-400"
                    >
                        <FaHome className="me-3" />
                        <span>العودة للموقع الرئيسي</span>
                    </NavLink>
                    <NavLink
                        to="/login"
                        className="flex items-center px-4 py-2.5 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                        <FaSignOutAlt className="me-3" />
                        <span>تسجيل الخروج</span>
                    </NavLink>
                </nav>
                 <div className="p-4 border-t dark:border-gray-700 flex items-center">
                    <FaUserCircle className="text-3xl text-gray-500 dark:text-gray-400 me-3" />
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-200">مرحباً المدير</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
        </ToastProvider>
    );
};

export default AdminLayout;
