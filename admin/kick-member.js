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

        const kickForm =
            document.getElementById(
                "kickForm"
            );

        const memberId =
            document.getElementById(
                "memberId"
            );

        const reason =
            document.getElementById(
                "reason"
            );

        const kickButton =
            document.getElementById(
                "kickButton"
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

            kickButton.disabled =
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
        // KICK MEMBER
        // =====================================================

        kickForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const targetUserId =
                    memberId.value.trim();

                let kickReason =
                    reason.value.trim();


                // ---------------------------------------------
                // VALIDATE MEMBER
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


                // ---------------------------------------------
                // REASON
                // ---------------------------------------------

                if (!kickReason) {

                    kickReason =
                        "No reason provided.";

                }


                // ---------------------------------------------
                // SUBMITTING
                // ---------------------------------------------

                kickButton.disabled =
                    true;

                kickButton.textContent =
                    "SUBMITTING...";

                statusText.textContent =
                    "Sending kick request...";


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
                                    "kick",

                                guild_id:
                                    GUILD_ID,

                                moderator_id:
                                    moderatorDiscordId,

                                target_user_id:
                                    targetUserId,

                                reason:
                                    kickReason,

                                bot_key:
                                    "daboyz",

                                status:
                                    "pending"

                            });


                    if (error) {

                        console.error(
                            "Kick request error:",
                            error
                        );

                        statusText.textContent =
                            "Unable to submit kick request: " +
                            error.message;

                        return;

                    }


                    // -----------------------------------------
                    // SUCCESS
                    // -----------------------------------------

                    statusText.textContent =
                        "Kick request submitted successfully.";


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

                    kickButton.disabled =
                        false;

                    kickButton.textContent =
                        "KICK MEMBER";

                }

            }
        );

    }
);