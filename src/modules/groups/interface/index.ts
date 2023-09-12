export interface FindGroupParam {
    name?: string;
}
export interface Group {
    _id: string;
    name: string;
    menus: Array<string>;
    permissions: Array<string>;
}
