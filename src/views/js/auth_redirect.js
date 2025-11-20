document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("demoBtn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
        e.preventDefault(); // stop default navigation

        fetch("/session-user")
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn) {
                    // User is logged in → allow access
                    window.location.href = btn.getAttribute("href");
                } else {
                    // User NOT logged in → redirect to signin
                    window.location.href = "/signin.html";
                }
            })
            .catch(err => {
                console.error("Error checking session:", err);
                window.location.href = "/signin.html";
            });
    });

});
