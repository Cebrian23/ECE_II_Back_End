export type Table_analysis = {
    table_name: string,
    indexes: string[],
    data: string[],
    type: "Analysis",
}

export type Table_user_data = {
    table_name: string,
    nombre_completo: string,
    dni: string,
    fecha: string,
    type: "User_data",
}