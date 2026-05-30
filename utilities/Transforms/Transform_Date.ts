export const Transform_Date = (date: string): string => {
    const date_split1 = date.split("/");
    const date_split2 = date.split("-");

    if(date_split1.length > 1){
        return (date_split1[2] + "/" + date_split1[1] + "/" + date_split1[0]);
    }
    else if(date_split2.length > 1){
        return (date_split2[2] + "-" + date_split2[1] + "-" + date_split2[0]);
    }

    return "";
}