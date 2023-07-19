export interface Model {
    car: Car[];
    carModel: Car;
    forecast: Forecast[];
}

export interface Car {
    active: string;
    changedBy: string;
    createdBy: string;
    dtChanged: string;
    dtCreated: string;
    dtFrom: string;
    dtTo: string;
    exportOrder: number;
    id: number;
    name: string;
    type: string;
}

export interface Forecast {
    changedBy: string;
    createdBy: string;
    dtChanged: string;
    dtCreated: string;
    forecast: number;
    id: number;
    idCarModel: number;
    month: number;
    year: number;
}


export interface NewModel {
    from: string;
    model: string;
    order: number;
    to: string;
    type: string;
}

export type ModelSendType = {
    idModel: number;
    isDetail: boolean;
    year: number;
}

export class ModelSendModel {
    public idModel = 'asdasdasd'
    public isDetail = false;
    public year = 0;

    toModel () {
        return {
            idModel: this.idModel,
            isDetail: this.isDetail,
            year: this.year
        };
    }
}

