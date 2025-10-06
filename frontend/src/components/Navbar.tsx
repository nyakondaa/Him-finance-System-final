import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Users,
    DollarSign,
    Receipt,
    FileText,
    Settings,
    Banknote,
    LogOut,
    Home,
    Menu,
    X,
    User,
    ChevronLeft,
    CreditCard,
    Trello,
    Building,
    Shield,
    BarChart3
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const NavItem = ({ to, icon, text, onClick, isCollapsed, isActive }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive: navIsActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative
            ${navIsActive || isActive
                ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:bg-white/80 hover:text-gray-900'}
            ${isCollapsed ? 'justify-center' : ''}`
        }
    >
        <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
            {icon}
        </span>
        {!isCollapsed && (
            <span className="font-medium text-sm transition-colors">
                {text}
            </span>
        )}
        {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                {text}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
            </div>
        )}
    </NavLink>
);

const UserInfoCard = ({ currentUser, isCollapsed }) => (
    <div className={`p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 ${isCollapsed ? 'px-3' : ''}`}>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {currentUser.username}
                    </p>
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                        {currentUser.role}
                    </p>
                    {currentUser.branch && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {currentUser.branch}
                        </p>
                    )}
                </div>
            )}
        </div>
    </div>
);

const Navbar = ({ onCollapseChange }) => {
    const { currentUser, handleLogout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    if (!currentUser) return null;

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    
    const toggleCollapse = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        // Notify parent component about collapse state change
        if (onCollapseChange) {
            onCollapseChange(newCollapsedState);
        }
    };

    const navigationItems = [
        { to: "/", icon: <Home className="w-5 h-5" />, text: "Dashboard" },
        { to: "/receipting", icon: <Receipt className="w-5 h-5" />, text: "Payments" },
        { to: "/reports", icon: <BarChart3 className="w-5 h-5" />, text: "Reports" },
        { to: "/transactions", icon: <Banknote className="w-5 h-5" />, text: "Accounts" },
    ];

    const adminItems = [
        { to: "/users", icon: <Users className="w-5 h-5" />, text: "User Management" },
        { to: "/members", icon: <User className="w-5 h-5" />, text: "Members" },
        { to: "/expenses", icon: <DollarSign className="w-5 h-5" />, text: "Expenses" },
        
        { to: "/project-board", icon: <Trello className="w-5 h-5" />, text: "Projects" },
        { to: "/settings", icon: <Settings className="w-5 h-5" />, text: "Settings" },
    ];

    const role = currentUser.role?.toLowerCase();
    const isAdminOrSupervisor = role === 'admin' || role === 'supervisor';

    const renderNavContent = (isMobile = false) => (
        <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-white/50">
                {!isMobile && (
                    <div className="flex items-center justify-between">
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-bold text-gray-900 truncate">
                                    HIM Admin
                                </h1>
                                <p className="text-xs text-gray-500 mt-1">Management System</p>
                            </div>
                        )}
                        <button
                            onClick={toggleCollapse}
                            className={`p-2 rounded-lg transition-all duration-200 hover:bg-white text-gray-500 hover:text-gray-700 ${
                                isCollapsed ? 'rotate-180' : ''
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {isMobile && (
                    <div className="bg-white/50 rounded-lg p-4">
                        <h1 className="text-xl font-bold text-gray-900">HIM Admin</h1>
                        <p className="text-xs text-gray-500 mt-1">Management System</p>
                    </div>
                )}
            </div>

            {/* User Info */}
            <div className="px-4 py-4 flex-shrink-0">
                <UserInfoCard currentUser={currentUser} isCollapsed={isMobile ? false : isCollapsed} />
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2 py-2">
                <div className="space-y-1">
                    {navigationItems.map((item) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            text={item.text}
                            onClick={isMobile ? closeMobileMenu : undefined}
                            isCollapsed={isMobile ? false : isCollapsed}
                            isActive={location.pathname === item.to}
                        />
                    ))}
                </div>

                {isAdminOrSupervisor && (
                    <>
                        <div className={`pt-6 pb-2 ${isCollapsed && !isMobile ? 'hidden' : 'block'}`}>
                            <div className="flex items-center gap-2 px-2">
                                <Shield className="w-4 h-4 text-gray-400" />
                                {!isCollapsed && (
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Administration
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            {adminItems.map((item) => (
                                <NavItem
                                    key={item.to}
                                    to={item.to}
                                    icon={item.icon}
                                    text={item.text}
                                    onClick={isMobile ? closeMobileMenu : undefined}
                                    isCollapsed={isMobile ? false : isCollapsed}
                                    isActive={location.pathname === item.to}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white/50">
                <button
                    onClick={() => {
                        handleLogout();
                        if (isMobile) closeMobileMenu();
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-white hover:text-red-600 transition-all duration-200 ${
                        isMobile || !isCollapsed ? '' : 'justify-center'
                    }`}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {(!isCollapsed || isMobile) && <span className="font-medium text-sm">Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="lg:hidden fixed top-6 left-6 z-50 p-2 text-gray-600 bg-white rounded-xl shadow-lg hover:bg-gray-50 border border-gray-200 transition-all duration-200"
            >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Desktop Sidebar */}
            <aside className={`
                hidden lg:flex flex-col bg-gray-50/80 text-gray-900 border-r border-gray-200
                transition-all duration-300 ease-in-out backdrop-blur-sm
                ${isCollapsed ? 'w-20' : 'w-80'}
                h-screen fixed left-0 top-0
            `}>
                <div className="flex flex-col h-full overflow-hidden">
                    {renderNavContent()}
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside className={`
                lg:hidden fixed top-0 left-0 h-full w-80 bg-gray-50/95 backdrop-blur-md shadow-xl z-50 transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {renderNavContent(true)}
                </div>
            </aside>
        </>
    );
};

export default Navbar;