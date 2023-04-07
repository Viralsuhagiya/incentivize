import moment from 'moment';


export const DateFormat = (props:any) => {
    const { date }: any = props;
    return (
       <>
               {date ? moment(date).format('MMM DD, YYYY') : ''}

       </>
    );
};
