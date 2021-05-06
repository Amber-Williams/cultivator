import React, { useState, useEffect, useRef } from 'react'
import DatePicker from './../date-picker/date-picker'
import moment from 'moment'
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function TimeEntryChart() {
    const chart_element = useRef(null);
    const [date_start, set_date_start] = useState(moment().format('YYYY-MM-DD'))
    const [date_end, set_date_end] = useState(moment().subtract(7, "days").format('YYYY-MM-DD'))

    useEffect(() => {
        const chart = new Chart(chart_element.current, {
            type: 'line',
            options: {
              responsive: true,
              scales: {
                xAxes: [{
                  type: 'time',
                }],
                y: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Hours'
                    }
                }
              }
            },
            data: {
              labels: ["2015-03-15", "2015-03-25", "2015-04-25"],
              datasets: [
                {
                    label: 'productivity',
                    data: [12, 13, 14, 15],
                    borderColor: '#FF6384',
                    borderWidth: 1
                },
                {
                    label: 'working',
                    data: [15, 6, 3],
                    borderColor: '#FF8463',
                    borderWidth: 1
                },
                {
                    label: 'working out',
                    data: [0, 0, 0],
                    borderColor: '#63FF84',
                    borderWidth: 1
                },
              ]
            }
          });

        return () => chart.destroy()
    }, [])

    return (
        <div className="d-flex">
            <div>
                <p>Date start:</p>
                <DatePicker date={date_start} set_date={set_date_start} />
            </div>
            <div>
                <p>Date end:</p>
                <DatePicker date={date_end} set_date={set_date_end} />
            </div>
            <div>
                <canvas ref={chart_element} width="500" height="500"></canvas>
            </div>
        </div>
    )
}

export default TimeEntryChart
