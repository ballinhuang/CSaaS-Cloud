import jq from 'jquery';
class WebAPI {

	logout() {
		jq.get('/logout', (data) => {
			window.location.href = data.redirect;
		});
	}

	getUserName(success, fail, always) {
		jq.get('/api/uses/username', success).fail(fail).always(always);
	}

}

export default new WebAPI();