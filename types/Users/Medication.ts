import { ObjectId, OptionalId } from "mongodb";
import { User_Short } from "./User.ts";
import { Doctor } from "./Doctor.ts";

export type MedicationDB = OptionalId<{
    name: string,
    patient: ObjectId,
    type: "Pastilla" | "Jarabe" | string,
    info: Med_infoDB[],
}>

export type Medication = {
    id: string,
    name: string,
    patient: User_Short,
    type: "Pastilla" | "Jarabe" | string,
    info: Med_info[],
}

export type Medication_Short = {
    id: string,
    name: string,
    type: string,
    info: number,
}

export type Med_infoDB = {
   doctor: ObjectId,
   init_date: string,
   days_duration: number,
   amount_times_day?: number,
   ml_time?: number,
}

export type Med_info = {
   doctor: Doctor,
   init_date: string,
   days_duration: number,
   amount_times_day?: number,
   ml_time?: number,
}