/* eslint-disable default-case */
import _ from 'lodash';

function difference(object: any, base:any) {
    function arrayDiff(valArray: any, baseArray: any) {
        if(_.isObject(_.head(valArray)) || _.isObject(_.head(baseArray))) {
            const baseArrayById = _.keyBy(baseArray, 'id');
            const changeset = _.reduce(valArray, function(changeset: any, valItem:any, key: any) {
                if (!valItem.id) {
                    _.unset(valItem,'id');
                    changeset.create.push(changes(valItem, {}));
                }else{
                    const baseItem = _.get(baseArrayById, valItem.id);
                    if(baseItem) {
                        if(!_.isEqual(valItem, baseItem)){
                            const changedVals = changes(valItem, baseItem);
                            if (!_.isEmpty(changedVals)){
                                if(valItem.id){
                                    changeset.update.push(_.extend(changedVals, {id:valItem.id}));
                                }else{
                                    changeset.update.push(changedVals);
                                }                                
                            }
                        }
                        _.unset(baseArrayById,valItem.id);
                    } else {
                        _.unset(valItem,'id');
                        changeset.create.push(changes(valItem, {}));
                    }
                }
                return changeset;
            }, { create:[],update:[],delete:[]});
            _.set(changeset, 'delete', _.without(_.flatMap(baseArrayById,"id"),undefined));
            if (_.isEmpty(changeset.create)){
                _.unset(changeset,'create');
            }
            if (_.isEmpty(changeset.update)){
                _.unset(changeset,'update');
            }
            if (_.isEmpty(changeset.delete)){
                _.unset(changeset,'delete');
            }
            return changeset;
        } else {
            //in case we needs to always send overwrite current values for m2m fields.
            // return {replaceWith: valArray};
            //array of literals [1,2,3] or ["test","test2"]
            const add = _.difference(valArray, baseArray);
            const remove = _.difference(baseArray, valArray);
            return _.extend({},!_.isEmpty(add)?{add}:{},!_.isEmpty(remove)?{remove}:{})
        }
    }
	function changes(object:any, base:any) {
		return _.transform(object, function(result:any, value, key:string) {
            const baseValue = base[key];
			if (!_.endsWith(key, '_obj') && !_.isEqual(value, baseValue)) {
                if(_.isArray(value) || _.isArray(baseValue)){
                    const arrayVal = arrayDiff(value, baseValue);
                    if (!_.isEmpty(arrayVal)){
                        result[key] = arrayVal
                    }
                }else if (_.isObject(value) && _.isObject(baseValue)){
                    const objVal = changes(value, baseValue); 
                    if(!_.isEmpty(objVal)){
                        result[key] = objVal;
                    }                    
                }else{
                    result[key] =  value;
                }				
			}
		});
	}
	return changes(object, base);
}


export const transform_obj_keys = (object: any) => {
	function changes(object:any) {
		return _.transform(object, function(result:any, value, key:string) {
            if (key !== 'id' && !_.endsWith(key, '_obj')) {
                if(_.isArray(value)) {
                    result[key] = !_.isObject(value[0]) ? value : _.map(value, (val)=>changes(val));
                }else if (_.isObject(value)){
                    result[key] = changes(value);
                }else{
                    result[key] = value;
                }
			}
		});
	}
	return changes(object);
}
const prepareChangeset:any = (previousData:any, data:any, ): any => {
    console.log(`Update Old Data `, previousData);
    console.log(`Update New Data `, data);
    const changeset = difference(data, previousData);
    console.log(`Update CHANGED Data `, changeset);
    _.unset(changeset,'selected_employee_ids');
    return changeset;
}

export default prepareChangeset;