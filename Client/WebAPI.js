import VueResource from 'vue-resource';
import Vue from 'vue';

Vue.use(VueResource);

class WebAPI {

	logout() {
		Vue.http.get('/logout').then(response => {
			window.location.href = response.body.redirect;
		}, response => {
		});
	}

	getUserName(success, fail) {
		Vue.http.get('/api/uses/username').then(success, fail);
	}

	getUser(success, fail) {
		Vue.http.get('/api/uses/user').then(success, fail);
	}

}

export default new WebAPI();