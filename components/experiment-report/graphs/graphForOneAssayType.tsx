import { DataForOneAssayType } from "./graphs"
import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { Container, Typography } from "@mui/material";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface GraphForOneAssayTypeProps {
    data : DataForOneAssayType;
    type : string;
    units : string;
}

export function GraphForOneAssayType(props : GraphForOneAssayTypeProps) {
    const colors = ["red", "blue", "green", "black", "yellow", "orange", "purple", "cyan", "brown", "scarlet", "gray"];
    const scatterData = {
        datasets : Array.from(props.data.conditionsToValues.entries()).map(([key, value], index) => ({
            label : key,
            data : value.values.map((v) => ({
                x : v.label,
                y : v.val
            })),
            backgroundColor : colors[index & colors.length]
            
        }))

    }
    return (
        <Container maxWidth="sm">
            <Typography align="center" >
                Results Over Time for {props.type} Assays
            </Typography>
            <Scatter options={options(props.units)} data={scatterData}/>
            
        </Container>
        
    );
}

  

const options = (units : string) => {
    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    boxWidth: 5,
                    boxHeight: 5,
                    
                }

            }
        },

        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Week Number"
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: `Measurements (${units})`
                },
                grid: {
                    display: false
                }
            },

        }
    };
}

