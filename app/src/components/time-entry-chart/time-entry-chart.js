import React, { useState, useEffect, useRef } from 'react'
import { API } from 'aws-amplify'
import DatePicker from './../date-picker/date-picker'
import moment from 'moment'
import { Chart, registerables } from 'chart.js';
import './time-entry-chart.css'

Chart.register(...registerables);

function format_data_for_time_entry_chart(labels, data){
    let datasets = []

    labels.forEach((date, i) => {
        const date_entry = data.find(entry => entry.date === date)

        if (!date_entry) {
            // if no entry for given date we add nulls to existing entries 
            datasets = datasets.map(dataset => {
                dataset.data.push(null)
                return dataset;
            })
            return;
        }

        for(let key in date_entry.time_entry) {
            const dataset = datasets.find(_dataset => _dataset.label === key) 
            const time_hours = date_entry.time_entry[key] / 4 // time is in 15 minute intervals

            if (!dataset) {
                datasets.push({ 
                    label: key, 
                    data: [...new Array(i).fill(null), time_hours], // if newly created entry types exist we must pad the data from previous date iterations
                    borderColor: '#' + Math.floor(Math.random()*16777215).toString(16), //TODO: use user's set colors
                    borderWidth: 1
                })
            } else {
                dataset.data.push(time_hours) 
            }
        }
        
    })

    return  datasets
}

function TimeEntryChart() {
    const chart_element = useRef(null);
    const [date_start, set_date_start] = useState(moment().subtract(7, "days").format('YYYY-MM-DD')) 
    const [date_end, set_date_end] = useState(moment().format('YYYY-MM-DD'))

    useEffect(() => {
        let chart;

        API.get('api', `/entry/range?date_start=${date_start}&date_end=${date_end}`)
            .then(data => {
                const datasets = format_data_for_time_entry_chart(data.date_range_list, data.data)
                
                chart = new Chart(chart_element.current, {
                    type: 'line',
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
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
                        labels: data.date_range_list,
                        datasets
                    }
                });
            })

        return () => { 
            if (chart) chart.destroy()
        }
    }, [date_start, date_end])

    return (
        <div className="TimeEntryChart text-light d-flex flex-column align-items-center mb-5">
            <h4>Entry Data</h4>
            <div className="d-flex my-3">
                <div>
                    <p>Date start:</p>
                    <DatePicker date={date_start} set_date={set_date_start} />
                </div>
                <div>
                    <p>Date end:</p>
                    <DatePicker date={date_end} set_date={set_date_end} />
                </div>
            </div>
            
            <div className="chart-container">
                <canvas ref={chart_element} width="500" height="500"></canvas>
            </div>
        </div>
    )
}

export default TimeEntryChart
