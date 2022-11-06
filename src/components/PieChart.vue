<template>
    <div class="position-relative">
        <div class="spinner-border text-light" role="status" v-if="loading">
            <span class="sr-only">Loading...</span>
        </div>
        <template v-else>
            <h4 class="text-light">Coin Chart</h4>
            <b-card>
                <b-alert show variant="info" v-if="chartData.labels.length == 0">The chart could not be created because there are no assets in your wallet</b-alert>
                
                <Pie
                    :chart-options="chartOptions"
                    :chart-data="chartData"
                    :chart-id="chartId"
                    :dataset-id-key="datasetIdKey"
                    :plugins="plugins"
                    :css-classes="cssClasses"
                    :styles="styles"
                    :width="width"
                    :height="height"
                />
            </b-card>
        </template>
    </div>
</template>

<script>
import { Pie } from "vue-chartjs";

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
    name: "PieChart",
    components: {
        Pie,
    },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        chartId: {
            type: String,
            default: "pie-chart",
        },
        datasetIdKey: {
            type: String,
            default: "label",
        },
        width: {
            type: Number,
            default: 400,
        },
        height: {
            type: Number,
            default: 400,
        },
        cssClasses: {
            default: "",
            type: String,
        },
        styles: {
            type: Object,
            default: () => {},
        },
        plugins: {
            type: Array,
            default: () => [],
        },
        chartData: {}
    },
    data() {
        return {

            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
            },
        };
    },
};
</script>