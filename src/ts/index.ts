// Header sticky scroll
const primaryHeader = document.querySelector('header');
const scrollWatcher = document.createElement('div');

scrollWatcher.setAttribute('data-scroll-watcher', '');
primaryHeader?.before(scrollWatcher);

const navObserver = new IntersectionObserver((entries) => {
    primaryHeader?.classList.toggle('sticking', !entries[0].isIntersecting);

    console.log( primaryHeader?.offsetHeight );

}, { rootMargin: "30px 0px 0px 0px" });

navObserver.observe(scrollWatcher);


// Theme toggler
function manageTheme() {
    const darkThemeCheckbox = document.querySelector("#darkThemeToggle") as HTMLInputElement;
    const agentPrefersDarkQuery = matchMedia("(prefers-color-scheme: dark)");

    function setTheme(arg?: MediaQueryListEvent | string) {
        let chosenTheme = "";

        if (typeof arg === "string") {
            // If this function is called with a string, then an explict preference has
            // been set by the user. Use that theme and save the setting for the future.
            chosenTheme = arg;
            localStorage.setItem("theme", chosenTheme);
        } else {
            // Use any saved preference, else check for query param, else any OS preference.
            chosenTheme = localStorage.getItem("theme") ||
                new URLSearchParams(window.location.search).get("theme") ||
                (agentPrefersDarkQuery.matches ? "dark" : "light");
        }

        if (chosenTheme === "dark")
            document.documentElement.classList.add("dark-theme");
        else
            document.documentElement.classList.remove("dark-theme");

        // Update the UX to reflect the theme that was ultimately applied.
        darkThemeCheckbox.checked = (chosenTheme === "dark");
    }

    // Whenever the user changes the OS preference, refresh the applied theme.
    agentPrefersDarkQuery.onchange = setTheme;

    // Note that the 'change' event only fires on user action, (not when set in code), which is
    // great, else this might cause an infinite loop with the code setting it in setTheme.
    darkThemeCheckbox.addEventListener('change', ev => {
        let themeChosen = darkThemeCheckbox.checked ? "dark" : "light";
        setTheme(themeChosen);
    });

    setTheme(); // Run on initial load.
}

document.addEventListener("DOMContentLoaded", manageTheme);