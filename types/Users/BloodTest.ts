import { ObjectId, OptionalId } from "npm:mongodb";
import { User_Short } from "./User.ts";
import { Table_analysis } from "./Table.ts";

export type BloodTestDB = OptionalId<{
    user: ObjectId,
    date: string,
    tables: Table_analysis[],
}>

export type BloodTest = {
    id: string,
    user: User_Short,
    date: string,
    tables: Table_analysis[],
}