// =========================================================
// DABOYZ ADMIN DASHBOARD
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

        const adminName =
            document.getElementById(
                "adminName"
            );

        const adminRole =
            document.getElementById(
                "adminRole"
            );

        const welcomeName =
            document.getElementById(
                "welcomeName"
            );

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        // -------------------------------------------------
        // GET CURRENT SESSION
        // -------------------------------------------------

        const {
            data: sessionData
        } =
            await supabaseClient.auth
                .getSession();


        const session =
            sessionData.session;


        // -------------------------------------------------
        // NOT LOGGED IN
        // -------------------------------------------------

        if (!session) {

            window.location.href =
                "index.html";

            return;

        }


        // -------------------------------------------------
        // GET ADMIN PROFILE
        // -------------------------------------------------

        const {
            data: profile,
            error
        } =
            await supabaseClient
                .from(
                    "admin_profiles"
                )
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
                    session.user.id
                )
                .limit(1)
                .maybeSingle();


        // -------------------------------------------------
        // INVALID ADMIN
        // -------------------------------------------------

        if (
            error ||
            !profile ||
            !profile.is_active
        ) {

            console.error(
                "Admin validation failed:",
                error
            );


            await supabaseClient.auth
                .signOut();


            window.location.href =
                "index.html";

            return;

        }


        // -------------------------------------------------
        // DISPLAY ADMIN INFO
        // -------------------------------------------------

        const displayName =
            profile.display_name ||
            "Administrator";


        const roleName =
            profile.role_name ||
            "Admin";


        adminName.textContent =
            displayName;


        adminRole.textContent =
            roleName.toUpperCase();


        welcomeName.textContent =
            displayName;


        // -------------------------------------------------
        // LOGOUT
        // -------------------------------------------------

        logoutButton.addEventListener(
            "click",
            async () => {

                logoutButton.disabled =
                    true;

                logoutButton.textContent =
                    "LOGGING OUT...";


                await supabaseClient.auth
                    .signOut();


                sessionStorage.clear();


                window.location.href =
                    "index.html";

            }
        );

    }
);