

Users
id: number, name: string, password: string, preferences: Array<string>, adress: { plz: string, city: string, country: string }


INSERT Users (23, "jannis", "password") 
INSERT Users (23, "jannis", "password") 
INSERT Users (23, "jannis", "password") 
INSERT Users (23, "jannis", "password") 
INSERT Users (23, "jannis", "password") 



MONTAG
{
    id: number,
    name: string, 
    password: string,
    preferences: ["chicken", "ham"],
    address: {
        plz: 4748
        city: "Berlin"
        country: "Germany",
        house_nr: {
            actual: 26
            suffix: "A"
        }
    }
}


select user where address.house_nr.suffix = "A"



MITTWOCH
{
    id: number,
    name: string, 
    password: string,
    preferences: ["chicken", "ham"],
    wohnort: {
        plz: 4748
        city: "Berlin"
        country: "Germany",
        house_nr: {
            actual: 26
            suffix: "A"
        }
    }
}
