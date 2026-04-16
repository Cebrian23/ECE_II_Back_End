import { UsersCollection } from "../../db/conection.ts";
import { Report_Short, ReportDB } from "../../types/Users/Report.ts";

export const Transform_Report = async (report: ReportDB): Promise<Response> => {
    const persona_exists = await UsersCollection.findOne({_id: report.patient});
        
    if(!persona_exists){
        return new Response(
            JSON.stringify({error: `Usuario con id ${report.patient} no encontrado`,}),
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

export const Short_Report = (report: ReportDB): Report_Short => {
    return{
        id: report._id!.toJSON(),
        report_type: report.report_type,
        health_center: report.health_center,
        health_service_type: report.health_service_type,
        specialty: report.specialty,
        date: report.date,
    }
}