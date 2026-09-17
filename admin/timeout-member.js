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

        const timeoutForm =
            document.getElementById(
                "timeoutForm"
            );

        const memberId =
            document.getElementById(
                "memberId"
            );

        const duration =
            document.getElementById(
                "duration"
            );

        const reason =
            document.getElementById(
                "reason"
            );

        const timeoutButton =
            document.getElementById(
                "timeoutButton"
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

            timeoutButton.disabled =
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
        // TIMEOUT
        // =====================================================

        timeoutForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const targetUserId =
                    memberId.value.trim();

                let timeoutDuration =
                    duration.value
                        .trim()
                        .toLowerCase();

                let timeoutReason =
                    reason.value.trim();


                // ---------------------------------------------
                // MEMBER ID
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
                // DURATION
                // ---------------------------------------------

                if (!timeoutDuration) {

                    statusText.textContent =
                        "Please enter a timeout duration.";

                    duration.focus();

                    return;

                }


                // Basic format check:
                // 10m
                // 2h
                // 3d
                // 1w

                if (
                    !/^\d+\s*[mhdw]$/.test(
                        timeoutDuration
                    )
                ) {

                    statusText.textContent =
                        "Use a duration such as 10m, 2h, 3d, or 1w.";

                    duration.focus();

                    return;

                }


                timeoutDuration =
                    timeoutDuration.replace(
                        /\s+/g,
                        ""
                    );


                // ---------------------------------------------
                // REASON
                // ---------------------------------------------

                if (!timeoutReason) {

                    timeoutReason =
                        "No reason provided.";

                }


                // ---------------------------------------------
                // SUBMITTING STATE
                // ---------------------------------------------

                timeoutButton.disabled =
                    true;

                timeoutButton.textContent =
                    "SUBMITTING...";

                statusText.textContent =
                    "Sending timeout request...";


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
                                    "timeout",

                                guild_id:
                                    GUILD_ID,

                                moderator_id:
                                    moderatorDiscordId,

                                target_user_id:
                                    targetUserId,

                                reason:
                                    timeoutReason,

                                bot_key:
                                    "daboyz",

                                status:
                                    "pending",

                                duration:
                                    timeoutDuration

                            });


                    if (error) {

                        console.error(
                            "Timeout request error:",
                            error
                        );

                        statusText.textContent =
                            "Unable to submit timeout request: " +
                            error.message;

                        return;

                    }


                    // -----------------------------------------
                    // SUCCESS
                    // -----------------------------------------

                    statusText.textContent =
                        "Timeout request submitted successfully.";


                    memberId.value =
                        "";

                    duration.value =
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

                    timeoutButton.disabled =
                        false;

                    timeoutButton.textContent =
                        "ISSUE TIMEOUT";

                }

            }
        );

    }
);