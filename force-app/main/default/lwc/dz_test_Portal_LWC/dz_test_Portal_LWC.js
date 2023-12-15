/* eslint-disable @lwc/lwc/no-async-operation */
/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 12-14-2023
 * @last modified by  : D - D
 **/

import { LightningElement, api } from 'lwc';
import Login_Background_Image from '@salesforce/resourceUrl/Login_Background_Image';

export default class Dz_test_Portal_LWC extends LightningElement {
    isLoaded = false;
    userName;
    counter = 1;
    showUserInfo(event) {
        ++this.counter;
        this.userName = event?.detail;
        this.template.querySelector('c-dz-portal-branding').showUserInfo(event?.detail);
    }

    get bodyStyle() {
        return this.userName != 'undefined undefined' && this.counter !== 1
            ? 'padding-top: 90px'
            : `background-image:url(${Login_Background_Image}); display: block; background-size: 100%; background-position: center; padding-top: 130px`;
    }
}