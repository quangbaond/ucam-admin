// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/** user's device */
enum DeviceList {
    /** telephone */
    MOBILE = 'MOBILE',
    /** computer */
    DESKTOP = 'DESKTOP',
}

export type Device = keyof typeof DeviceList;
