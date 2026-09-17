// =========================================================
// DABOYZ ADMIN PORTAL
// SUPABASE AUTHENTICATION
// =========================================================

const SUPABASE_URL =
    "https://awpiwexmgyvcqxjxqyjr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_AGV5jYxtDPactSQudssimQ_MbWzhBUO";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const loginForm =
            document.getElementById("loginForm");

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");

        const loginError =
            document.getElementById("loginError");


        // -------------------------------------------------
        // CHECK FOR EXISTING SESSION
        // -------------------------------------------------

        const {
            data: sessionData
        } =
            await supabaseClient.auth.getSession();


        if (sessionData.session) {

            const authorized =
                await verifyAdmin(
                    sessionData.session.user.id
                );


            if (authorized) {

                window.location.href =
                    "dashboard.html";

                return;

            }


            await supabaseClient.auth.signOut();

        }


        // -------------------------------------------------
        // LOGIN
        // -------------------------------------------------

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                loginError.textContent = "";


                const email =
                    emailInput.value.trim();

                const password =
                    passwordInput.value;


                if (!email || !password) {

                    loginError.textContent =
                        "Email and password are required.";

                    return;

                }


                const loginButton =
                    loginForm.querySelector(
                        ".login-button"
                    );


                loginButton.disabled = true;
                loginButton.textContent =
                    "SIGNING IN...";


                try {

                    // -------------------------------------
                    // SUPABASE AUTH LOGIN
                    // -------------------------------------

                    const {
                        data,
                        error
                    } =
                        await supabaseClient.auth
                            .signInWithPassword({
                                email: email,
                                password: password
                            });


                    if (error) {

                        loginError.textContent =
                            "Invalid email or password.";

                        return;

                    }


                    if (!data.user) {

                        loginError.textContent =
                            "Unable to identify the signed-in user.";

                        return;

                    }


                    // -------------------------------------
                    // CHECK ADMIN PROFILE
                    // -------------------------------------

                    const admin =
                        await getAdminProfile(
                            data.user.id
                        );


                    if (!admin) {

                        await supabaseClient.auth
                            .signOut();


                        loginError.textContent =
                            "This account is not authorized to access the Admin Portal.";

                        return;

                    }


                    // -------------------------------------
                    // CHECK ACCOUNT ACTIVE
                    // -------------------------------------

                    if (!admin.is_active) {

                        await supabaseClient.auth
                            .signOut();


                        loginError.textContent =
                            "This administrator account is disabled.";

                        return;

                    }


                    // -------------------------------------
                    // SAVE NON-SENSITIVE PROFILE INFO
                    // -------------------------------------

                    sessionStorage.setItem(
                        "adminDisplayName",
                        admin.display_name
                    );

                    sessionStorage.setItem(
                        "adminRole",
                        admin.role_name
                    );

                    sessionStorage.setItem(
                        "adminDiscordId",
                        admin.discord_user_id
                    );


                    // -------------------------------------
                    // REDIRECT
                    // -------------------------------------

                    window.location.href =
                        "dashboard.html";

                }
                catch (error) {

                    console.error(error);

                    loginError.textContent =
                        "Unable to connect to the authentication server.";

                }
                finally {

                    loginButton.disabled = false;

                    loginButton.textContent =
                        "SIGN IN";

                }

            }
        );

    }
);


// =========================================================
// GET ADMIN PROFILE
// =========================================================

async function getAdminProfile(userId) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("admin_profiles")
            .select(
                `
                user_id,
                discord_user_id,
                display_name,
                role_name,
                is_active
                `
            )
            .eq(
                "user_id",
                userId
            )
            .limit(1)
            .maybeSingle();


    if (error) {

        console.error(
            "Admin profile lookup failed:",
            error
        );

        return null;

    }


    return data;

}


// =========================================================
// VERIFY ADMIN
// =========================================================

async function verifyAdmin(userId) {

    const admin =
        await getAdminProfile(userId);


    if (!admin) {

        return false;

    }


    if (!admin.is_active) {

        return false;

    }


    sessionStorage.setItem(
        "adminDisplayName",
        admin.display_name
    );

    sessionStorage.setItem(
        "adminRole",
        admin.role_name
    );

    sessionStorage.setItem(
        "adminDiscordId",
        admin.discord_user_id
    );


    return true;

}