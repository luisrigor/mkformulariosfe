import HttpService from '../../../../shared/services/HttpService';
import { BudgetYear, BudgetSendModel, BudgetExcelSendType } from './interfaces/Budget';

class BudgetApi {
    public pvmBudget = (data: BudgetSendModel): Promise<BudgetYear> => {
        const url = 'formularios/pvm/budget?'
        return HttpService.get(url, data)
    };
    public downloadCSV = (data: BudgetExcelSendType): Promise<BlobPart> => {
        const url = 'formularios/pvm/budget-download?yearBudget=' + data.yearBudget
        return HttpService.downloadFileCSV('GET', url)
    };
    public uploadCSV = (data: any, year: string): Promise<BlobPart> => {
        const url = 'formularios/pvm/budget-upload?yearBudget=' + year
        const dataSent = new FormData();
        dataSent.append('file', data);
        return HttpService.upload('POST', url, dataSent)
    };
    public downloadCSVOne = (data: BudgetExcelSendType): Promise<BlobPart> => {
        const url = 'formularios/pvm/budget-download?yearBudget=' + data.yearBudget
        return HttpService.get(url)
    };
}

export default new BudgetApi();
