import { Notification } from '@/types';
import { httpRequest } from './http';

export default class Notifications {

    static getNotificationsbyUserId = async (userId:string): Promise<Notification> =>  { 
        return await httpRequest.get(`/notifications/${userId}`);
    };
}