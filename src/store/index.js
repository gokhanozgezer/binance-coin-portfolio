import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

const ApiURL = 'https://api2.binance.com/api/v3/';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        chartLoading: true,
        coinList: [],
        chartData: {},
        portfolios: [],
        favorites: [],
    },
    getters: {
        getCoinList: state => state.coinList,
        getFavorites: state => {
            return _.filter(state.coinList, (coin) => {
                return _.includes(state.favorites, coin.symbol);
            });
        },
        getChartData: state => {
            let labels = [];
            let data = [];
            let backgroundColor = [];
            _.forEach(state.portfolios, (value) => {
                labels.push(value.symbol);
                data.push(value.pieces);
                backgroundColor.push(value.bgColor);
            });

            return {
                labels: [...labels],
                datasets: [{ backgroundColor, data }]
            };
        },
        getPortfolios: state => state.portfolios,
        getLoadingStatus: state => state.chartLoading,
    },
    mutations: {
        setCoinList(state, payload) {
            state.coinList = _.map(payload, (coin) => { return { symbol: coin.symbol, price: Number(coin.lastPrice), avgPrice: Number(coin.weightedAvgPrice), pricePercent: coin.priceChangePercent, bgColor: '#'+Math.floor(Math.random()*16777215).toString(16) }; });
        },
        setPortfolios(state, payload) {
            state.portfolios = payload;
        },
        setFavorites(state, payload) {
            state.favorites = payload;
        },
        setLoadingStatus(state, payload) {
            state.chartLoading = payload;
        }
    },
    actions: {
        coinListAction({ commit }) {
            commit('setLoadingStatus', true);
            new Promise(async (resolve, reject) => {
                try {
                    const response = await fetch(`${ApiURL}ticker/24hr`);
                    const data = await response.json();
                    commit('setCoinList', data);
                    commit('setLoadingStatus', false);

                    resolve(true);
                } catch (error) {
                    commit('setLoadingStatus', false);
                    reject(error);
                }
            });
        },
        addCoinAction({ commit, state }, payload) {
            let portfolios = state.portfolios;
            portfolios.push(payload);

            commit('setPortfolios', portfolios);
        },
        updateCoinAction({ commit, state }, payload) {
            let portfolios = state.portfolios;
            let coinIndex = _.findIndex(portfolios, { symbol: payload.symbol });
            portfolios[coinIndex].pieces = payload.pieces;

            commit('setPortfolios', portfolios);
        },
        removeCoinAction({ commit, state }, payload) {
            let portfolios = state.portfolios;
            let coinIndex = _.findIndex(portfolios, { symbol: payload.symbol });
            portfolios.splice(coinIndex, 1);

            commit('setPortfolios', portfolios);
        },
        addCoinFavoriteAction({ commit, state }, payload) {
            return new Promise((resolve, reject) => {

                let favorites = state.favorites;
                favorites.push(payload);
    
                commit('setFavorites', favorites);

                resolve(true);
            })
        },
        removeCoinFavoriteAction({ commit, state }, symbol) {
            return new Promise((resolve, reject) => {
                let favorites = state.favorites;
                let coinIndex = _.findIndex(favorites, function(coin) { return coin === symbol; });

                favorites.splice(coinIndex, 1);

                commit('setFavorites', favorites);
                
                resolve(true);
            })
        }
    }
});
