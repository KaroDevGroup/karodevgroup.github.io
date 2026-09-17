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

        const unbanForm =
            document.getElementById(
                "unbanForm"
            );

        const userId =
            document.getElementById(
                "userId"
            );

        const reason =
            document.getElementById(
                "reason"
            );

        const unbanButton =
            document.getElementById(
                "unbanButton"
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

            unbanButton.disabled =
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
        // UNBAN MEMBER
        // =====================================================

        unbanForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const targetUserId =
                    userId.value.trim();

                let unbanReason =
                    reason.value.trim();


                // ---------------------------------------------
                // VALIDATE USER ID
                // ---------------------------------------------

                if (!targetUserId) {

                    statusText.textContent =
                        "Please enter a Discord user ID.";

                    userId.focus();

                    return;

                }


                if (!/^\d+$/.test(targetUserId)) {

                    statusText.textContent =
                        "The Discord user ID is invalid.";

                    userId.focus();

                    return;

                }


                // ---------------------------------------------
                // REASON
                // ---------------------------------------------

                if (!unbanReason) {

                    unbanReason =
                        "No reason provided";

                }


                // ---------------------------------------------
                // SUBMIT
                // ---------------------------------------------

                unbanButton.disabled =
                    true;

                unbanButton.textContent =
                    "SUBMITTING...";

                statusText.textContent =
                    "Sending unban request...";


                try {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from(
                                "moderation_requests"
                            )
                            .insert({

                                action:
                                    "unban",

                                guild_id:
                                    GUILD_ID,

                                moderator_id:
                                    moderatorDiscordId,

                                target_user_id:
                                    targetUserId,

                                reason:
                                    unbanReason,

                                bot_key:
                                    "daboyz",

                                status:
                                    "pending"

                            });


                    if (error) {

                        console.error(
                            "Unban request error:",
                            error
                        );

                        statusText.textContent =
                            "Unable to submit unban request: " +
                            error.message;

                        return;

                    }


                    statusText.textContent =
                        "Unban request submitted successfully.";


                    userId.value =
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

                    unbanButton.disabled =
                        false;

                    unbanButton.textContent =
                        "UNBAN MEMBER";

                }

            }
        );

    }
);