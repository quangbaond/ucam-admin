import type { Document } from '@/modules/documents/dto';

import { settings } from '../../../api/const';
import { request } from '../../../api/request';

export const getDocumentApi = (data: string) => request<Document>('get', `${settings.API_URL}/edu/documents/${data}`);

export const deleteDocumentApi = (data: string | undefined) =>
    request<Document>('delete', `${settings.API_URL}/edu/documents/${data}`);

export const createDocumentApi = (data: Document) =>
    request<Document>('post', `${settings.API_URL}/edu/documents`, data);

export const updateDocumentApi = (id: string | undefined, data: Document) =>
    request<Document>('put', `${settings.API_URL}/edu/documents/${id}`, data);
