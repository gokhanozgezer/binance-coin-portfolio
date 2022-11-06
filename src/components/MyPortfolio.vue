<template>
    <div class="my-portfolio">
        <h4 class="text-light">My Assets</h4>
        <div class="spinner-border text-light" role="status" v-if="loading">
            <span class="sr-only">Loading...</span>
        </div>
        <template v-else>
            <b-alert show variant="dark" v-if="portfolios.length == 0">Assets information not found</b-alert>
            <b-card
                v-for="coin in portfolios"
                :key="coin.symbol"
                class="mb-4"
            >
                <b-row>
                    <b-col
                        cols="6"
                        class="text-left"
                    >
                        <strong>{{coin.symbol}}</strong><br>
                        <b-icon-coin variant="warning" /> x <b-form-select
                            class="coin-pieces"
                            :value="coin.pieces"
                            :options="getNumbers(1, 20)"
                            @change="coinPieceChange($event, coin)"
                        ></b-form-select> <small>pieces</small>
                    </b-col>
                    <b-col
                        cols="6"
                        class="text-right"
                    >
                        <strong class="text-success">{{(coin.avgPrice * coin.pieces) | toCurrency}}</strong><br>
                        <small
                            v-b-tooltip.hover
                            title="Weighted Average Price"
                            class="mb-2 d-block"
                        >{{coin.avgPrice | toCurrency}} ~ {{coin.pricePercent}} %</small>

                        <b-button size="sm" variant="primary" :disabled="coinChangeControl(coin.symbol)" @click="updateCoin(coin)">
                            <b-icon-save /> Update
                        </b-button>
                        <b-button
                            size="sm"
                            variant="danger"
                            class="ml-2"
                            @click="removeCoin(coin.symbol)"
                        >
                            <b-icon-trash-fill /> Remove
                        </b-button>
                    </b-col>
                </b-row>
            </b-card>
        </template>
    </div>
</template>

<script>
import _ from 'lodash';

export default {
    name: "MyPortfolio",
    props: {
        loading: {
            type: Boolean,
            default: () => false,
        },
        portfolios: {
            type: Array,
            default: () => [],
        },
    },
    data(){
        return {
            coinUpdate: []
        }
    },
    methods: {
        coinPieceChange(value, coin){
            let portfolioCoin = _.find(this.portfolios, (o) => {
                return o.symbol == coin.symbol;
            });

            this.coinUpdate = _.filter(this.coinUpdate, (o) => {
                return o.symbol !== coin.symbol;
            });

            if(portfolioCoin.pieces !== value){
                this.coinUpdate.push({symbol: coin.symbol, pieces: value});
            }
        },
        getNumbers(start, stop) {
            return new Array(stop - start).fill(start).map((n, i) => n + i);
        },
        coinChangeControl(symbol){
            return _.size(_.filter(this.coinUpdate, (o) => {
                return o.symbol === symbol;
            }))==0;
        },
        updateCoin(coin){
            let findChangeCoin = _.find(this.coinUpdate, (o) => {
                return o.symbol == coin.symbol;
            });
            
            this.$store.dispatch('updateCoinAction', {
                symbol: coin.symbol,
                pieces: findChangeCoin?findChangeCoin.pieces:1,
            });
        },
        removeCoin(symbol){
            this.$store.dispatch('removeCoinAction', { symbol });
        }
    },
};
</script>