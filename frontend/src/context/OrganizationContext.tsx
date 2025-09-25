import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getOrganizations, getOrganizationById, switchOrganization } from '../services/api';

export interface Organization {
  id: number;
  code: string;
  name: string;
  organizationType: 'CHURCH' | 'SCHOOL' | 'NGO' | 'BUSINESS' | 'OTHER';
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  registrationNumber?: string;
  taxNumber?: string;
  isActive: boolean;
  settings?: any;
  createdAt: string;
  updatedAt: string;
  branches?: Array<{
    code: string;
    name: string;
    isActive: boolean;
  }>;
  _count?: {
    users: number;
    members: number;
    students: number;
  };
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  switchToOrganization: (organizationId: number) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
  getOrganizationRoutes: () => Array<{ path: string; name: string }>;
  isSchool: boolean;
  isChurch: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load organizations on mount
  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const orgs = await getOrganizations();
      setOrganizations(orgs);
      
      // Set current organization from localStorage or first organization
      const savedOrgId = localStorage.getItem('currentOrganizationId');
      if (savedOrgId) {
        const savedOrg = orgs.find(org => org.id === parseInt(savedOrgId));
        if (savedOrg) {
          setCurrentOrganization(savedOrg);
        } else {
          // If saved org not found, use first available
          setCurrentOrganization(orgs[0] || null);
        }
      } else {
        setCurrentOrganization(orgs[0] || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organizations');
      console.error('Error loading organizations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToOrganization = async (organizationId: number) => {
    try {
      setError(null);
      await switchOrganization(organizationId);
      
      const organization = organizations.find(org => org.id === organizationId);
      if (organization) {
        setCurrentOrganization(organization);
        localStorage.setItem('currentOrganizationId', organizationId.toString());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch organization');
      console.error('Error switching organization:', err);
    }
  };

  const refreshOrganizations = async () => {
    await loadOrganizations();
  };

  const getOrganizationRoutes = () => {
    if (!currentOrganization) return [];

    const baseRoutes = [
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/reports', name: 'Reports' },
      { path: '/users', name: 'User Management' },
      { path: '/branches', name: 'Branches' },
      { path: '/currencies', name: 'Currencies' },
      { path: '/payment-methods', name: 'Payment Methods' },
      { path: '/expenditures', name: 'Expenditures' },
      { path: '/assets', name: 'Assets' }
    ];

    if (currentOrganization.organizationType === 'CHURCH') {
      return [
        ...baseRoutes,
        { path: '/members', name: 'Members' },
        { path: '/contributions', name: 'Contributions' },
        { path: '/projects', name: 'Projects' },
        { path: '/revenue-heads', name: 'Revenue Heads' },
        { path: '/expenditure-heads', name: 'Expenditure Heads' }
      ];
    } else if (currentOrganization.organizationType === 'SCHOOL') {
      return [
        ...baseRoutes,
        { path: '/students', name: 'Students' },
        { path: '/fees', name: 'Fee Management' },
        { path: '/academic-years', name: 'Academic Years' },
        { path: '/fee-categories', name: 'Fee Categories' },
        { path: '/fee-structures', name: 'Fee Structures' }
      ];
    }

    return baseRoutes;
  };

  const isSchool = currentOrganization?.organizationType === 'SCHOOL';
  const isChurch = currentOrganization?.organizationType === 'CHURCH';

  const value: OrganizationContextType = {
    currentOrganization,
    organizations,
    isLoading,
    error,
    switchToOrganization,
    refreshOrganizations,
    getOrganizationRoutes,
    isSchool,
    isChurch
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
