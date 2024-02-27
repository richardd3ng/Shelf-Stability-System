import { UserImportJSON, readUsersFileToJSON } from "./jsonParser";
import {createUserInDB, getAllUsers} from "../../lib/api/dbOperations/userOperations";


async function importJSONUsers(filePath : string) {
    
    const jsonData: UserImportJSON[] = await readUsersFileToJSON(filePath);
    for (const user of jsonData) {
        console.log(user);
        await createUserInDB(user.name, user.password, user.administrator_permission);
    }

}

//cd into this directory adn run ts-node importUsers.ts users.json
let filePath : string = process.argv[2];
importJSONUsers(filePath);
