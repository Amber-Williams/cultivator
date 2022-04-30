import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { API } from "aws-amplify";
import moment from "moment";
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from "chart.js";

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);

import DatePicker from "./../date-picker/date-picker";
import styles from "./time-entry-chart.module.scss";

Chart.defaults.color = "#FFF";
Chart.defaults.borderColor = "#4d4d4d";

function format_data_for_time_entry_chart(labels, data, entry_types) {
  let datasets = [];

  labels.forEach((date, i) => {
    const date_entry = data.find((entry) => entry.date === date);

    if (!date_entry) {
      // if no entry for given date we add nulls to existing entries
      datasets = datasets.map((dataset) => {
        dataset.data.push(null);
        return dataset;
      });
      return;
    }

    for (let key in date_entry.time_entry) {
      const dataset = datasets.find((_dataset) => _dataset.label === key);
      const time_hours = date_entry.time_entry[key] / 4; // time is in 15 minute intervals

      if (!dataset) {
        datasets.push({
          label: key,
          data: [...new Array(i).fill(null), time_hours], // if newly created entry types exist we must pad the data from previous date iterations
          borderColor:
            entry_types && entry_types[key]
              ? entry_types[key].color
              : "#ff4c5f",
          borderWidth: 1,
        });
      } else {
        if (dataset.data.length - 1 === i) dataset.data.push(time_hours);
        else {
          const fill_missing_values_difference = i - dataset.data.length;
          dataset.data.push(
            ...[
              ...new Array(fill_missing_values_difference).fill(null),
              time_hours,
            ]
          ); // pads the data from previous date iterations
        }
      }
    }
  });

  return datasets;
}

function TimeEntryChart() {
  const entry_types = useSelector(
    (state) => state.timeTackerState.entryTypes.value
  );

  const chart_element = useRef(null);
  const [date_start, set_date_start] = useState(
    moment().subtract(7, "days").format("YYYY-MM-DD")
  );
  const [date_end, set_date_end] = useState(moment().format("YYYY-MM-DD"));

  useEffect(() => {
    let chart;

    API.get(
      "api",
      `/entry/range?date_start=${date_start}&date_end=${date_end}`
    ).then((data) => {
      const datasets = format_data_for_time_entry_chart(
        data.date_range_list,
        data.data,
        entry_types
      );

      chart = new Chart(chart_element.current, {
        type: "line",
        data: {
          labels: data.date_range_list,
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: "linear",
              beginAtZero: true,
              title: {
                display: true,
                text: "Hours",
              },
            },
          },
        },
      });
    });

    return () => {
      if (chart) chart.destroy();
    };
  }, [date_start, date_end]);

  return (
    <div className="text-light d-flex flex-column align-items-center mb-5">
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

      <div className={styles.TimeEntryChartContainer}>
        <canvas ref={chart_element}></canvas>
      </div>
    </div>
  );
}

export default TimeEntryChart;
