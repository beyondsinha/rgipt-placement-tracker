export type OfferType = 'FTE'|'Intern'|'Intern + FTE'|'PPO'|'PPO (Summer Intern/Competition)';
export type Offer = {id:string;session:string;notificationDate:string;company:string;sector:string;offerType:OfferType;branches:string[];minCgpa:number|null;role:string;ctc:number|string|null;stipend:number|null;location?:string;studentsSelected:number|string;notes?:string};
export type Branch = {code:string;name:string};
