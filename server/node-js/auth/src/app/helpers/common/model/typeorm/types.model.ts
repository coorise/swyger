import { decorate } from 'ts-mixer';
import {Column} from "typeorm";
export default class TypeModel {
    constructor() {
    }

    createdAt:string;

    updatedAt:string;

    deletedAt:string;

}