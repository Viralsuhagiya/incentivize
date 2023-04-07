import _ from 'lodash';
import get from 'lodash/get';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { getTrackingValues } from './ProPayChangeForm';

describe('getArgType', () => {
    it('returns tracking_value_id', () => {
        const tracking_value_ids = [
            {
                'field': 'name',
                'new_value_char': 'The Shivarth Ace(Updated)',
                'new_value_datetime': false,
                'new_value_float': 0,
                'new_value_integer': 0,
                'new_value_monetary': 0,
                'new_value_text': '',
                'old_value_char': 'The Shivarth Ace',
                'old_value_datetime': false,
                'old_value_float': 0,
                'old_value_integer': 0,
                'old_value_monetary': 0,
                'old_value_text': ''
            },
            {
                'field': 'amount',
                'new_value_char': '',
                'new_value_datetime': false,
                'new_value_float': 1000,
                'new_value_integer': 0,
                'new_value_monetary': 0,
                'new_value_text': '',
                'old_value_char': '',
                'old_value_datetime': false,
                'old_value_float': 500,
                'old_value_integer': 0,
                'old_value_monetary': 0,
                'old_value_text': ''
            }
        ];
        const mail_message = {
            'author_id': 3,
            'tracking_value_ids':tracking_value_ids           
        };
        
        const trackingValues = getTrackingValues(mail_message);
        expect(trackingValues['old_name']).toEqual('The Shivarth Ace');  
        expect(trackingValues['new_name']).toEqual('The Shivarth Ace(Updated)');  
        expect(trackingValues['old_amount']).toEqual(NUMBER.FIFE_HUNDRED);  
        expect(trackingValues['new_amount']).toEqual(NUMBER.ONE_THOUSAND);  
        expect(trackingValues['old_task_names']).toEqual('');  
        expect(trackingValues['new_task_names']).toEqual(''); 
        expect(trackingValues['old_job_id']).toEqual('');  
        expect(trackingValues['new_job_id']).toEqual('');
    });
});
