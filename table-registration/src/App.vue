<script>
import { ref } from "vue";
import { useAuthUserStore } from "./stores/users";

export default {
  setup() {
    const userStore = useAuthUserStore();
    const user = userStore.getUser || null;
    const username = user.username;
    const menu = ref();

    userStore.login();

    const siteNav = ref([
      {
        label: "Home",
        to: "/",
      },
      {
        label: "About",
        url: "https://premiersawards.gww.gov.bc.ca/",
        class: "about-option",
      },
      {
        label: () => userStore.getUser.username || "Account",
        // label: username || "Account",
        class: "dropdown-account",
        icon: "pi pi-user",
        items: [
          {
            label: "Create Account",
            to: "/register/",
            visible: () => !userStore.isAuthenticated || !userStore.isRegistrar,
            class: "dropdown-account-item",
          },
          {
            label: "My Registration",
            to: "/create/registration/",
            visible: () => userStore.isRegistrar,
            class: "dropdown-account-item",
          },
          {
            label: "Update Profile",
            to: "/user/update/",
            visible: () => userStore.isRegistrar,
            class: "dropdown-account-item",
          },
          {
            label: "Manage Users",
            to: "/admin/user/list",
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View Registrations",
            to: "/admin/",
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View Guests",
            to: "/admin/guests",
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
        ],
      },
    ]);

    return { siteNav, username, menu };
  },
};
</script>

<template>
  <header>
    <div>
      <MenuBar id="navbar" :model="siteNav">
        <template #start>
          <div id="titlenav">
            <router-link to="/" id="page-title"
              >Premier's Awards Event Registration
            </router-link>
          </div>
        </template>
      </MenuBar>
    </div>
  </header>

  <RouterView />
</template>

<style>
/* @import "@/assets/base.css"; */
@import "primevue/resources/primevue.min.css";
@import "primeicons/primeicons.css";
@import "/node_modules/primeflex/primeflex.css";
@import "./assets/_theme.scss"; /* Originally from "primevue/resources/themes/md-light-indigo/theme.css" */

/* Theme Choices: */

/* @import "primevue/resources/themes/nova/theme.css"; */

/* @import "primevue/resources/themes/md-light-indigo/theme.css"; */

/* @import "primevue/resources/themes/nova-alt/theme.css"; */

/* @import "primevue/resources/themes/nova-accent/theme.css"; */

/* @import "primevue/resources/themes/nova-vue/theme.css"; */

/* @import "primevue/resources/themes/rhea/theme.css"; */

/* @import "primevue/resources/themes/lara-light-teal/theme.css"; */
html {
  font-size: 12px;
}

main {
  margin-top: 4em;
  padding-bottom: 300px;
  margin-left: 2em;
  margin-right: 2em;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  /* max-width: 1280px; */
  margin: 0 auto;
  /* padding: 2rem; */
}

header {
  line-height: 1.5;
  max-height: 100vh;
  margin: -9px;
}

#navbar {
  position: sticky;
  color: white !important;
  background-color: #343a40;
  top: 0;
  font-size: 1.3em;
  z-index: 9999 !important;
}
/* 
#titlenav{
fon
} */

#navbar .p-menuitem-text {
  color: white !important;
}

#navbar .p-submenu-list {
  z-index: 9999 !important;
}

#navbar .p-submenu-list .p-menuitem-text {
  color: black !important;
}
#navbar .p-submenu-list .p-menuitem-link {
  font-size: 0.9em;
}

#page-title {
  color: white !important;
  z-index: 9999 !important;
  display: inline-block;
  padding-top: 0.3125rem;
  padding-bottom: 0.3125rem;
  margin-right: 1rem;
  font-size: 20px;
  line-height: inherit;
  white-space: nowrap;
  text-decoration: none;
  background-color: transparent;
}

.dropdown-account {
  position: absolute !important;
  right: 10px;
  z-index: 9999 !important;
  background-color: rgba(21, 162, 184, 0.92);
}

.dropdown-account:hover {
  color: #343a40 !important;
  background-color: rgba(21, 162, 184, 0.92);
}

.p-submenu-list {
  right: 0px;
  z-index: 9999 !important;
}

.dropdown-account-item .p-menuitem-text {
  color: #343a40 !important;
  z-index: 9999 !important;
}

@media only screen and (max-width: 960px) {
  .about-option {
    display: none;
  }
  .p-menubar-button {
    position: absolute;
    right: 1vw;
  }
  .p-menubar-button i {
    color: white;
  }

  #page-title {
    font-size: 2vmax;
  }
}
</style>
