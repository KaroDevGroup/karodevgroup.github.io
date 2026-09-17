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

        const clearForm =
            document.getElementById(
                "clearForm"
            );

        const channelId =
            document.getElementById(
                "channelId"
            );

        const amount =
            document.getElementById(
                "amount"
            );

        const clearButton =
            document.getElementById(
                "clearButton"
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

            clearButton.disabled =
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
        // CLEAR MESSAGES
        // =====================================================

        clearForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const targetChannelId =
                    channelId.value.trim();

                const messageAmount =
                    Number.parseInt(
                        amount.value.trim(),
                        10
                    );


                // ---------------------------------------------
                // CHANNEL ID
                // ---------------------------------------------

                if (!targetChannelId) {

                    statusText.textContent =
                        "Please enter a Discord channel ID.";

                    channelId.focus();

                    return;

                }


                if (!/^\d+$/.test(targetChannelId)) {

                    statusText.textContent =
                        "The Discord channel ID is invalid.";

                    channelId.focus();

                    return;

                }


                // ---------------------------------------------
                // MESSAGE AMOUNT
                // ---------------------------------------------

                if (
                    !Number.isInteger(
                        messageAmount
                    )
                ) {

                    statusText.textContent =
                        "Please enter a valid message amount.";

                    amount.focus();

                    return;

                }


                if (
                    messageAmount < 1 ||
                    messageAmount > 100
                ) {

                    statusText.textContent =
                        "Message amount must be between 1 and 100.";

                    amount.focus();

                    return;

                }


                // ---------------------------------------------
                // SUBMITTING
                // ---------------------------------------------

                clearButton.disabled =
                    true;

                clearButton.textContent =
                    "SUBMITTING...";

                statusText.textContent =
                    "Sending clear request...";


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
                                    "clear",

                                guild_id:
                                    GUILD_ID,

                                moderator_id:
                                    moderatorDiscordId,

                                target_user_id:
                                    "0",

                                channel_id:
                                    targetChannelId,

                                reason:
                                    "Clear messages",

                                bot_key:
                                    "daboyz",

                                status:
                                    "pending",

                                amount:
                                    messageAmount

                            });


                    if (error) {

                        console.error(
                            "Clear request error:",
                            error
                        );

                        statusText.textContent =
                            "Unable to submit clear request: " +
                            error.message;

                        return;

                    }


                    statusText.textContent =
                        "Clear request submitted successfully.";


                    channelId.value =
                        "";

                    amount.value =
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

                    clearButton.disabled =
                        false;

                    clearButton.textContent =
                        "CLEAR MESSAGES";

                }

            }
        );

    }
);