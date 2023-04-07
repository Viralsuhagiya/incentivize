import React from 'react';
import { utils, writeFile } from 'xlsx';

const downloadFileCheckInOutData = [
    { 'Employee Name': 'Alvarez Estefania',Propay:'sample propay 1', 'Job Name': 'Example Job A', 'Payroll ID': 'CODE1231', 'Time Type':'Check in/out', 
    'Checkin': '15-07-2022 12:00 PM', 'Checkout': '15-07-2022 3:00 PM' },
    { 'Employee Name': 'Joey Tribbiani',Propay:'sample propay 1', 'Job Name': 'Example Job B', 'Payroll ID': 'CODE1232', 'Time Type':'Check in/out', 
    'Checkin': '09-06-2022 01:00 PM', 'Checkout': '09-06-2022 05:00 PM' },
    { 'Employee Name': 'Rachel Green',Propay:'sample propay 1', 'Job Name': 'Example Job C', 'Payroll ID': 'CODE1233', 'Time Type':'Check in/out', 
    'Checkin': '28-02-2023 02:00 PM', 'Checkout': '28-02-2023 06:30 PM' },
    { 'Employee Name': 'Ross Geller',Propay:'sample propay 1', 'Job Name': 'Example Job D', 'Payroll ID': 'CODE1234', 'Time Type':'Check in/out', 
    'Checkin': '05-01-2023 10:00 AM', 'Checkout': '05-01-2023 02:00 PM' },
    { 'Employee Name': 'Monica Geller',Propay:'sample propay 1', 'Job Name': 'Example Job E', 'Payroll ID': 'CODE1235', 'Time Type':'Check in/out', 
    'Checkin': '16-08-2022 11:00 AM', 'Checkout': '16-08-2022 4:00 PM' },
    { 'Employee Name': 'Phoebe Buffay',Propay:'sample propay 1', 'Job Name': 'Example Job F', 'Payroll ID': 'CODE1236', 'Time Type':'Check in/out', 
    'Checkin': '11-03-2023 12:30 PM', 'Checkout': '11-03-2023 05:30 PM' },
    { 'Employee Name': 'James Wilson',Propay:'sample propay 1', 'Job Name': 'Example Job G', 'Payroll ID': 'CODE1237', 'Time Type':'Check in/out', 
    'Checkin': '18-12-2022 01:00 PM', 'Checkout': '18-12-2022 06:00 PM' },
    { 'Employee Name': 'Eric Foreman',Propay:'sample propay 1', 'Job Name': 'Example Job H', 'Payroll ID': 'CODE1238', 'Time Type':'Check in/out', 
    'Checkin': '26-05-2022 02:00 PM', 'Checkout': '26-05-2022 07:00 PM' },
    { 'Employee Name': 'Robert Chase',Propay:'sample propay 1', 'Job Name': 'Example Job I', 'Payroll ID': 'CODE1239', 'Time Type':'Check in/out', 
    'Checkin': '03:00 PM', 'Checkout': '08:00 PM' },
    { 'Employee Name': 'Allison Cameron',Propay:'sample propay 1', 'Job Name': 'Example Job J', 'Payroll ID': 'CODE1123', 'Time Type':'Check in/out', 
    'Checkin': '20-09-2022 10:00 AM', 'Checkout': '20-09-2022 3:00 PM' },
  ];


  const downloadFileDurationData = [
    { 'Employee Name': 'Alvarez Estefania',Propay:'sample propay 1',  'Job Name': 'Example Job A',Hours: 3, Date: '15-07-2022', 'Payroll ID': 'CODE1231', 'Time Type':'Duration'},
    { 'Employee Name': 'Joey Tribbiani',Propay:'sample propay 2', 'Job Name': 'Example Job B',Hours: 4, Date: '09-06-2022', 'Payroll ID': 'CODE1232', 'Time Type':'Duration' },
    { 'Employee Name': 'Rachel Green',Propay:'sample propay 3', 'Job Name': 'Example Job C',Hours: 4.50, Date: '28-02-2023', 'Payroll ID': 'CODE1233', 'Time Type':'Duration' },
    { 'Employee Name': 'Ross Geller',Propay:'sample propay 4', 'Job Name': 'Example Job D',Hours: 4, Date: '05-01-2023', 'Payroll ID': 'CODE1234', 'Time Type':'Duration' },
    { 'Employee Name': 'Monica Geller',Propay:'sample propay 5', 'Job Name': 'Example Job E',Hours: 5, Date: '16-08-2022', 'Payroll ID': 'CODE1235', 'Time Type':'Duration'},
    { 'Employee Name': 'Phoebe Buffay',Propay:'sample propay 6', 'Job Name': 'Example Job F',Hours: 5, Date: '11-03-2023', 'Payroll ID': 'CODE1236', 'Time Type':'Duration' },
    { 'Employee Name': 'James Wilson',Propay:'sample propay 7', 'Job Name': 'Example Job G',Hours: 5, Date: '18-12-2022', 'Payroll ID': 'CODE1237', 'Time Type':'Duration' },
    { 'Employee Name': 'Eric Foreman',Propay:'sample propay 8', 'Job Name': 'Example Job H',Hours: 5, Date: '20-09-2022', 'Payroll ID': 'CODE1238', 'Time Type':'Duration' },
    { 'Employee Name': 'Robert Chase',Propay:'sample propay 9', 'Job Name': 'Example Job I',Hours: 5, Date: '26-05-2022', 'Payroll ID': 'CODE1239', 'Time Type':'Duration' },
    { 'Employee Name': 'Allison Cameron',Propay:'sample propay 9', 'Job Name': 'Example Job J', Hours: 5, Date: '07-04-2023', 'Payroll ID': 'CODE1123', 'Time Type':'Duration'},
    { 'Employee Name': 'Lisa Cuddy',Propay:'sample propay 2', 'Job Name': 'Example Job K', Hours: 5, Date: '13-11-2022', 'Payroll ID': 'CODE1223', 'Time Type':'Duration'},
  ];

  const downloadFilePayPeriod = [
    { 'Employee Name': 'Alvarez Estefania',Propay:'sample propay 1',  'Job Name': 'Example Job A',Hours: 3, 'Pay Period': 'Feb 20, 2023 to Feb 26, 2023', 'Payroll ID': 'CODE1231', 'Time Type':'Duration'},
    { 'Employee Name': 'Joey Tribbiani',Propay:'sample propay 2', 'Job Name': 'Example Job B',Hours: 4, 'Pay Period': 'Jan 30, 2023 to Feb 05, 2023', 'Payroll ID': 'CODE1232', 'Time Type':'Duration' },
    { 'Employee Name': 'Rachel Green',Propay:'sample propay 3', 'Job Name': 'Example Job C',Hours: 4.50, 'Pay Period': 'Jan 23, 2023 to Jan 29, 2023', 'Payroll ID': 'CODE1233', 'Time Type':'Duration' },
    { 'Employee Name': 'Ross Geller',Propay:'sample propay 4', 'Job Name': 'Example Job D',Hours: 4, 'Pay Period': 'Jan 16, 2023 to Jan 22, 2023', 'Payroll ID': 'CODE1234', 'Time Type':'Duration' },
    { 'Employee Name': 'Monica Geller',Propay:'sample propay 5', 'Job Name': 'Example Job E',Hours: 5, 'Pay Period': 'Jan 16, 2023 to Jan 22, 2023', 'Payroll ID': 'CODE1235', 'Time Type':'Duration'},
    { 'Employee Name': 'Phoebe Buffay',Propay:'sample propay 6', 'Job Name': 'Example Job F',Hours: 5, 'Pay Period': 'Jan 09, 2023 to Jan 15, 2023', 'Payroll ID': 'CODE1236', 'Time Type':'Duration' },
    { 'Employee Name': 'James Wilson',Propay:'sample propay 7', 'Job Name': 'Example Job G',Hours: 5, 'Pay Period': 'Jan 02, 2023 to Jan 08, 2023', 'Payroll ID': 'CODE1237', 'Time Type':'Duration' },
    { 'Employee Name': 'Eric Foreman',Propay:'sample propay 8', 'Job Name': 'Example Job H',Hours: 5, 'Pay Period': 'Dec 26, 2022 to Jan 01, 2023', 'Payroll ID': 'CODE1238', 'Time Type':'Duration' },
    { 'Employee Name': 'Robert Chase',Propay:'sample propay 9', 'Job Name': 'Example Job I',Hours: 5, 'Pay Period': 'Dec 19, 2022 to Dec 25, 2022', 'Payroll ID': 'CODE1239', 'Time Type':'Duration' },
    { 'Employee Name': 'Allison Cameron',Propay:'sample propay 9', 'Job Name': 'Example Job J', Hours: 5, 'Pay Period': 'Nov 28, 2022 to Dec 04, 2022', 'Payroll ID': 'CODE1123', 'Time Type':'Duration'},
    { 'Employee Name': 'Lisa Cuddy',Propay:'sample propay 2', 'Job Name': 'Example Job K', Hours: 5, 'Pay Period': 'Nov 21, 2022 to Nov 27, 2022', 'Payroll ID': 'CODE1223', 'Time Type':'Duration'},
  ];


const DownloadExcel = () => {
  const handleDownload = () => {
    const ws = 
    utils.json_to_sheet(downloadFileCheckInOutData);
    const wb = 
    utils.book_new();
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'ExampleFileCheckInOut.xlsx');
  };

  return (
    <div className='download-file-link'>
      <h3>Download Excel Example File</h3>
      <button onClick={handleDownload}>Download sample Excel file for Check In/Out</button>
    </div>
  );
};
export default DownloadExcel;

export const DownloadExcelFileDuration = () => {
  const handleDownload = () => {
    const ws = 
    utils.json_to_sheet(downloadFileDurationData);
    const wb = 
    utils.book_new();
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'ExampleFileTimeDuration.xlsx');
  };

  return (
    <div className='download-file-link'>
      <h3>Download Excel Example File</h3>
      <button onClick={handleDownload}>Download sample Excel file for Duration</button>
    </div>
  );
};

export const DownloadExcelFilePayPeriod = () => {
  const handleDownload = () => {
    const ws = 
    utils.json_to_sheet(downloadFilePayPeriod);
    const wb = 
    utils.book_new();
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'ExampleFilePayPeriod.xlsx');
  };

  return (
    <div className='download-file-link'>
      <h3>Download Excel Example File</h3>
      <button onClick={handleDownload}>Download sample Excel file for Pay Period</button>
    </div>
  );
};

/*Failure resons excel file download */
export const DownloadFilureReasons = (props) => {
    const {reasons, fileName} = props;
    const handleDownload = () => {
      const ws = 
      utils.json_to_sheet(reasons);
      const wb = 
      utils.book_new();
      utils.book_append_sheet(wb, ws, 'data');
      writeFile(wb, fileName);
    };
    return (
      <div className='download-file-link'>
        <button onClick={handleDownload}>Download Link</button>
      </div>
    );
  };
