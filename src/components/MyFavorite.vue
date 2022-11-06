<template>
    <div class="my-favorite">
        <h4 class="text-light">My Favorites</h4>
        <div class="spinner-border text-light" role="status" v-if="loading">
            <span class="sr-only">Loading...</span>
        </div>
        <template v-else>
            <b-alert show variant="dark" v-if="favorites.length == 0">Favorites information not found</b-alert>
            <b-card v-for="coin in favorites" :key="coin.symbol" class="mb-4">
                <b-row>
                    <b-col cols="6" class="text-left">
                        <b-icon icon="star-fill" class="curPointer" variant="warning" @click="removeCoinFavorite(coin.symbol)"></b-icon> <strong>{{coin.symbol}}</strong>
                    </b-col>
                    <b-col cols="6" class="text-right">
                        <strong class="text-success">{{coin.avgPrice | toCurrency}}</strong><br>
                        <small v-b-tooltip.hover title="Weighted Average Price">{{coin.pricePercent}} %</small>
                    </b-col>
                </b-row>
            </b-card>
        </template>
    </div>
</template>

<script>
export default {
    name: "MyFavorite",
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        favorites: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        removeCoinFavorite(symbol){
            this.$store.dispatch('removeCoinFavoriteAction', symbol);
        },
    },
};
</script>