export interface BudgetYear {
    budgetDealers: BudgetDealer[];
    carTypes: CarType[];
    year: number;
}

export interface BudgetDealer {
    budgets: Budget[];
    dealers: string[];
}

export interface Budget {
    idPvmCarModel: number;
    month: number;
    oidDealer: string;
    plates: number;
    subDealer: number;
    year: number;
}

export interface CarType {
    id: number;
    type: string;
}
export type BudgetExcelSendType = {
    yearBudget: number;
}

export class BudgetExcelSendModel {
    public yearBudget = 0;

    toModel () {
        return {
            yearBudget: this.yearBudget
        };
    }
}

export type BudgetSendType = {
    year: number;
}

export class BudgetSendModel {
    public year = 0;

    toModel () {
        return {
            year: this.year
        };
    }
}

