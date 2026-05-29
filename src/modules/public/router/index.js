import LandingView from '@/modules/public/submodules/home/views/LandingView.vue'
import ProductsView from '@/modules/public/views/ProductsView.vue'
import CartView from '@/modules/public/views/CartView.vue'
import ContactView from '@/modules/public/views/ContactView.vue'

const PublicRoutes = [
  { path: '/', name: 'home', component: LandingView },
  { path: '/productos', name: 'productos', component: ProductsView },
  { path: '/carrito', name: 'carrito', component: CartView },
  { path: '/contacto', name: 'contacto', component: ContactView }
]
export default PublicRoutes
