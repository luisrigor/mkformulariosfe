
export interface PlanYear {
    car: Car[];
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


export type PlanSendType = {
    year: number;
}

export class PlanSendModel {
    public year = 0;

    toModel () {
        return {
            year: this.year
        };
    }
}

export type PlanExcelSendType = {
    yearPlan: number
}

export class PlanExcelSendModel {
    public yearPlan = 0

    toModel () {
        return {
            yearPlan: this.yearPlan
        };
    }
}
