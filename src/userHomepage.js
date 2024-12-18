// Wait for the DOM to fully load before executing the script
document.addEventListener("DOMContentLoaded", () => {
    // Select all dashboard buttons (elements with the class "dashboard-item")
    const dashboardButtons = document.querySelectorAll(".dashboard-item");

    // Add a click event listener to each dashboard button
    dashboardButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent the default action of the button (e.g., following the link)

            // Log the text of the button for debugging purposes
            console.log(`${button.textContent} button clicked`);

            // Get the URL from the 'href' attribute of the button
            const targetURL = button.getAttribute("href");

            if (targetURL) {
                // Redirect the user to the specified URL
                window.location.href = targetURL;
            } else {
                // Show an alert if the button does not have a valid link
                alert("This button does not have a valid link.");
            }
        });
    });

    // Add functionality to the logout link
    const logoutLink = document.querySelector("#logout");
    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent the default action of the logout link

            // Log the click action for debugging purposes
            console.log("Logout link clicked");

            // Show a confirmation message to the user
            alert("You have been logged out.");

            // Redirect the user to the logout page (replace with actual logout URL if applicable)
            window.location.href = "logout.html";
        });
    }
});
