import {generateString} from "../../../../helpers/utils/generate.js";

export default class ProjectModel {
    constructor(){
    }
    uid=''
    name='Swyger '+generateString(8)
    linkName=''
    projectType='media'
    description='This is the description of the project'
    owner=''
    tags='media'
    isActivated=true

}
