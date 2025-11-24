const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // fade IN
                entry.target.classList.add("visible");
                entry.target.classList.remove("hidden");
            } else {
                // fade OUT
                entry.target.classList.remove("visible");
                entry.target.classList.add("hidden");
            }
        });
    },
    {
        threshold: 0.2 // Start animation when 20% of section is visible
    }
);

revealElements.forEach(el => observer.observe(el));