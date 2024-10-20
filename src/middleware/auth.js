// import { useCookies } from "vue3-cookies";
// import jwtDecode from "jwt-decode";
//
// export default function authGuard(to, from, next) {
//   const { cookies } = useCookies();
//   const userToken = cookies.get('access_token');
//   console.log(userToken);
//   if (!userToken) {
//     return next('/login');
//   }
//
//   try {
//     const decodedToken = jwtDecode(userToken);
//     const currentTime = Date.now() / 1000;
//
//     if (decodedToken.exp < currentTime) {
//       return next('/login');
//     }
//
//     next();
//   } catch (error) {
//     console.error('Token inválido ou erro ao decodificar', error);
//     return next('/login');
//   }
// }
