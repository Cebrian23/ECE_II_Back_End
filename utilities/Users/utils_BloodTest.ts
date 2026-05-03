import { DoctorsCollection, UsersCollection } from "../../db/conection.ts";
import { BloodTestDB } from "../../types/Users/BloodTest.ts";
import { Short_User } from "./utils_Users.ts";
import { Transform_Doctor } from "./utils_Doctors.ts";
import { Table_analysis, Table_analysis_iterable } from "../../types/Users/Table.ts";

export const Transform_BloodTest = async (test: BloodTestDB): Promise<Response> => {
    const user_exists = await UsersCollection.findOne({_id: test.user});

    if(!user_exists){
        return new Response(
            JSON.stringify({error: "Paciente no encontrado"}),
            {
                status: 404,
            }
        );
    }

    const doctor_exists = await DoctorsCollection.findOne({_id: test.doctor});
    
    if(!doctor_exists){
        return new Response(
            JSON.stringify({error: "Doctor no encontrado"}),
            {
                status: 404,
            }
        );
    }

    return new Response(
        JSON.stringify(
            {
                id: test._id!.toString(),
                user: Short_User(user_exists),
                doctor: Transform_Doctor(doctor_exists),
                date: test.date,
                tables: test.tables,
            }
        ),
        {
            status: 200,
        }
    );
}

export const Transform_Table = (table: Table_analysis): Table_analysis_iterable => {
    //console.log("----------------------------------------------------------------");
    //console.log(table);
    const rows: string[][] = [];

    table.data.forEach((data) => {
        const row: string[] = [];
        table.indexes.forEach((index) => {
            row.push(data[index]);
        });
        rows.push(row);
    });

    const table_iterable: Table_analysis_iterable = {
        table_name: table.table_name,
        indexes: table.indexes,
        data: rows,
        type: table.type,
    }

    //console.log(table_iterable);

    return table_iterable
}

export const BloodTest_Date = (date: string): string=> {
    const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    let new_date = "";

    if(date.split("/").length > 1){
        new_date = BloodTest_Date_v1(date, months);
    }
    else if(date.split("-").length > 1){
        new_date = BloodTest_Date_v2(date, months);
    }
    else if(date.split(" ").length > 1){
        new_date = BloodTest_Date_v3(date, months);
    }

    return new_date;
}

const BloodTest_Date_v1 = (date: string, months: string[]) => {
    const date_split = date.split("/");

    let month = "";

    if(months.includes(date_split[1].toLowerCase())){
        month = Transform_month(date_split[1].toLowerCase(), months).toString();
    }
    else{
        month = date_split[1];
    }

    const new_date = `${date_split[2]}-${month}-${date_split[0]}`;

    return new_date;
}

const BloodTest_Date_v2 = (date: string, months: string[]) => {
    const date_split = date.split("-");

    let month = "";

    if(months.includes(date_split[1].toLowerCase())){
        month = Transform_month(date_split[1].toLowerCase(), months).toString();
    }
    else{
        month = date_split[1];
    }

    const new_date = `${date_split[2]}-${month}-${date_split[0]}`;

    return new_date;
}

const BloodTest_Date_v3 = (date: string, months: string[]) => {
    const date_split = date.split(" ");

    let month = "";

    if(months.includes(date_split[1].toLowerCase())){
        month = Transform_month(date_split[1].toLowerCase(), months).toString();
    }
    else{
        month = date_split[1];
    }

    const new_date = `${date_split[2]}-${month}-${date_split[0]}`;

    return new_date;
}

const Transform_month = (month: string, months: string[]): number => {
    let count = 0;
    let found = false

    months.forEach((date) => {
        if(date === month.toLowerCase() && found === false){
            found = true;   
        }

        if(found === false){
            count += 1;
        }
    });

    return count;
}
