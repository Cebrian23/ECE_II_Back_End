import { DoctorsCollection, UsersCollection } from "../../db/conection.ts";
import { Doctor } from "../../types/Users/Doctor.ts";
import { Medication_Short, MedicationDB } from "../../types/Users/Medication.ts";
import { Transform_Doctor } from "./utils_Doctors.ts";
import { Short_User } from "./utils_Users.ts";

export const Transform_Medication = async (medication: MedicationDB): Promise<Response> => {
    const persona_exists = await UsersCollection.findOne({_id: medication.patient});
    
    if(!persona_exists){
        return new Response(
            JSON.stringify({error: `Usuario con id ${medication.patient} no encontrado`}),
            {
                status: 404,
            }
        );
    }
    
    const info: {
        doctor: Doctor,
        init_date: string,
        days_duration: number,
        amount_times_day?: number,
        ml_time?: number,
    }[] = [];

    const info_responses: Response[] = await Promise.all(medication.info.map(async (information) => {
        const doctor_exists = await DoctorsCollection.findOne({_id: information.doctor});

        if(!doctor_exists){
            return new Response(
                JSON.stringify({error: "Doctor no encontrado"}),
                {
                    status: 404,
                }
            );
        }
        
        if(medication.type === "Pastilla"){
            const data = {
                doctor: Transform_Doctor(doctor_exists),
                init_date: information.init_date,
                days_duration: information.days_duration,
                amount_times_day: information.amount_times_day,
            }

            info.push(data);

            return new Response(
                JSON.stringify(data),
                {
                    status: 200,
                }
            );
        }
        else if(medication.type === "Jarabe"){
            const data = {
                doctor: Transform_Doctor(doctor_exists),
                init_date: information.init_date,
                days_duration: information.days_duration,
                amount_times_day: information.amount_times_day,
                ml_time: information.ml_time,
            }

            info.push(data);

            return new Response(
                JSON.stringify(data),
                {
                    status: 200,
                }
            );
        }

        return new Response(
            JSON.stringify({error: "Error al hacer la transformación"}),
            {
                status: 400,
            }
        );
    }));

    const error = info_responses.find((res) => {
        if(res.status !== 200){
            return res;
        }
    });

    if(error){
        return new Response(
            JSON.stringify(await error.json()),
            {
                status: error.status,
            }
        );
    }

    return new Response(
        JSON.stringify(
            {
                id: medication._id!.toString(),
                name: medication.name,
                patient: Short_User(persona_exists),
                type: medication.type,
                info: info,
            }
        ),
        {
            status: 200,
        }
    );
}

export const Short_Medication = (medication: MedicationDB): Medication_Short => {
    return{
        id: medication._id!.toString(),
        name: medication.name,
        info: medication.info.length,
    }
}