  document.addEventListener("DOMContentLoaded", () => {
    fetch("/session-user")
      .then(res => res.json())
      .then(data => {

        const navList = document.querySelector(".navbar ul");

        if (!navList) return;

        if (data.loggedIn) {

          // Remove "Sign In" if it exists
          const signInItem = navList.querySelector('a[href="signin.html"]');
          if (signInItem) signInItem.parentElement.remove();

          // Create Sign Out button
          const li = document.createElement("li");
          li.innerHTML = `<a href="/logout">Sign Out</a>`;
          navList.appendChild(li);
        }
      });
  });