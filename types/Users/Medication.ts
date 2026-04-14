import { ObjectId, OptionalId } from "mongodb";
import { User_Short } from "./User.ts";

export type MedicationDB = OptionalId<{
    name: string,
    patient: ObjectId,
    type: "Pastilla" | "Jarabe" | string,
    info: {
        doctor: ObjectId,
        init_date: string,
        days_duration: number,
        amount_pills_day?: number,
        amount_ml_day?: number,
    }[],
}>

export type Medication = {
    id: string,
    name: string,
    patient: User_Short,
    init_date: string,
    data: object,
}

export type Medication_Short = {
    id: string,
    name: string,
    init_date: string,
    data: object,
}