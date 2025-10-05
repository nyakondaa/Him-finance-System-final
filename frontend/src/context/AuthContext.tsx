import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, logout as apiLogout, refreshToken as apiRefreshToken } from '../services/api';

// --- Interface Definitions ---

// Extend the decoded JWT payload type to include custom fields
interface DecodedToken {
    sub: string;
    userId?: number | string;
    role?: string;
    branchCode?: string;
    branch?: string;
    permissions?: string[];
    exp?: number;
    // Add firstName and lastName to the expected token payload
    firstName?: string;
    lastName?: string;
    // Index signature to allow accessing arbitrary properties
    [key: string]: any;
}


// Define the shape of the user data object
interface UserDataType {
    id: string;
    // FIX: Corrected typo from 'firsName' to 'firstName'
    firstName: string; 
    lastName: string;
    username: string;
    role: string;
    isAdmin: boolean;
    isSupervisor: boolean;
    branch: string | null;      
    branchCode: string | null;  // Branch code from the token/response (e.g., "HB")
    branchName: string | null;  // Branch name from the token/response
    permissions: string[];
}

interface AuthContextType {
    currentUser: UserDataType | null;
    loggedIn: boolean;
    loadingAuth: boolean;
    handleLogin: (username: string, password: string) => Promise<boolean>;
    handleLogout: () => Promise<void>;
    getValidToken: () => Promise<string | null>;
    hasPermission: (permission: string) => boolean;
    isAdmin: () => boolean;
    isSupervisor: () => boolean;
    isAdminOrSupervisor: () => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserDataType | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const refreshPromiseRef = useRef<Promise<boolean> | null>(null);
    const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Debugging logs
    const debugLog = (message: string, data?: any) => {
        // console.log(`[AuthContext] ${message}`, data || ''); // Uncomment for debugging
    };

    // --- Core Logic: Token Validity Check (Minimal) ---
    const decodeAndCheckTokenValidity = useCallback((token: string) => {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const now = Date.now() / 1000;

            if (!decoded.exp || decoded.exp < now) {
                debugLog('Token expired or invalid');
                return false;
            }
            debugLog('Token is valid');
            return true;
        } catch (error) {
            debugLog('Token decode error (malformed token)', error);
            return false;
        }
    }, []);

    /**
     * Creates a UserDataType object from an Access Token and an optional API response body.
     */
    const setUserStateFromResponse = (response: any, accessToken: string): UserDataType => {
        // Use the DecodedToken interface for better type checking
        const decoded = jwtDecode<DecodedToken>(accessToken);
        
        // Use data from API response first, then fallback to token payload
        const userRole = (response.role || decoded.role || '').toLowerCase();
        const apiUsername = response.username || decoded.sub || '';
        
        // 🚀 CHANGES: Prioritize API response for first/last name, then token payload
        const userFirstName = response.firstName || decoded.firstName || '';
        const userLastName = response.lastName || decoded.lastName || '';
        
        const isAdminRole = userRole === 'admin';
        const isSupervisorRole = userRole === 'supervisor';
        
        const userData: UserDataType = {
            id: decoded.userId ? String(decoded.userId) : apiUsername,
            firstName: userFirstName, // 💡 FIX: Corrected key name
            lastName: userLastName,
            username: apiUsername,
            role: userRole.toUpperCase(), 
            
            isAdmin: isAdminRole,
            isSupervisor: isSupervisorRole,
            
            branchCode: response.branch || decoded.branchCode || null, 
            branchName: decoded.branch || null,
            branch: response.branch || decoded.branchCode || null,
            
            permissions: response.permissions || decoded.permissions || [],
        };

        setCurrentUser(userData);
        setLoggedIn(true);
        debugLog('User state updated successfully', userData);
        return userData;
    };
    
    /**
     * Restores the UserDataType object purely from an existing Access Token (no API call).
     */
    const setUserStateFromToken = useCallback((accessToken: string): boolean => {
        try {
            // Use the DecodedToken interface for better type checking
            const decoded = jwtDecode<DecodedToken>(accessToken);
            
            const userRole = (decoded.role || '').toLowerCase();
            const apiUsername = decoded.sub || '';

            const isAdminRole = userRole === 'admin';
            const isSupervisorRole = userRole === 'supervisor';
            
            // 🚀 CHANGES: Pulling firstName and lastName directly from decoded token
            const userFirstName = decoded.firstName || '';
            const userLastName = decoded.lastName || '';

            const userData: UserDataType = {
                id: decoded.userId ? String(decoded.userId) : apiUsername,
                firstName: userFirstName, // 💡 FIX: Corrected key name
                lastName: userLastName,
                username: apiUsername,
                role: userRole.toUpperCase(),
                isAdmin: isAdminRole,
                isSupervisor: isSupervisorRole,
                
                branchCode: decoded.branchCode || null, 
                branchName: decoded.branch || null, 
                branch: decoded.branchCode || null,
                
                permissions: decoded.permissions || [],
            };
            
            setCurrentUser(userData);
            setLoggedIn(true);
            debugLog('User state restored from Access Token', userData);
            return true;
        } catch (error) {
            debugLog('Failed to restore state from token', error);
            return false;
        }
    }, []);

    // --- Handle Logout (Logic preserved) ---
    const handleLogout = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    await apiLogout(refreshToken);
                } catch (error) {
                    debugLog('Logout API error (non-critical)', error);
                }
            }
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setCurrentUser(null);
            setLoggedIn(false);
            refreshPromiseRef.current = null;
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
            debugLog('User logged out');
        }
    }, []);

    // --- Handle Login (Logic preserved) ---
    const handleLogin = useCallback(async (username: string, password: string) => {
        try {
            setLoadingAuth(true);
            const response = await apiLogin(username, password);

            if (!response?.accessToken) {
                throw new Error('No access token received');
            }

            localStorage.setItem('accessToken', response.accessToken);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            // Set the rich state from the API response
            setUserStateFromResponse(response, response.accessToken);
            console.log(response)
            
            return true;
        } catch (error) {
            debugLog('Login failed', error);
            localStorage.removeItem('accessToken'); 
            localStorage.removeItem('refreshToken');
            setCurrentUser(null);
            setLoggedIn(false);
            throw error;
        } finally {
            setLoadingAuth(false);
        }
    }, []);

    // --- Refresh Token with Race Condition Protection (Logic preserved) ---
    const refreshAccessToken = useCallback(async () => {
        if (refreshPromiseRef.current) {
            debugLog('Using existing refresh promise');
            return refreshPromiseRef.current;
        }

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            debugLog('No refresh token available');
            await handleLogout();
            return false;
        }

        const promise = (async () => {
            try {
                debugLog('Attempting token refresh');
                const response = await apiRefreshToken(refreshToken);

                if (!response?.accessToken) {
                    throw new Error('No access token in response');
                }

                localStorage.setItem('accessToken', response.accessToken);
                if (response.refreshToken) {
                    localStorage.setItem('refreshToken', response.refreshToken);
                }

                // Restore user state from the new token/response
                const success = decodeAndCheckTokenValidity(response.accessToken);
                if (!success) {
                    throw new Error('Failed to validate new token');
                }

                setUserStateFromResponse(response, response.accessToken);
                return true;

            } catch (error) {
                debugLog('Refresh failed', error);
                await handleLogout();
                return false;
            } finally {
                refreshPromiseRef.current = null;
            }
        })();

        refreshPromiseRef.current = promise;
        return promise;

    }, [handleLogout, decodeAndCheckTokenValidity]);

    // --- Get valid token (auto-refresh if needed) (Logic preserved) ---
    const getValidToken = useCallback(async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return null;

        try {
            const decoded = jwtDecode(accessToken);
            const now = Date.now() / 1000;
            const timeUntilExpiry = (decoded.exp || 0) - now;

            if (timeUntilExpiry < 300) { // 5 minute threshold (300 seconds)
                debugLog('Token expiring soon, refreshing...');
                const refreshed = await refreshAccessToken();
                return refreshed ? localStorage.getItem('accessToken') : null;
            }

            return accessToken;
        } catch (error) {
            debugLog('Token validation error', error);
            return accessToken;
        }
    }, [refreshAccessToken]);

    // --- Permission checks (Logic preserved) ---
    const hasPermission = useCallback((permission: string) => {
        if (!currentUser) return false;
        
        if (currentUser.isAdmin) {
            return true;
        }

        return currentUser.permissions.includes(permission);
    }, [currentUser]);

    const isAdmin = useCallback(() => currentUser?.isAdmin === true, [currentUser]);
    const isSupervisor = useCallback(() => currentUser?.isSupervisor === true, [currentUser]);
    const isAdminOrSupervisor = useCallback(() => isAdmin() || isSupervisor(), [isAdmin, isSupervisor]);

    // --- Initial auth check (Logic preserved) ---
    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setLoadingAuth(false);
                return;
            }

            try {
                const isValid = decodeAndCheckTokenValidity(accessToken);

                if (isValid) {
                    const restored = setUserStateFromToken(accessToken);
                    
                    if (restored) {
                        await getValidToken(); 
                    } else {
                        await handleLogout(); 
                    }
                } else {
                    const refreshed = await refreshAccessToken(); 
                    if (!refreshed) {
                        await handleLogout();
                    }
                }
            } catch (error) {
                debugLog('Initial auth check failed', error);
                await handleLogout();
            } finally {
                setLoadingAuth(false);
            }
        };

        checkAuth();
    }, [
        refreshAccessToken, 
        handleLogout, 
        decodeAndCheckTokenValidity, 
        setUserStateFromToken, 
        getValidToken
    ]);

    // --- Auto-refresh logic (Logic preserved) ---
    useEffect(() => {
        if (!loggedIn) return;

        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
        }

        refreshIntervalRef.current = setInterval(async () => {
            debugLog('Running periodic token check');
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                await handleLogout();
                return;
            }

            try {
                const decoded = jwtDecode(accessToken);
                const now = Date.now() / 1000;
                if ((decoded.exp || 0) - now < 600) { 
                    await refreshAccessToken();
                }
            } catch (error) {
                debugLog('Periodic token check failed (token decode)', error);
            }
        }, 300000); // 5 minutes (300000 ms)

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [loggedIn, refreshAccessToken, handleLogout]);

    // --- Context value ---
    const authContextValue = {
        currentUser,
        loggedIn,
        loadingAuth,
        handleLogin,
        handleLogout,
        getValidToken,
        hasPermission,
        isAdmin,
        isSupervisor,
        isAdminOrSupervisor
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};