import basicInfo from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import crud from './crud';

//Visit : https://www.section.io/engineering-education/documenting-node-js-rest-api-using-swagger/
export default {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    ...crud
};