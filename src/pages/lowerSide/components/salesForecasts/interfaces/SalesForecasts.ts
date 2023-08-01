export interface PvmDataInitial {
    pvmMonthlyReports: PvmMonthlyReport[];
    mapDealers: MapDealer[];
    notSendPVM: MapDealer[];
}

export interface MapDealer {
    key: string;
    dealer: Dealer;
}

export interface Dealer {
    ivObjectId: string;
    ivDesig: string;
    ivOid_Parent: string;
    ivEnd: string;
    ivNrDoor: string;
    ivFloor: string;
    ivTel: string;
    ivResp: string;
    ivObs: string;
    ivEmail: string;
    ivCp4: number;
    ivCp3: number;
    ivCpExt: string;
    ivFax: string;
    ivSuffixLogin: string;
    ivComercialName: string;
    ivMunicipality: string;
    ivDistrict: string;
    ivCountry: string;
    ivIdMinisite: string;
    ivUrlMinisite: string;
    ivUrlexterno: string;
    ivUrlUsados: string;
    ivDealerCode: string;
    ivSalesCode: string;
    ivAfterSalesCode: string;
    ivToyotaDealerCode: string;
    ivFacilityCode: string;
    ivStatus: IvStatus;
    ivOIdNet: string;
    ivTarsUOID?: string;
    ivNif: string;
    ivUrlDmsWS?: string;
    ivCAMember: boolean;
    ivGSCMember: boolean;
    ivGPS_X: string;
    ivGPS_Y: string;
    ivDtOpenInstalation?: string;
    ivDtCloseInstalation?: string;
    ivOidBrand: string;
    ivDtCreated: string;
    ivDtChanged: string;
    ivOidTrader?: string;
}


export enum IvStatus {
    N = "N",
    S = "S",
}

export interface PvmMonthlyReport {
    id: number;
    year: number;
    month: number;
    dtAvailability?: Dt;
    oidDealer: string;
    createdBy: string;
    dtCreated: Dt;
    available: number;
    reason: string;
    subDealer: number;
}

export interface Dt {
    date: DateClass;
    time: Time;
}

export interface DateClass {
    year: number;
    month: number;
    day: number;
}

export interface Time {
    hour: number;
    minute: number;
    second: number;
    nano: number;
}
export type SalesForecastsSendType = {
    cancelReasons: string;
    idPVM: number;
    month: number;
    year: number;
}

export class SalesForecastsSendModel {
    public cancelReasons = ''
    public idPVM = 0;
    public month = 0;
    public year = 0;

    toModel () {
        return {
            cancelReasons: this.cancelReasons,
            idPVM: this.idPVM,
            month: this.month,
            year: this.year
        };
    }
}

export type SalesForecastsExcelSendType = {
    month: number;
    oidNet: string;
    year: number;
}

export class SalesForecastsExcelSendModel {
    public month = 0
    public oidNet = '';
    public year = 0;

    toModel () {
        return {
            month: this.month,
            oidNet: this.oidNet,
            year: this.year
        };
    }
}

export type SalesForecastsDeleteSendType = {
    cancelReasons: string;
    idPVM: number;
}

export class SalesForecastsDeleteSendModel {
    public cancelReasons = ''
    public idPVM = 0;

    toModel () {
        return {
            cancelReasons: this.cancelReasons,
            idPVM: this.idPVM
        };
    }
}

