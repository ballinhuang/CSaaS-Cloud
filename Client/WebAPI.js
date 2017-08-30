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

	subjob(msg, success, fail) {
		Vue.http.post('/api/subjob', msg).then(success, fail);
	}

	addcluster(msg, success, fail) {
		let modeusermsg = {
			$addcluster: msg
		}
		Vue.http.patch('/api/uses/user', modeusermsg).then(success, fail)
	}

	adduser(msg, success, fail) {
		let addusermsg = {
			$adduser: msg
		}
		Vue.http.patch('/api/uses/user', addusermsg).then(success, fail)
	}
}

export default new WebAPI();