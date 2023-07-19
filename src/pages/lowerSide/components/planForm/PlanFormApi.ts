import HttpService from '../../../../shared/services/HttpService';

import { Model, ModelSendModel } from './interfaces/Model';

// http://localhost:8083/mk-services/formularios/pvm/model?idModel=-1&isDetail=falseyear=2023
class ModelApi {
    public pvmModel = (data: ModelSendModel): Promise<Model> => {
        const url = 'formularios/pvm/model?' + localStorage.getItem('Current')
        const headers = {
            'Content-Type': 'application/json',
            loginToken: data
        }
        return HttpService.get(url, data)
    };
}

export default new ModelApi();
