import HttpService from '../../../../shared/services/HttpService';
import { PlanYear, PlanSendModel, PlanExcelSendType } from './interfaces/PlanForm';

class PlanFormApi {
    public pvmPlan = (data: PlanSendModel): Promise<PlanYear> => {
        const url = 'formularios/pvm/plan?'
        return HttpService.get(url, data)
    };
    public downloadCSV = (data: PlanExcelSendType): Promise<BlobPart> => {
        const url = 'formularios/pvm/plan-download-csv?yearPlan=' + data.yearPlan
        return HttpService.downloadFileCSV('GET', url)
    };
    public uploadCSV = (data: any, year: string): Promise<BlobPart> => {
        const url = 'formularios/pvm/plan-upload-csv?yearUploadPlan=' + year
        const dataSent = new FormData();
        dataSent.append('file', data);
        return HttpService.upload('POST', url, dataSent)
    };
}

export default new PlanFormApi();
