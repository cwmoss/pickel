class app_auth {
    state;
    profile = {};
    expires = 0;
    settings = {};
    endpoint = "/auth";
    first_login;

    constructor() {
        this.init();
    }

    init() {
        this.first_login = this.login_silent();
        // this.check_expire();
    }
    logged_out() {
        this.profile = null;
        this.expires = 0;
        this.first_login = false;
    }
    async check_expire(redirect) {
        const expired = this.expires < Date.now();
        // console.log("+++ expired?", expired);
        if (!expired) return true;

        const ok = await this.login_silent();
        if (ok === false && redirect) {
            this.redirect(redirect);
        }
        return ok;
    }

    async _setup_profile(resp) {
        console.log("++ setup profile", resp.user);
        this.expires = (resp.user.expires_ts - 60) * 1000;
        const profile = {
            uname: resp.user.uname, roles: resp.user.roles ?? [], default_role: resp.user.default_role,
            avatar: resp.user.avatar, id: resp.user.id, email: resp.user.email,
            orgid: resp.user.orgid
        };
        console.log("++ setup profile", profile);
        return profile;
    }
    async login_from_wc(resp) {
        return await this._setup_profile(resp);
    }
    async login_silent() {
        const resp = await this.post("/refresh_access_token");
        if (resp.ok === true) {
            console.log("resp++", resp);
            return await this._setup_profile(resp);
        }
        return false;
    }

    async post(path, data = {}) {
        console.log("service post", path);

        // let $rslt = [$ok => 'true'];
        // return $rslt;

        return fetch(`${this.endpoint}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": this.csrf_token(),
            },
            credentials: "include",
            body: JSON.stringify(data),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log("RESP", resp);
                if (resp.errors) {
                    //const errors = new BobApiErrors(resp.errors);
                    //resp.errors = errors.toArray();
                    //if (errors.haveFatalError() || errors.haveAuthError() || errors.haveInternalError()) {
                    //    console.error(errors);
                    //    throw errors;
                    //}
                }
                this.resetTimer();
                return resp;
            });
    }

    resetTimer() { }

    csrf_token() {
        return "";
    }
}

class auth_result {
    constructor(data) { }
}

export default new app_auth();
