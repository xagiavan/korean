const ADMIN_VIP_STATUS_KEY = 'koreanAppAdminVipStatus';

export const isAdminVip = (): boolean => {
    try {
        const status = localStorage.getItem(ADMIN_VIP_STATUS_KEY);
        return status === 'true';
    } catch (e) {
        console.error("Could not read admin VIP status from local storage.", e);
        return false;
    }
};

export const setAdminVipStatus = (isAdminVip: boolean): void => {
    try {
        localStorage.setItem(ADMIN_VIP_STATUS_KEY, String(isAdminVip));
    } catch (e) {
        console.error("Could not save admin VIP status to local storage.", e);
    }
};
