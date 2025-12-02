import bus from "./bus.js";
import gql from "./gql.js";

let q_fetch_profile = gql`
    query owner__GetProfileInit($id: uuid!) {
        profile: profiles_by_pk(id: $id) {
            id
            email
            extrapoints
            is_active
            position

            t1
            t2
            t3
            username
            avatar
        }

        settings: competition_by_pk(id: true) {
            id
            starts_at
            finals_starts_at
            final_match
            groups
            recent_match_no
            name
            version
        }

        spruch: random_keks {
            baecker
            keks
        }
    }
`;

let q_activate = gql`
    mutation owner__ActivateProfile($id: uuid!) {
        update_profiles_by_pk(
            pk_columns: { id: $id }
            _set: { is_active: true }
        ) {
            is_active
        }
    }
`;

class app_auth {
    state;
    profile = {};
    expires = 0;
    settings = {};
    graphql;
    endpoint = "/auth";
    first_login;

    constructor() { }

    init(graphql) {
        this.graphql = graphql;
        this.first_login = this.login_silent();
        // this.check_expire();
    }

    async fetch_profile(id, roles) {
        console.log("+++ fetch profile via graphql-client");
        let result = await this.graphql.fetch(q_fetch_profile, {
            id: id,
        });
        console.log("++++ hasura result profile", roles, result);
        if (!result.profile) return "hasura-profile-not-found";

        this.profile = { ...result.profile };
        this.profile.roles = roles ? roles : [];

        if (result.settings) {
            this.settings = result.settings;
        }
        return this.profile;
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
        this._expires = (resp.user.expires_ts - 60) * 1000;
        const profile = await this.fetch_profile(resp.user.id, resp.user.roles);
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
