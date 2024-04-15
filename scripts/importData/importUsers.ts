import { UserImportJSON, readUsersFileToJSON } from "./jsonParser";
import { createUserInDB } from "../dbOperations/userOperations";

async function importJSONUsers(filePath : string) {

    const jsonData: UserImportJSON[] = await readUsersFileToJSON(filePath);
    for (const user of jsonData) {
        console.log(user);
        await createUserInDB(user);
    }

}

//cd into this directory adn run ts-node importUsers.ts users.json
let filePath : string = process.argv[2];
importJSONUsers(filePath);
