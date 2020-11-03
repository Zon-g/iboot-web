import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        user: {},
        menus: [],
        perms: []
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        delToken(state) {
            state.token = "";
        },
        setUser(state, user) {
            state.user = user;
        },
        delUser(state) {
            state.user = {};
        },
        setMenus(state, menus) {
            state.menus = menus;
        },
        delMenus(state) {
            state.menus = [];
        },
        setPerms(state, perms) {
            state.perms = perms;
        },
        delPerms(state) {
            state.perms = [];
        }
    },
    actions: {},
    modules: {}
})
