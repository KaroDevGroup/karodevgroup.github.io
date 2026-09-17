const SUPABASE_URL =
    "https://awpiwexmgyvcqxjxqyjr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_AGV5jYxtDPactSQudssimQ_MbWzhBUO";

const GUILD_ID =
    "908868924488171540";


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

        const warnForm =
            document.getElementById(
                "warnForm"
            );

        const memberId =
            document.getElementById(
                "memberId"
            );

        const reason =
            document.getElementById(
                "reason"
            );

        const warnButton =
            document.getElementById(
                "warnButton"
            );

        const statusText =
            document.getElementById(
                "statusText"
            );


        let moderatorDiscordId = null;


        // =====================================================
        // SESSION
        // =====================================================

        const {
            data: sessionData,
            error: sessionError
        } =
            await supabaseClient.auth
                .getSession();


        if (
            sessionError ||
            !sessionData.session
        ) {

            window.location.href =
                "index.html";

            return;

        }


        const session =
            sessionData.session;


        // =====================================================
        // ADMIN PROFILE
        // =====================================================

        const {
            data: profile,
            error: profileError
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


        if (
            profileError ||
            !profile ||
            !profile.is_active
        ) {

            await supabaseClient.auth
                .signOut();

            window.location.href =
                "index.html";

            return;

        }


        moderatorDiscordId =
            profile.discord_user_id;


        if (!moderatorDiscordId) {

            statusText.textContent =
                "Your Discord account is not linked.";

            warnButton.disabled =
                true;

            return;

        }


        adminName.textContent =
            profile.display_name ||
            "Administrator";


        adminRole.textContent =
            (
                profile.role_name ||
                "Admin"
            ).toUpperCase();


        // =====================================================
        // WARN
        // =====================================================

        warnForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const targetUserId =
                    memberId.value.trim();

                let warningReason =
                    reason.value.trim();


                // ---------------------------------------------
                // VALIDATE USER ID
                // ---------------------------------------------

                if (!targetUserId) {

                    statusText.textContent =
                        "Please enter a Discord member ID.";

                    memberId.focus();

                    return;

                }


                if (!/^\d+$/.test(targetUserId)) {

                    statusText.textContent =
                        "The member ID is invalid.";

                    memberId.focus();

                    return;

                }


                // Same behavior as desktop app

                if (!warningReason) {

                    warningReason =
                        "No reason provided";

                }


                // ---------------------------------------------
                // SUBMITTING STATE
                // ---------------------------------------------

                warnButton.disabled =
                    true;

                warnButton.textContent =
                    "SUBMITTING...";

                statusText.textContent =
                    "Sending warning request...";


                try {

                    // -----------------------------------------
                    // CREATE MODERATION REQUEST
                    // -----------------------------------------

                    const {
                        error
                    } =
                        await supabaseClient
                            .from(
                                "moderation_requests"
                            )
                            .insert({

                                action:
                                    "warn",

                                guild_id:
                                    GUILD_ID,

                                moderator_id:
                                    moderatorDiscordId,

                                target_user_id:
                                    targetUserId,

                                reason:
                                    warningReason,

                                bot_key:
                                    "daboyz",

                                status:
                                    "pending"

                            });


                    if (error) {

                        console.error(
                            "Warning request error:",
                            error
                        );

                        statusText.textContent =
                            "Unable to submit warning request: " +
                            error.message;

                        return;

                    }


                    // -----------------------------------------
                    // SUCCESS
                    // -----------------------------------------

                    statusText.textContent =
                        "Warning request submitted successfully.";


                    memberId.value =
                        "";

                    reason.value =
                        "";

                }
                catch (error) {

                    console.error(
                        error
                    );

                    statusText.textContent =
                        "Moderation request failed: " +
                        error.message;

                }
                finally {

                    warnButton.disabled =
                        false;

                    warnButton.textContent =
                        "ISSUE WARNING";

                }

            }
        );

    }
);