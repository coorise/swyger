import createOne from "./parts/create-one";
import createMany from "./parts/create-many";
import findOne from "./parts/find-one";
import findMany from "./parts/find-many";
import deleteOne from "./parts/delete-one";
import deleteMany from "./parts/delete-many";
import updateOne from "./parts/update-one";
import updateMany from "./parts/update-many";
import ValidationService from "../service";
const rootApi = process.env.API_PATH ||'/api/v1';
class ValidationController{
  validation
  constructor(name,schema) {
    this.validation= new ValidationService(schema)
    this._name = rootApi+'/'+name;
    this.findOne = this.findOne.bind(this);
    this.findMany = this.findMany.bind(this);
    this.createOne = this.createOne.bind(this);
    this.createMany = this.createMany.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.updateMany = this.updateMany.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.deleteMany = this.deleteMany.bind(this);
  }

  findOne =async (req, res, next)=> await findOne(this.validation,this._name,req, res, next)
  findMany =async (req, res, next)=> await findMany(this.validation,this._name,req, res, next)
  createOne =async (req, res, next)=> await createOne(this.validation,this._name,req, res, next)
  createMany =async (req, res, next)=> await createMany(this.validation,this._name,req, res, next)
  updateOne =async (req, res, next)=> await updateOne(this.validation,this._name,req, res, next)
  updateMany =async (req, res, next)=> await updateMany(this.validation,this._name,req, res, next)
  deleteOne =async (req, res, next)=> await deleteOne(this.validation,this._name,req, res, next)
  deleteMany =async (req, res, next)=> await deleteMany(this.validation,this._name,req, res, next)




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
  ValidationController
}
