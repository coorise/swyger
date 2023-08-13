import createOne from "./parts/create-one";
import createMany from "./parts/create-many";
import findOne from "./parts/find-one";
import findMany from "./parts/find-many";
import deleteOne from "./parts/delete-one";
import deleteMany from "./parts/delete-many";
import updateOne from "./parts/update-one";
import updateMany from "./parts/update-many";

class AcebaseService {
    constructor() {}

    createOne=async (aceClient,data)=> await createOne(aceClient,data)
    createMany=async (aceClient,data)=> await createMany(aceClient,data)

    updateOne=async (aceClient,data)=> await updateOne(aceClient,data)
    updateMany=async (aceClient,data)=> await updateMany(aceClient,data)

    findOne=async (aceClient,data)=> await findOne(aceClient,data)
    findMany=async (aceClient,data)=> await findMany(aceClient,data)

    deleteOne= async (aceClient,data)=> await deleteOne(aceClient,data)
    deleteMany=async (aceClient,data)=> await deleteMany(aceClient,data)

}

export {
    createOne,
    createMany,
    findOne,
    findMany,
    deleteOne,
    deleteMany,
    updateOne,
    updateMany,
    AcebaseService

}
