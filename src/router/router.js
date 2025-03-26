// Archivo de creción y exportación del router.
import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuth } from "../services/auth";

// Lazy loading de componentes
const Home = () => import('../pages/HomeLogged.vue');
const HomeLogged = () => import('../pages/HomeLogged.vue');
const HomeNotLogged = () => import('../pages/HomeNotLogged.vue');
const Login = () => import('../pages/auth/Login.vue');
const Register = () => import('../pages/auth/Register.vue');
const ForgotPassword = () => import('../pages/auth/ForgotPassword.vue');
const NewPassword = () => import('../pages/auth/NewPassword.vue');
const MyProfile = () => import('../pages/profile/MyProfile.vue');
const MyProfileEdit = () => import('../pages/profile/MyProfileEdit.vue');
const MyProfileEditPhoto = () => import('../pages/profile/MyProfileEditPhoto.vue');
const MyProfileChangePassword = () => import('../pages/profile/MyProfileChangePassword.vue');
const RoutineGenerator = () => import('../pages/routines/RoutineGenerator.vue');
const RoutineGeneratorForm = () => import('../pages/routines/RoutineGeneratorForm.vue');
const RoutineGeneratorResult = () => import('../pages/routines/RoutineGeneratorResult.vue');
const RoutinesList = () => import('../pages/routines/RoutinesList.vue');
const RoutineEdit = () => import('../pages/routines/RoutineEdit.vue');
const TrainerList = () => import('../pages/trainer/TrainerList.vue');
const TrainerProfile = () => import('../pages/profile/TrainerProfile.vue');
const PremiumUserList = () => import('../pages/trainer/PremiumUserList.vue');
const PremiumUserProfile = () => import('../pages/profile/PremiumUserProfile.vue');
const PrivateChat = () => import('../pages/chat/PrivateChat.vue');
const ExerciseList = () => import('../pages/exercise/ExerciseList.vue');
const PaymentSuccess = () => import('../pages/payment/PaymentSuccess.vue');
const PaymentFailure = () => import('../pages/payment/PaymentFailure.vue');
const PaymentPending = () => import('../pages/payment/PaymentPending.vue');

const initializeGeneratedRoutines = () => import("../services/initialize-generated-routines").then(module => {
  module.initializeGeneratedRoutines();
  router.push('/rutinas?initialized=true');
});

// ------------------ Array con las rutas ---------------------
const routes = [
    { path: '/',                        name: 'home',                   component: Home,
        beforeEnter: (to, from) => {
            return loggedUser.id !== null ? 
                { name: 'home.logged' } : 
                { name: 'home.not-logged' };
        }
    },
    { path: '/inicio',                  name: 'home.logged',            component: HomeLogged,          meta: { requiresAuth: true },  },
    { path: '/bienvenida',              name: 'home.not-logged',        component: HomeNotLogged, },
    { path: '/registro',                name: 'register',               component: Register, },
    { path: '/iniciar-sesion',          name: 'login',                  component: Login, },
    { path: '/recuperar-password',      name: 'forgot-password',        component: ForgotPassword, },
    { path: '/mi-perfil',               name: 'my-profile',             component: MyProfile,           meta: { requiresAuth: true }, },
    { path: '/mi-perfil/editar',        name: 'my-profile.edit',        component: MyProfileEdit,       meta: { requiresAuth: true }, },
    { path: '/mi-perfil/editar/foto',   name: 'my-profile.edit.photo',  component: MyProfileEditPhoto,  meta: { requiresAuth: true }, },
    { path: '/mi-perfil/cambiar-password', name: 'my-profile.change-password',component: MyProfileChangePassword,       meta: { requiresAuth: true }, },
    { path: '/entrenadores',            name: 'trainer-list',           component: TrainerList,         meta: { requiresAuth: true }, },
    { path: '/entrenadores/:id',        name: 'trainer.profile',        component: TrainerProfile,      meta: { requiresAuth: true }, },
    { path: '/entrenadores/:id/chat',   name: 'trainer.profile.chat',   component: PrivateChat,         meta: { requiresAuth: true }, },
    { path: '/usuarios-premium',        name: 'premium-user-list',      component: PremiumUserList,     meta: { requiresAuth: true } },
    { path: '/usuarios-premium/:id',    name: 'premium-user-profile',   component: PremiumUserProfile,  meta: { requiresAuth: true } },
    { path: '/usuarios-premium/:id/chat',   name: 'premium-user-profile.chat',   component: PrivateChat,         meta: { requiresAuth: true }, },
    
    { path: '/ejercicios',              name: 'exercise-list',          component: ExerciseList,        meta: { requiresAuth: true }, },
    { path: '/rutinas',                  name: 'routines.list',           component: RoutinesList,        meta: { requiresAuth: true } },
    { path: '/rutinas/crear',            name: 'routines.create',         component: RoutineEdit,         meta: { requiresAuth: true } },
    { path: '/rutinas/:id',              name: 'routines.edit',           component: RoutineEdit,         meta: { requiresAuth: true } },
    { path: '/generador',        name: 'routine.generator',      component: RoutineGenerator,    meta: { requiresAuth: true } },
    { path: '/generador/formulario', name: 'routine.generator.form',  component: RoutineGeneratorForm, meta: { requiresAuth: true } },
    { path: '/generador/resultado/:routineId', name: 'routine.generator.result', component: RoutineGeneratorResult, meta: { requiresAuth: true } },
    { 
      path: '/inicializar-rutinas',      
      name: 'initialize-routines',    
      component: { 
        template: '<div class="flex items-center justify-center min-h-screen"><div class="text-center"><h1 class="text-2xl text-celeste mb-4">Inicializando rutinas...</h1><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-celeste mx-auto"></div></div></div>',
        async mounted() {
          try {
            await initializeGeneratedRoutines();
          } catch (error) {
            console.error('Error initializing routines:', error);
          }
        }
      },
      meta: { requiresAuth: true } 
    },
    { path: '/payment/success',  name: 'payment.success',  component: PaymentSuccess,  meta: { requiresAuth: true } },
    { path: '/payment/failure',  name: 'payment.failure',  component: PaymentFailure,  meta: { requiresAuth: true } },
    { path: '/payment/pending',  name: 'payment.pending',  component: PaymentPending,  meta: { requiresAuth: true } },
    { 
        path: '/__/auth/action',
        name: 'auth-action',
        component: () => import('../pages/auth/NewPassword.vue'),
        props: route => ({ 
            mode: route.query.mode,
            oobCode: route.query.oobCode,
            apiKey: route.query.apiKey
        })
    },
];

// Suscripción a la autenticación.
let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    training: null,
    type: null,
}
subscribeToAuth(newUserData => loggedUser = newUserData);

// Creacion del router
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        // siempre vuelve al inicio de la página
        return { top: 0 }
    }
});

// Navegación global
// router.beforeEach((to, from, next) => {
//     // Si no es una vista de chat, resetear el scroll
//     if (!to.name?.includes('chat')) {
//         window.scrollTo(0, 0);
//     }
//     next();
// });

// ------------------ Rutas Protegidas ---------------------
router.beforeEach((to, from) => {
    console.log('loggedUser.type:', loggedUser.type);
  
    // ----- Redireccionamiento para usuarios no autenticados -----
    if (to.meta.requiresAuth && loggedUser.id === null) {
      return {
        path: '/iniciar-sesion'
      };
    }
  
    // ----- Redireccionamiento para usuarios básicos al entrar a función premium -----
    if (to.path.startsWith('/entrenadores/') && (to.path.endsWith('/chat') || to.path.endsWith('/'))) {
      if (loggedUser.type === 'basico') {
          console.log('Usuario básico, redireccionando a /entrenadores');
        return {
          path: '/entrenadores'
        };
      }
    }
    if (to.path.startsWith('/entrenadores/') && to.path.split('/').length === 3) {
      if (loggedUser.type === 'basico') {
          console.log('Usuario básico, redireccionando a /entrenadores');
        return {
          path: '/entrenadores'
        };
      }
    }

      //----- Redireccionamiento para usuarios al entrar a función de entrenador -----
      if (to.path === '/usuarios-premium' || to.path.startsWith('/usuarios-premium/')) {
        if (loggedUser.type !== 'entrenador') {
          console.log('Usuario no entrenador, redireccionando a /entrenadores');
          return {
            path: '/entrenadores'
          };
        }
      }
});

export default router;
