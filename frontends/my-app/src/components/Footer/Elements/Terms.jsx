import React, { useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";

const Terms = () => {
    const isLoggedIn = !!localStorage.getItem("access_token");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#07110A",
                color: "#ECE4D8",
            }}
        >
            <Navbar isLoggedIn={isLoggedIn} />

            <div style={{ padding: "140px 20px 80px" }}>
                <div
                    style={{
                        maxWidth: "900px",
                        margin: "0 auto",
                        background: "#101713",
                        border: "1px solid rgba(214,161,75,.2)",
                        borderRadius: "30px",
                        padding: "50px",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
                    }}
                >
                    <div
                        style={{
                            color: "#D6A14B",
                            letterSpacing: "4px",
                            fontSize: "12px",
                            marginBottom: "15px",
                            textTransform: "uppercase",
                            fontFamily: "Cinzel, serif"
                        }}
                    >
                        Jurassic Journey
                    </div>

                    <h1
                        style={{
                            fontFamily: "Cinzel, serif",
                            fontSize: "48px",
                            lineHeight: 1.2,
                            margin: "0 0 15px",
                        }}
                    >
                        Terms & Conditions
                    </h1>

                    <p
                        style={{
                            color: "#777",
                            fontSize: "14px",
                            marginBottom: "45px",
                        }}
                    >
                        Last updated: August 8, 2026
                    </p>

                    <p
                        style={{
                            color: "#B8B8B8",
                            lineHeight: 1.9,
                            fontSize: "15px",
                        }}
                    >
                        Welcome to Jurassic Journey. These Terms & Conditions
                        govern your access to and use of the Jurassic Journey
                        application. By accessing or using the application, you
                        agree to these terms.
                    </p>

                    <Section title="1. Acceptance of Terms">
                        By accessing or using Jurassic Journey, you acknowledge
                        that you have read, understood, and agreed to these Terms &
                        Conditions. If you do not agree with these terms, please
                        discontinue use of the application.
                    </Section>

                    <Section title="2. Use of the Application">
                        Jurassic Journey provides an interactive,
                        dinosaur-themed quiz and exploration experience. The
                        application may provide quizzes, scores, progression,
                        achievements, statistics, and leaderboard features.
                    </Section>

                    <Section title="3. User Accounts">
                        If account functionality is provided, you are responsible
                        for maintaining the confidentiality of your account
                        credentials and for activities performed through your
                        account.
                    </Section>

                    <Section title="4. Quiz and Game Data">
                        Jurassic Journey may record information related to your
                        quiz activity, including answers, scores, accuracy,
                        difficulty, progression, quiz history, and leaderboard
                        information in order to provide the application's
                        functionality.
                    </Section>

                    <Section title="5. Fair Use and Fair Play">
                        Users must not attempt to manipulate quiz results,
                        interfere with the application's operation, exploit
                        vulnerabilities, access unauthorized data, or obtain an
                        unfair advantage over other users.
                    </Section>

                    <Section title="6. Intellectual Property">
                        The Jurassic Journey name, visual design, interface,
                        original graphics, content, source code, and other
                        original materials associated with the application may be
                        protected by applicable intellectual-property laws.
                    </Section>

                    <Section title="7. Third-Party Services">
                        Jurassic Journey may use third-party services for
                        infrastructure, hosting, authentication, data storage,
                        analytics, or other technical requirements. Your use of
                        such services may also be subject to their respective
                        terms and policies.
                    </Section>

                    <Section title="8. Application Availability">
                        We may modify, update, suspend, or discontinue any part of
                        Jurassic Journey at any time. We do not guarantee that the
                        application will always be available or completely
                        uninterrupted.
                    </Section>

                    <Section title="9. Disclaimer">
                        Jurassic Journey is provided on an "as available" basis.
                        Quiz content and results are intended for educational and
                        entertainment purposes and should not be treated as
                        professional or authoritative advice.
                    </Section>

                    <Section title="10. Limitation of Liability">
                        To the maximum extent permitted by applicable law, the
                        Jurassic Journey project team will not be liable for
                        losses, damages, interruptions, or other consequences
                        resulting from your use of, or inability to use, the
                        application.
                    </Section>

                    <Section title="11. Changes to These Terms">
                        These Terms & Conditions may be updated as Jurassic Journey
                        evolves. Updated terms will become effective when they are
                        published within the application or through another
                        appropriate communication channel.
                    </Section>

                    <Section title="12. Termination">
                        Access to Jurassic Journey may be suspended or terminated
                        if a user violates these Terms & Conditions, attempts to
                        compromise the application, or engages in activity that
                        may harm the application or its users.
                    </Section>

                    <Section title="13. Contact">
                        If you have questions, concerns, or requests regarding
                        these Terms & Conditions, please contact the Jurassic
                        Journey project team through the application's designated
                        contact channel.
                    </Section>

                    <div
                        style={{
                            marginTop: "55px",
                            paddingTop: "25px",
                            borderTop:
                                "1px solid rgba(214,161,75,.15)",
                            color: "#888",
                            fontSize: "13px",
                            textAlign: "center",
                        }}
                    >
                        © 2026 Jurassic Journey. All rights reserved.
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const Section = ({ title, children }) => {
    return (
        <section
            style={{
                marginTop: "38px",
            }}
        >
            <h2
                style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "23px",
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
                    margin: 0,
                }}
            >
                {children}
            </p>
        </section>
    );
};

export default Terms;