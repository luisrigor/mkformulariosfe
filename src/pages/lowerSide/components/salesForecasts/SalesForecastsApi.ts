import HttpService from '../../../../shared/services/HttpService';

import { PvmDataInitial, SalesForecastsSendModel, SalesForecastsExcelSendType, SalesForecastsDeleteSendType } from './interfaces/SalesForecasts';
class SalesForecastsApi {
    public pvmDataInitial = (data: SalesForecastsSendModel): Promise<PvmDataInitial> => {
        const url = 'formularios/pvm/pvm'
        return HttpService.post(url, data)
    };
    public pvmOidNet = (): Promise<PvmDataInitial> => {
        const url = 'formularios/pvm/oid-net'
        return HttpService.post(url)
    };
    public downloadExcel = (month: string, data: SalesForecastsExcelSendType): Promise<BlobPart> => {
        const url = 'formularios/pvm/export-by-month?month=' + month
        return HttpService.downloadFileCSV('POST', url, data)
    };
    public pvmProvideDealer = (data: SalesForecastsDeleteSendType): Promise<PvmDataInitial> => {
        const url = 'formularios/pvm/pvm-provide-dealer?cancelReasons=' + data.cancelReasons + '&idPVM=' + data.idPVM
        return HttpService.post(url)
    };
    public pvmRequestChange = (data: SalesForecastsDeleteSendType): Promise<PvmDataInitial> => {
        const url = 'formularios/pvm/pvm-request-change?cancelReasons=' + data.cancelReasons + '&idPVM=' + data.idPVM
        return HttpService.post(url)
    };
}

export default new SalesForecastsApi();
