import { NUMBER } from '../utils/Constants/MagicNumber';
import prepareChangeset from './prepareChangeset';
import {transform_obj_keys} from './prepareChangeset';

const newVal = 'second field new val';
const oneChnage = '1 no change';
const addRecord = 'add record';
const addedChild = 'added child';

describe('prepareChangeset', () => {
    describe('prepareChangeset', () => {
        it('change single field', () => {
            const previousData = {'id':1,'name':'old value'}
            const data = {'id':1,'name':'new value'};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({'name':'new value'});
        });
        it('change multiple fields', () => {
            const previousData = {'id':1,'name':'old value', 'period':'notchange','second_field':'second field old val'};
            const data = {'id':1,'name':'new value', 'period':'notchange','second_field':newVal};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({'name':'new value', 'second_field':newVal});
        });
        it('No change', () => {
            const previousData = {'id':1,'name':'new value', 'period':'notchange','second_field':newVal};
            const data = {'id':1,'name':'new value', 'period':'notchange','second_field':newVal};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({});
        });
        it('m2m field no change', () => {
            const previousData = {'dummay':[1,NUMBER.TWO,NUMBER.THREE]};
            const data = {'dummay':[1,NUMBER.TWO,NUMBER.THREE]};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({});
        });
        it('m2m field add items', () => {
            const previousData = {'dummay':[1,NUMBER.TWO]};
            const data = {'dummay':[1,NUMBER.TWO,NUMBER.THREE,NUMBER.FOUR]};
            const changeSet = prepareChangeset(previousData, data);
            console.log(changeSet);
            expect(changeSet).toEqual({'dummay':{add:[NUMBER.THREE, NUMBER.FOUR]}});
        });
        it('m2m field removed items', () => {
            const previousData = {'dummay':[1,NUMBER.TWO,NUMBER.THREE,NUMBER.FOUR]};
            const data = {'dummay':[1,NUMBER.TWO]};
            const changeSet = prepareChangeset(previousData, data);
            console.log(changeSet);
            expect(changeSet).toEqual({'dummay':{remove:[NUMBER.THREE, NUMBER.FOUR]}});
        });
        it('m2m field added and removed items', () => {
            const previousData = {'dummay':[1,NUMBER.TWO,NUMBER.THREE,NUMBER.FOUR]};
            const data = {'dummay':[1,NUMBER.TWO,NUMBER.FIVE,NUMBER.SIX]};
            const changeSet = prepareChangeset(previousData, data);
            console.log(changeSet);
            expect(changeSet).toEqual({'dummay':{add:[NUMBER.FIVE,NUMBER.SIX], remove:[NUMBER.THREE, NUMBER.FOUR]}});
        });
        it('o2m field no change', () => {            
            const previousData = {'dummay':[{'id':1,'name':oneChnage}]};
            const data = {'dummay':[{'id':1,'name':oneChnage}]};
            const changeSet = prepareChangeset(previousData, data);
            
            expect(changeSet).toEqual({});
        });
        it('o2m field add record', () => {            
            const previousData = {'dummay':[{'id':1,'name':oneChnage}]};
            const data = {'dummay':[{'id':1,'name':oneChnage},{'name':'2 added'}]};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({'dummay':{create:[{'name':'2 added'}]}});
        });
        it('o2m field add record with _obj', () => {            
            const previousData = {'dummay':[{'id':1,'name':oneChnage}]};
            const data = {'dummay':[{'id':1,'name':oneChnage},{'name':'2 added', 'test_obj':{id:1}}]};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({'dummay':{create:[{'name':'2 added'}]}});
        });
        it('o2m field delete record', () => {            
            const previousData = {'dummay':[{'id':1,'name':oneChnage},{'id':2,'name':'2 added'}]};
            const data = {'dummay':[{'id':1,'name':oneChnage}]};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({'dummay':{delete:[NUMBER.TWO]}});
        });
        it('o2m field update record', () => {            
            const previousData = {'dummay':[{'id':1,'name':oneChnage,'nochangefield':'nochangefield'}]};
            const data = {'dummay':[{'id':1,'name':'changed','nochangefield':'nochangefield'}]};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({'dummay':{update:[{'id':1,'name':'changed'}]}});
        });
        it('o2m field add/update/remove together', () => {            
            const previousData = {'dummay':[{'name':addRecord},{'id':1,'name':oneChnage},{'id':6,'name':'6 no change'},
            {'id':2,'name':'for update 2'},{'id':3,'name':'for update 3'},
            {'id':4,'name':'for remove 4'},{'id':5,'name':'for remove 5'}]};
            const data = {'dummay':[{'name':addRecord},{'id':1,'name':oneChnage},{'id':6,'name':'6 no change'},
            {'id':2,'name':'updated 2 new'},{'id':3,'name':'updated 3 new'}]}
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({'dummay':{create:[{'name':addRecord}],update:[{'id':2,'name':'updated 2 new'},
            {'id':3,'name':'updated 3 new'}],delete:[NUMBER.FOUR,NUMBER.FIVE]}});
        });
        it('o2m field update record with nested m2m', () => {            
            const previousData = {'dummay':[{'id':1,'changefield':'changefield','nochangefield':'nochangefield','m2m':[1,NUMBER.TWO,NUMBER.THREE,NUMBER.FOUR]}]};
            const data = {'dummay':[{'id':1,'changefield':'change field updated','nochangefield':'nochangefield','m2m':[1,NUMBER.TWO,NUMBER.FIVE,NUMBER.SIX]}]};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({'dummay':{update:[{'id':1,'changefield':'change field updated','m2m':{add:[NUMBER.FIVE,NUMBER.SIX],remove:[NUMBER.THREE,NUMBER.FOUR]}}]}});
        });
        it('o2m field update record with nested o2m', () => {            
            const previousData = {'dummay':[{'id':1,'o2m':[{'child':addedChild},{'id':101,'child':'child'},
            {'id':102,'child':'child for update'},{'id':103, 'child':'child for delete'}]}]};
            const data = {'dummay':[{'id':1,'o2m':[{'child':addedChild},{'id':101, 'child':'child'},{'id':102, 'child':'child 2 updated'}]}]};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({'dummay':{update:[{'id':1,'o2m':{create:[{'child':addedChild}],
            update:[{'id':102,'child':'child 2 updated'}],delete:[NUMBER.HUNDRED_THREE]}}]}});
        });
        it('normal field remove _obj even though changed ', () => {
            const previousData = {'test_obj':[{id:1,'name':'NUMBER.ONE'},{id:2,'name':'NUMBER.TWO'}]};
            const data = {'test_obj':[{id:1,'name':'1 updated'},{id:2,'name':'2'}]};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({});
        });
        it('normal field remove _obj', () => {
            const previousData = {'test_obj':[{id:1,'name':'1'},{id:2,'name':'2'}]};
            const data = {'test_obj':[{id:1,'name':'1'},{id:2,'name':'2'}]};
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({});
        });
        it('normal field remove _obj o2m only _obj changed', () => {
            const previousData = {'o2m': [{'id':1,'test_obj':[{id:1,'name':'1'},{id:2,'name':'2'}]}]};
            const data = {'o2m': [{'id':1, 'test_obj':[{id:1,'name':'1'},{id:2,'name':'2'}]}]}
            const changeSet = prepareChangeset(previousData, data);
            expect(changeSet).toEqual({});
        });

        it('m2m field with empty array and remove _obj field', () => {
            const createData = {'propay_type': 'propay','selected_leadpay_employee_ids': [],
            'selected_employee_ids_obj':[{'active': true, 'allow_to_add_time': true, 'base_wage': 12, 'company_id': 2920}]}
            const createdData = transform_obj_keys(createData);
            expect(createdData).toEqual({'propay_type': 'propay', 'selected_leadpay_employee_ids': []});
        });

        it('o2m field with nested array', () => {
            const createData = {'selected_employee_ids': [[1], [NUMBER.TWO]]};
            const changeSet = transform_obj_keys(createData);
            expect(changeSet).toEqual({'selected_employee_ids': [[1], [NUMBER.TWO]]});
        });

        it('m2m field with array of id', () => {
            const dummyData = {'selected_leadpay_employee_ids': [NUMBER.TEN,NUMBER.TWENTY,NUMBER.THIRTY,NUMBER.FOURTY]};
            const createdData = transform_obj_keys(dummyData);
            expect(createdData).toEqual({'selected_leadpay_employee_ids': [NUMBER.TEN,NUMBER.TWENTY,NUMBER.THIRTY,NUMBER.FOURTY]});
        });

        it('o2m array of object field with nested o2m field', () => {
            const dummyData = {'wage_ids':[{'name': 'priya','selected_leadpay_employee_ids': [NUMBER.TEN,NUMBER.TWENTY,NUMBER.THIRTY,NUMBER.FOURTY]}]};
            const createdData = transform_obj_keys(dummyData);
            expect(createdData).toEqual({'wage_ids':[{'name': 'priya','selected_leadpay_employee_ids': [NUMBER.TEN,NUMBER.TWENTY,NUMBER.THIRTY,NUMBER.FOURTY]}]});
        });
    });

});
