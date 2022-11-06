<template>
    <div class="first-list">
        <loading :status="loading" />
        <table class="table table-bordered mt-4">
            <tr v-for="item in filteredList" :key="item.symbol">
                <td>
                    <template v-if="existsInFavorites(item.symbol)">
                        <b-icon icon="star-fill" class="curPointer" variant="warning" @click="removeCoinFavorite(item.symbol)"></b-icon>
                    </template>
                    <template v-else>
                        <b-icon icon="star" class="curPointer" variant="warning" @click="addCoinFavorite(item.symbol)"></b-icon>
                    </template>
                     {{item.symbol}}</td>
                <td>{{item.price | toCurrency}}</td>
                <td class="text-center">
                    <b-form-select
                        class="coin-pieces"
                        :value="1"
                        :options="getNumbers(1, 20)"
                        @change="coinPieceChange($event, item)"
                        :disabled="item.price==0"
                    ></b-form-select>
                </td>
                <td>
                    <b-button variant="success" block size="sm" :disabled="item.price==0" @click="addCoin(item)">
                        <b-icon-plus /> Add Stock
                    </b-button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: "FirstModalList",
    props:{
        search: {
            type: String,
            default: () => '',
        },
        coinList: {
            type: Array,
            default: () => [],
        },
        portfolios: {
            type: Array,
            default: () => [],
        },
        favorites: {
            type: Array,
            default: () => [],
        },
        showZero: {
            type: Boolean,
            default: () => true,
        },
    },
    computed: {
        filteredList() {
            return this.coinList.filter((coin) => {
                if(this.search.trim() == ''){
                    return false;
                }
                let regex = new RegExp(this.search.toLowerCase(), 'i');
                if(regex.test(coin.symbol.toLowerCase())){
                    if(!this.showZero && coin.price == 0){
                        return false;
                    }

                    let portfolioCoin = _.find(this.portfolios, (o) => {
                        return o.symbol == coin.symbol;
                    });
                    

                    if(!portfolioCoin){
                        return true;
                    }
                }
                return false;
            });
        },
    },
    data(){
        return {
            loading: false,
            coinUpdate: []
        }
    },
    methods: {
        existsInFavorites(symbol){
            return this.favorites.filter(item => {
                return item === symbol
            }).length > 0;
        },
        coinPieceChange(value, coin){
            let portfolioCoin = _.find(this.portfolios, (o) => {
                return o.symbol == coin.symbol;
            });

            this.coinUpdate = _.filter(this.coinUpdate, (o) => {
                return o.symbol !== coin.symbol;
            });

            if(!portfolioCoin || (portfolioCoin&&portfolioCoin.pieces !== value)){
                this.coinUpdate.push({symbol: coin.symbol, pieces: value});
            }
        },
        getNumbers(start, stop) {
            return new Array(stop - start).fill(start).map((n, i) => n + i);
        },
        addCoin(coin){
            let findChangeCoin = _.find(this.coinUpdate, (o) => {
                return o.symbol == coin.symbol;
            });

            this.$store.dispatch('addCoinAction', {
                symbol: coin.symbol,
                avgPrice: coin.avgPrice,
                pieces: findChangeCoin?findChangeCoin.pieces:1,
                pricePercent: coin.pricePercent,
                bgColor: coin.bgColor,
            });
        },
        addCoinFavorite(symbol){
            this.loading = true;

            this.$store.dispatch('addCoinFavoriteAction', symbol).then(() => {
                this.loading = false;
            });
        },

        removeCoinFavorite(symbol){
            this.loading = true;

            this.$store.dispatch('removeCoinFavoriteAction', symbol).then(() => {
                this.loading = false;
            });
        },
    }
}
</script>