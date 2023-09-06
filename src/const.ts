interface IStorageKey {
    USER_INFO: string;
    CONFIG: string;
}

export const storageKey: IStorageKey = {
    USER_INFO: 'sfshjfgvhjsvfhjvf',
    CONFIG: 'sfshjfADADFADgvhjsv5&**%&%fhjvf',
};

export const setStoreItem = (key: string, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

export const getStoreItem = (key: string) => {
    const value = window.localStorage.getItem(key);

    if (value) {
        return JSON.parse(value);
    }

    return null;
};

export const removeStoreItem = (key: string) => {
    window.localStorage.removeItem(key);
};

export const enum ActionEnum {
    LIST = 'LIST',
    CREATE = 'CREATE',
    EDIT = 'EDIT',
}

export const enum ConfigEnum {
    SYSTEM = 'SYSTEM',
    CONTACT = 'CONTACT',
    PARTNER = 'PARTNER',
}
