/**
 * @description       :
 * @author            : D - D
 * @group             :
 * @last modified on  : 12-13-2023
 * @last modified by  : D - D
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0   12-11-2023   D - D   Initial Version
 **/
import { LightningElement, api } from 'lwc';
import LOGO from '@salesforce/resourceUrl/DrizzleLogo';

export default class DzPortalBranding extends LightningElement {
    get companyLogo() {
        return LOGO;
    }

    get todayDate() {
        let newDate = new Date();
        let formatedDate = newDate.toString().replace('GMT+0530 (India Standard Time)', '');
        // console.log("newDate:" + newDate);

        return formatedDate;
    }
    userName;

    @api showUserInfo(userName) {
        console.log('userName:', JSON.stringify(userName));
        this.userName = userName;
    }
}
