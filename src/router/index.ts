import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/root";
import { useUserStore } from "@/store/user/userStore";



const router = createRouter({
  history: createWebHistory(),
  routes,
});

const notAuthenticated = ["login", "register"];
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (!notAuthenticated.some((p) => to.name) && !userStore.isAuthenticated)
    next({ name: "Login" });
  else next();
});
export default router;
