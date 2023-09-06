import {Answer, FindAnswer, FindPedagogyParams, Pedagogy} from "@/modules/pedagogy/dto";
import type {PageData} from '@/interface';

import {settings} from '../../../api/const';
import {request} from '../../../api/request';
import {FindAllParam} from "@/interface";


export const findPedagogyApi = (data: FindAllParam<FindPedagogyParams>) =>
    request<PageData<Pedagogy>>('post', `${settings.API_URL}/pedagogy/find`, data);


export const deletePedagogyApi = (id: string) => request('delete', `${settings.API_URL}/pedagogy/${id}`)

export const findAnswerApi = (data: FindAllParam<FindAnswer>) =>
    request<PageData<Answer>>('post', `${settings.API_URL}/answer/find`,data)
