import HttpService from '../../../../shared/services/HttpService';

import { PlanYear, PlanSendModel, PlanExcelSendType } from './interfaces/PlanForm';

// http://localhost:8083/mk-services/formularios/pvm/model?idModel=-1&isDetail=falseyear=2023
class PlanFormApi {
    public pvmPlan = (data: PlanSendModel): Promise<PlanYear> => {
        const url = 'formularios/pvm/plan?'
        return HttpService.get(url, data)
    };
    // /formularios/pvm/plan-download-csv?yearPlan=2023
    public downloadExcel = async (data: PlanExcelSendType, id: number): Promise<{ id: number }> => {
        const mediaBlob = await (await fetch(data.url ?? '')).blob();
        return HttpService.upload('POST', 'formularios/pvm/plan-download-csv?', {
            tradeinId: id,
            section: media.section,
            type: media.type,
            position: media.position,
            mimeType: mediaBlob.type
        }, mediaBlob);
    };
    // public uploadExcel = async (data: Media, id: number): Promise<{ id: number }> => {
	// 	const mediaBlob = await (await fetch(media.url ?? '')).blob();
	// 	return HttpService.upload('POST', 'tradein/media/upload', {
	// 		tradeinId: id,
	// 		section: media.section,
	// 		type: media.type,
	// 		position: media.position,
	// 		mimeType: mediaBlob.type
	// 	}, mediaBlob);
	// };
}

export default new PlanFormApi();
