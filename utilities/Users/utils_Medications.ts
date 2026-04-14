import { UsersCollection } from "../../db/conection.ts";
import { Medication_Short, MedicationDB } from "../../types/Users/Medication.ts";

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

    //

    return new Response(
        JSON.stringify({}),
        {
            status: 200,
        }
    );
}

export const Short_Medication = (medication: MedicationDB): Medication_Short => {
    return{
        id: medication._id!.toString(),
        name: medication.name,
        init_date: medication.init_date,
        data: medication.data
    }
}