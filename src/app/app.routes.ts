import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { DetailComponent } from './features/detail/detail.component';
import { ComparisonComponent } from './features/comparison/comparison.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { ContactComponent } from './features/contact/contact.component';
import { AuthComponent } from './features/auth/auth.component';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AdminFormComponent } from './features/admin/form/form.component';
import { SpecificationsAdminComponent } from './features/admin/specifications/specifications-admin.component';
import { UsersAdminComponent } from './features/admin/users/users-admin.component';
import { CarouselAdminComponent } from './features/admin/carousel/carousel-admin.component';
import { PlansComponent } from './features/subscriptions/plans.component';
import { MyListingsComponent } from './features/my-listings/my-listings.component';
import { TermsComponent } from './features/legal/terms.component';
import { PrivacyComponent } from './features/legal/privacy.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'catalogo', 
    component: CatalogComponent 
  },
  { 
    path: 'catalogo/autos', 
    component: CatalogComponent,
    data: { category: 'autos', title: 'Autos y Camionetas' }
  },
  { 
    path: 'catalogo/autos-electricos', 
    component: CatalogComponent,
    data: { category: 'autos_electricos', title: 'Autos Eléctricos' }
  },
  { 
    path: 'catalogo/motos', 
    component: CatalogComponent,
    data: { category: 'motos', title: 'Motocicletas' }
  },
  { 
    path: 'catalogo/motos-electricas', 
    component: CatalogComponent,
    data: { category: 'motos_electricos', title: 'Motos Eléctricas' }
  },
  { 
    path: 'catalogo/maquinaria-agricola', 
    component: CatalogComponent,
    data: { category: 'maquinaria_agricola', title: 'Maquinaria Agrícola' }
  },
  { 
    path: 'catalogo/transporte-pesado', 
    component: CatalogComponent,
    data: { category: 'transporte_pesado', title: 'Transporte Pesado' }
  },
  { 
    path: 'vehiculo/:id', 
    component: DetailComponent 
  },
  { 
    path: 'comparador', 
    component: ComparisonComponent 
  },
  { 
    path: 'favoritos', 
    component: FavoritesComponent 
  },
  { 
    path: 'contacto', 
    component: ContactComponent 
  },
  { 
    path: 'autenticacion', 
    component: AuthComponent 
  },
  // Rutas de administración protegidas por autenticación y roles de admin
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard, roleGuard] 
  },
  { 
    path: 'admin/crear', 
    component: AdminFormComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'admin/editar/:id', 
    component: AdminFormComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'admin/especificaciones', 
    component: SpecificationsAdminComponent, 
    canActivate: [authGuard, roleGuard] 
  },
  { 
    path: 'admin/usuarios', 
    component: UsersAdminComponent, 
    canActivate: [authGuard, roleGuard] 
  },
  { 
    path: 'admin/carrusel', 
    component: CarouselAdminComponent, 
    canActivate: [authGuard, roleGuard] 
  },
  { 
    path: 'planes', 
    redirectTo: '' 
  },
  { 
    path: 'mis-publicaciones', 
    component: MyListingsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'terminos', 
    component: TermsComponent 
  },
  { 
    path: 'privacidad', 
    component: PrivacyComponent 
  },
  // Comodín para redirigir rutas no encontradas al inicio
  { 
    path: '**', 
    redirectTo: '' 
  }
];
