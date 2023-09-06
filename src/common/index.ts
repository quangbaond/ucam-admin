import type { IResponse } from '@/interface';

import { message as $message } from 'antd';
import * as FileSaver from 'file-saver';
import moment from 'moment';
import * as XLSX from 'xlsx';

import { settings } from '@/api/const';
import { request } from '@/api/request';

export const callbackApi = (response: IResponse, message: string, callback: () => void | null) => {
    const callbackFunction = response.status
        ? () => {
              $message.success(message);
              callback();
          }
        : () => $message.error(response.message);

    callbackFunction();
};

export const callbackUpload = (
    status: string | undefined,
    messageSuccsess: string,
    messageError: string,
    callback: () => void | null,
) => {
    if (status) {
        if (status === 'done') {
            $message.success(messageSuccsess);
            callback();
        } else if (status === 'error') {
            $message.error(messageError);
        }
    }
};

export const cropOptions = {
    aspect: 2 / 1,
    rotationSlider: true,
    cropShape: 'rect',
};

export const useConvertSlug = (str: string) => {
    if (!str) {
        return 'sample';
    }

    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();

    const from =
        'áàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđđÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐÐ·/_,:;';
    const to =
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyddAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYDD------';

    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    return str;
};

export const exportExcel = async (urlApi: string, paramSearch: any) => {
    const query = {
        filterQuery: {
            ...paramSearch,
            options: { pagination: false },
        },
    };
    const response = await request('post', `${settings.API_URL}/${urlApi}`, query);
    const { status, result } = response;

    return status ? result?.docs : [];
};

export const fileName = moment().format('YYYY-MM-DD');
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const exportFile = (csvData: any, fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);
};
