import React from "react";

const Privacy = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#07110A",
                color: "#ECE4D8",
                padding: "60px 20px",
            }}
        >
            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    background: "#101713",
                    border: "1px solid rgba(214,161,75,.12)",
                    borderRadius: "30px",
                    padding: "50px",
                }}
            >
                <div
                    style={{
                        color: "#D6A14B",
                        letterSpacing: "4px",
                        fontSize: "12px",
                        marginBottom: "15px",
                    }}
                >
                    JURASSIC JOURNEY
                </div>

                <h1
                    style={{
                        fontFamily: "Cinzel",
                        fontSize: "48px",
                        marginBottom: "15px",
                    }}
                >
                    Privacy Policy
                </h1>

                <p style={{ color: "#888" }}>
                    Last updated: August 8, 2026
                </p>

                <Section title="1. Information We Collect">
                    Jurassic Journey may collect information required to
                    provide the application's features, including account
                    information, quiz activity, scores, progress, and
                    leaderboard information.
                </Section>

                <Section title="2. How We Use Information">
                    Information is used to provide quiz functionality,
                    maintain your progress, calculate scores, display
                    rankings, and improve the overall Jurassic Journey
                    experience.
                </Section>

                <Section title="3. Quiz and Progress Data">
                    Your quiz attempts, answers, scores, difficulty levels,
                    accuracy, and progression information may be stored so
                    that your expedition history and explorer progression can
                    be maintained.
                </Section>

                <Section title="4. Authentication">
                    Authentication information is used to securely identify
                    users and provide access to their account-specific
                    features.
                </Section>

                <Section title="5. Leaderboards">
                    Information associated with your explorer profile may be
                    displayed on the leaderboard when leaderboard functionality
                    is enabled.
                </Section>

                <Section title="6. Data Security">
                    Reasonable technical measures are used to protect
                    application data. However, no internet-based service can
                    guarantee absolute security.
                </Section>

                <Section title="7. Third-Party Services">
                    Jurassic Journey may rely on third-party services for
                    hosting, authentication, data storage, or other technical
                    functionality required to operate the application.
                </Section>

                <Section title="8. Data Retention">
                    Account and quiz information may be retained for as long
                    as necessary to provide the application's functionality
                    and maintain user progress.
                </Section>

                <Section title="9. Changes to This Policy">
                    This Privacy Policy may be updated when the application,
                    its functionality, or its data practices change.
                </Section>

                <Section title="10. Contact">
                    If you have questions regarding this Privacy Policy,
                    please contact the Jurassic Journey project team through
                    the application's designated contact channel.
                </Section>

            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <section style={{ marginTop: "38px" }}>
        <h2
            style={{
                fontFamily: "Cinzel",
                fontSize: "24px",
                color: "#D6A14B",
                marginBottom: "12px",
            }}
        >
            {title}
        </h2>

        <p
            style={{
                color: "#B8B8B8",
                lineHeight: 1.9,
                fontSize: "15px",
            }}
        >
            {children}
        </p>
    </section>
);

export default Privacy;