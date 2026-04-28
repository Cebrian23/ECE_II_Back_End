import { ObjectId, OptionalId } from "npm:mongodb";
import { User_Short } from "./User.ts";
import { Table_analysis } from "./Table.ts";
import { Doctor, DoctorDB } from "./Doctor.ts";

export type BloodTestDB = OptionalId<{
    user: ObjectId,
    doctor: DoctorDB,
    date: string,
    tables: Table_analysis[],
}>

export type BloodTest = {
    id: string,
    user: User_Short,
    doctor: Doctor,
    date: string,
    tables: Table_analysis[],
}