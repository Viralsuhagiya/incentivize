import { useAttendance } from './useAttendance';


describe('Attendance', () => {
    describe('useAttendance', () => {
        it('if attendance with type manual should give true ', () => {
            const {isManual} = useAttendance({'record':{'id':'839893','type':'manual','start':'2023-01-04 08:47:22','end':false}});
            expect(isManual).toEqual(true);
        });
        it('if attendance with type manual without checkin checkout ', () => {
            const {isManual} = useAttendance({'record':{'id':'839893','type':'manual'}});
            expect(isManual).toEqual(true);
        });
        it('if attendance with type regular without checkin checkout ', () => {
            const {isManual} = useAttendance({'record':{'id':'839893','type':'regular','start':false,'end':false}});
            expect(isManual).toEqual(true);
        });
        it('if attendance with checkin without checkout ', () => {
            const {isManual} = useAttendance({'record':{'id':'839893','start':'2023-01-04 08:47:22','end':false}});
            expect(isManual).toEqual(false);
        });
        it('if attendance with checkout without checkin ', () => {
            const {isManual} = useAttendance({'record':{'id':'839893','start':false,'end':'2023-01-04 08:47:22'}});
            expect(isManual).toEqual(true);
        });
        it('if attendance checkin without checkout should give false ', () => {
            const {isManual} = useAttendance({'record':{'id':'839893','start':false,'end':false}});
            expect(isManual).toEqual(true);
        });
        it('if attendance with checkin checkout with type manual should return true ', () => {
            const {isManual} = useAttendance({'record':{'id':'839893','type':'manual','start':'2023-01-04 08:47:22','end':'2023-01-04 08:47:22'}});
            expect(isManual).toEqual(true);
        }); 
        it('if attendance with checkin checkout with type regular should return false ', () => {
            const {isManual} = useAttendance({'record':{'id':'839893','type':'regular','start':'2023-01-04 08:47:22','end':'2023-01-04 08:47:22'}});
            expect(isManual).toEqual(false);
        });
        it('if attendance with checkin checkout without type should return false ', () => {
            const {isManual} = useAttendance({'record':{'id':'839893','start':'2023-01-04 08:47:22','end':'2023-01-04 08:47:22'}});
            expect(isManual).toEqual(false);
        }); 
        it('if attendance without record should consider it regular', () => {
            const {isManual} = useAttendance({});
            expect(isManual).toEqual(false);
        });
    })
    describe('useAttendance getAttendanceStatusInfo', () => {
        it('attendance with status pending and locked false ', () => {
            const {statusInfo} = useAttendance({'record':{'id':'839893','status':'pending','locked':false}});
            expect(statusInfo).toEqual('');
        });
        it('attendance with status pending and locked true ', () => {
            const {statusInfo} = useAttendance({'record':{'id':'839893','status':'pending','locked':true}});
            expect(statusInfo).toEqual('Attendance is marked approved in QuickBooks time, Please unapprove in QB time to modify');
        });
        it('attendance with status paid and locked false ', () => {
            const {statusInfo} = useAttendance({'record':{'id':'839893','status':'paid','locked':false}});
            expect(statusInfo).toEqual('');
        });
        it('attendance with propay status paid and locked true ', () => {
            const {statusInfo} = useAttendance({'record':{'id':'839893','status':'paid','locked':true,'propay_status':'paid'}});
            expect(statusInfo).toEqual('');
        });
        it('attendance without propay locked true ', () => {
            const {statusInfo} = useAttendance({'record':{'id':'839893','status':'paid','locked':true,'propay_status':false}});
            expect(statusInfo).toEqual('Attendance is marked approved in QuickBooks time, Please unapprove in QB time to modify');
        });
        it('attendance without record ', () => {
            const {statusInfo} = useAttendance({});
            expect(statusInfo).toEqual('');
        });
   
    })
});
