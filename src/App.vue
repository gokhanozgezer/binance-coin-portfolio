<template>
    <div id="app">
        <loading :status="chartLoading"></loading>
        <b-container>
            <b-row>
                <b-col cols="12" md="6">
                    <div class="text-left">
                        <b-button
                            variant="success"
                            @click="openStockModal"
                        >
                            <b-icon-plus /> Add Stock
                        </b-button>
                        <b-button
                            variant="primary"
                            class="ml-4"
                            :disabled="chartLoading"
                            @click="getCoinList"
                        >
                            <b-icon-arrow-counterclockwise /> Refresh
                        </b-button>
                    </div>
                </b-col>
                <b-col cols="12" md="6">
                    <span class="text-light text-right mt-4 d-block">Information will be updated after <b>{{leftRefreshTime}}</b> minutes</span>
                </b-col>
            </b-row>
            <hr class="white-border">
            <b-row>
                <b-col
                    cols="12"
                    md="6"
                >
                    <my-portfolio :portfolios="portfolios" :loading="chartLoading" />
                    <hr class="white-border">
                    <my-favorite :favorites="getFavorites" :loading="chartLoading" />
                </b-col>
                <b-col
                    cols="12"
                    md="6"
                >
                    <pie-chart :chartData="getChartData" :loading="chartLoading" />
                </b-col>
            </b-row>
            <b-modal
                ref="coin-modal"
                title="Coin List"
                scrollable
                hide-footer
                size="lg"
            >
                <b-form-input
                    v-model="searchSymbol"
                    placeholder="Search Symbol"
                ></b-form-input>
                <b-form-checkbox
                    class="mt-2"
                    id="showZero"
                    v-model="showZero"
                    name="showZero"
                    :value="true"
                    :unchecked-value="false"
                >
                Show bigger than "$0" values
                </b-form-checkbox>

                <first-modal-list
                    :coinList="coinList"
                    :favorites="favorites"
                    :portfolios="portfolios"
                    :showZero="showZero"
                    :search="clearTag(searchSymbol)"
                />
                <second-modal-list
                    :favorites="favorites"
                    :portfolios="portfolios"
                    :search="clearTag(searchSymbol)"
                />
                <div class="text-right">
                    <b-button
                        class="mt-3"
                        variant="outline-danger"
                        @click="closeStockModal"
                    >Close Me</b-button>
                </div>
            </b-modal>
        </b-container>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MyPortfolio from "./components/MyPortfolio.vue";
import MyFavorite from "./components/MyFavorite.vue";
import PieChart from "./components/PieChart.vue";
import FirstModalList from "./components/FirstModalList.vue";
import SecondModalList from "./components/SecondModalList.vue";

import moment from 'moment';
let self;
export default {
    name: "App",
    components: {
        MyPortfolio,
        MyFavorite,
        PieChart,
        FirstModalList,
        SecondModalList
    },
    computed: {
        ...mapGetters(["getChartData", "getFavorites"]),
        ...mapState(["chartLoading", "coinList", "portfolios", "favorites"]),
    },
    data() {
        return {
            showZero: true,
            searchSymbol: '',
            refreshMinute: 20,
            leftRefreshTime: ''
        };
    },
    methods: {
        clearTag(value){
            return value.replace(/(<([^>]+)>)/ig,"");
        },
        getCoinList() {
            this.$store.dispatch("coinListAction");
        },
        openStockModal() {
            this.$refs["coin-modal"].show();
        },
        closeStockModal() {
            this.$refs["coin-modal"].hide();
        },
        startTimer() {
            let now = moment().unix();
            let refreshTime = moment().add(this.refreshMinute, 'minutes').unix();
            let leftTime = refreshTime - now;
            let duration = moment.duration(leftTime, 'seconds');

            let interval = setInterval(function(){
                if (duration.asSeconds() <= 0) {
                    clearInterval(interval);
                    self.startTimer();
                    console.log('....Refresh....');
                    self.getCoinList();
                }

                duration = moment.duration(duration.asSeconds() - 1, 'seconds');

                self.leftRefreshTime = duration.minutes() + ":" + duration.seconds();
            }, 1000);
        }
    },
    mounted() {
        self = this;
        this.getCoinList();
        this.startTimer();
    },
};
</script>