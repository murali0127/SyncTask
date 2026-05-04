//Calendar component
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import { useAppState } from '../../providers/AppProvider';
import { useEffect, useMemo } from 'react';

const localizer = momentLocalizer(moment);

export default function MyCalendar({ data }) {


      const events = useMemo(() => {
            const result = data
                  .filter(todo => todo.due_date)
                  .map(todo => {
                        // const start = new Date(todo.due_date);

                        const [year, month, day] = todo.due_date.split('T')[0].split('-').map(Number);
                        const start = new Date(year, month - 1, day);

                        if (isNaN(start)) return null;

                        const end = new Date(year, month - 1, day + 1);


                        return {
                              id: todo.id,
                              title: todo.title,
                              start,
                              end,
                              allDay: true,

                              //Keep original todo
                              resource: todo
                        };
                  })
                  .filter(Boolean)

            console.log(result);
            return result;
      }, [data]);

      // useEffect(() => {
      //       console.log(events);
      // }, []);
      // const events = data.map(todo => {
      //       return {

      //             ...todo,
      //             start: new Date(todo.due_date),
      //             end: new Date(todo.due_date),
      //             title: todo.title
      //       };
      // })
      return (
            <div className="myCustomHeight rounded-lg">

                  {events.length > 0 ? <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView='month'
                  // defaultDate={new Date(2026, 4, 1)}
                  // style={{ height: '500px', backgroundColor: 'white', color: 'black', borderRadius: "20px" }}
                  /> :
                        <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
                              No tasks with due dates found.
                        </div>
                  }
            </div>
      )

}