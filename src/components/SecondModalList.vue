<template>
    <div class="second-list">
        <loading :status="loading" />
        <table class="table table-bordered">
            <tr v-for="item in filteredList" :key="item.symbol">
                <td>
                    <template v-if="existsInFavorites(item.symbol)">
                        <b-icon icon="star-fill" class="curPointer" variant="warning" @click="removeCoinFavorite(item.symbol)"></b-icon>
                    </template>
                    <template v-else>
                        <b-icon icon="star" class="curPointer" variant="warning" @click="addCoinFavorite(item.symbol)"></b-icon>
                    </template>
                    {{item.symbol}}</td>
                <td>{{item.avgPrice | toCurrency}} <br> <small class="text-success">{{(item.avgPrice * item.pieces) | toCurrency}}</small></td>
                <td class="text-center">
                    <b-form-select
                        class="coin-pieces"
                        :value="item.pieces"
                        :options="getNumbers(1, 20)"
                        @change="coinPieceChange($event, item)"
                        :disabled="item.price==0"
                    ></b-form-select>
                </td>
                <td>
                    <b-button size="sm" variant="primary" :disabled="coinChangeControl(item.symbol)" @click="updateCoin(item)">
                        <b-icon-save /> Update
                    </b-button>
                    <b-button
                        size="sm"
                        variant="danger"
                        class="ml-2"
                        @click="removeCoin(item.symbol)"
                    >
                        <b-icon-trash-fill /> Remove
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
        favorites: {
            type: Array,
            default: () => [],
        },
        portfolios: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        filteredList() {
            return this.portfolios.filter((coin) => {
                if(this.search.trim() == ''){
                    return false;
                }

                let regex = new RegExp(this.search.toLowerCase(), 'i');

                return regex.test(coin.symbol.toLowerCase());
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

            if(portfolioCoin.pieces !== value){
                this.coinUpdate.push({symbol: coin.symbol, pieces: value});
            }
        },
        coinChangeControl(symbol){
            return _.size(_.filter(this.coinUpdate, (o) => {
                return o.symbol === symbol;
            }))==0;
        },
        getNumbers(start, stop) {
            return new Array(stop - start).fill(start).map((n, i) => n + i);
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