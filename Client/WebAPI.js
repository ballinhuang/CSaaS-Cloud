import VueResource from 'vue-resource';
import Vue from 'vue';

Vue.use(VueResource);

class WebAPI {

	logout() {
		//Vue.http.get('/logout')
		window.location = "./logout";
	}

	changepasswd(msg, success, fail) {
		let changepasswdmsg = {
			$changepasswd: msg
		}
		Vue.http.patch('/api/uses/user', changepasswdmsg).then(success, fail)
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
		Vue.http.post('/api/cluster', msg).then(success, fail)
	}

	adduser(msg, success, fail) {
		let addusermsg = {
			$adduser: msg
		}
		Vue.http.patch('/api/uses/user', addusermsg).then(success, fail)
	}

	setcluster(msg, success, fail) {
		let setclustermsg = {
			$setusercluster: msg
		}
		Vue.http.patch('/api/uses/user', setclustermsg).then(success, fail)
	}

	setclusteruser(msg, success, fail) {
		let setclusterusermsg = {
			$setclusteruser: msg
		}
		Vue.http.patch('/api/uses/user', setclusterusermsg).then(success, fail)
	}

	operatecluster(clustername, operate, success, fail) {
		let operateclustermsg = {
			clustername: clustername,
			operate: operate
		}
		Vue.http.post('/api/opcluster', operateclustermsg).then(success, fail)
	}

	getschfile(dir, success, fail) {
		Vue.http.get(`/api/getschfile/${dir}`).then(success, fail);
	}
}

export default new WebAPI();