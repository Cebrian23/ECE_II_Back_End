import { ObjectId, OptionalId } from "mongodb";
import { Report_Short } from "./Report.ts";
import { Medication_Short } from "./Medication.ts";
import { Doctor } from "./Doctor.ts";

export type UserDB = OptionalId<{
    name: string,
    surname_1: string,
    surname_2?: string,
    email: string,
    password: string,
    phone_prefix?: string,
    phone_number?: string,
    doctors: ObjectId[],
}>

export type User = {
    id: string,
    name: string,
    surname_1: string,
    surname_2?: string,
    email: string,
    phone_prefix?: string,
    phone_number?: string,
    doctors: Doctor[],
    medications: Medication_Short[],
}

export type User_Short = {
    id: string,
    name: string,
    surname_1: string,
    surname_2?: string,
    email: string,
}