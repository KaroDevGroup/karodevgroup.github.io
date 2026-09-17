const SUPABASE_URL =
    "https://awpiwexmgyvcqxjxqyjr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_AGV5jYxtDPactSQudssimQ_MbWzhBUO";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


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


        // -------------------------------------------------
        // CHECK SESSION
        // -------------------------------------------------

        const {
            data: sessionData
        } =
            await supabaseClient.auth
                .getSession();


        const session =
            sessionData.session;


        if (!session) {

            window.location.href =
                "index.html";

            return;

        }


        // -------------------------------------------------
        // VERIFY ADMIN
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


        if (
            error ||
            !profile ||
            !profile.is_active
        ) {

            await supabaseClient.auth
                .signOut();


            window.location.href =
                "index.html";

            return;

        }


        // -------------------------------------------------
        // DISPLAY ADMIN
        // -------------------------------------------------

        adminName.textContent =
            profile.display_name ||
            "Administrator";


        adminRole.textContent =
            (
                profile.role_name ||
                "Admin"
            ).toUpperCase();

    }
);