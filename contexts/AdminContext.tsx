import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { isAdminVip as isAdminVipFromService, setAdminVipStatus } from '../services/adminService';

interface AdminContextType {
  isAdminVip: boolean;
  toggleAdminVipStatus: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminVip, setIsAdminVip] = useState<boolean>(isAdminVipFromService());

  const toggleAdminVipStatus = useCallback(() => {
    const newAdminVipStatus = !isAdminVip;
    setIsAdminVip(newAdminVipStatus);
    setAdminVipStatus(newAdminVipStatus);
  }, [isAdminVip]);

  return (
    <AdminContext.Provider value={{ isAdminVip, toggleAdminVipStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
