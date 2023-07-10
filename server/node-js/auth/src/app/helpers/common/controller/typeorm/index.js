import createOne from "./parts/create-one";
import createMany from "./parts/create-many";
import findOne from "./parts/find-one";
import findMany from "./parts/find-many";
import deleteOne from "./parts/delete-one";
import deleteMany from "./parts/delete-many";
import updateOne from "./parts/update-one";
import updateMany from "./parts/update-many";
import getOne from "./parts/get-one";
import getMany from "./parts/get-many";

class TypeController{
  constructor(service, name) {
    this.service = service;
    this._name = name;
    this.findOne = this.findOne.bind(this);
    this.findMany = this.findMany.bind(this);
    this.getOne = this.getOne.bind(this);
    this.getMany = this.getMany.bind(this);
    this.createOne = this.createOne.bind(this);
    this.createMany = this.createMany.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.updateMany = this.updateMany.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.deleteMany = this.deleteMany.bind(this);
  }

  findOne =async (req, res, next)=> {
    return await findOne(this.service,this._name,req, res, next)
  }
  findMany =async (req, res, next)=> {
    return await findMany(this.service,this._name,req, res, next)
  }
  getOne =async (req, res, next)=> {
    return await getOne(this.service,this._name,req, res, next)
  }
  getMany =async (req, res, next)=> {
    return await getMany(this.service,this._name,req, res, next)
  }
  createOne =async (req, res, next)=> {
    return await createOne(this.service,this._name,req, res, next)
  }
  createMany =async (req, res, next)=> {
    return await createMany(this.service,this._name,req, res, next)
  }
  updateOne =async (req, res, next)=> {
    return await updateOne(this.service,this._name,req, res, next)
  }
  updateMany =async (req, res, next)=> {
    return await updateMany(this.service,this._name,req, res, next)
  }
  deleteOne =async (req, res, next)=> {
    return await deleteOne(this.service,this._name,req, res, next)
  }
  deleteMany =async (req, res, next)=> {
    return await deleteMany(this.service,this._name,req, res, next)
  }




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
  TypeController
}
