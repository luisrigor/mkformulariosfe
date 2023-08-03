import HttpService from '../../../../shared/services/HttpService';

import { Model, ModelSendModel } from './interfaces/Model';
class ModelApi {
    public pvmModel = (data: ModelSendModel): Promise<Model> => {
        const url = 'formularios/pvm/model?'
        return HttpService.get(url, data)
    };
    public pvmNewModel = (data: ModelSendModel, id: number): Promise<Model> => {
        const url = 'formularios/pvm/new-model?idModel=' + id
        return HttpService.post(url, data)
    };
}

export default new ModelApi();
