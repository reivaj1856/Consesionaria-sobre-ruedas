# Concesionaria Premium - Aplicación Web en Angular & Tailwind CSS

Este proyecto es una plataforma web completa de venta de autos, motos y maquinaria pesada, construida utilizando la última versión de **Angular** (Standalone Components, Signals, Enrutamiento Dinámico) y **Tailwind CSS**.

---

## 🛠️ Requisitos e Instalación

Para ejecutar este proyecto en tu entorno local, asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión v18+ recomendada) y npm.

1. **Clonar o abrir la carpeta del proyecto** en tu terminal.
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run start
   ```
   *El proyecto se ejecutará por defecto en `http://localhost:4200/`.*

4. **Compilar para producción**:
   ```bash
   npm run build
   ```
   *Los archivos compilados y optimizados se generarán en la carpeta `dist/ConcesionariaApp`.*

---

## 📂 Estructura del Proyecto

El diseño de la aplicación sigue una arquitectura escalable y modular organizada por características (*features*):

```text
src/
├── app/
│   ├── app.config.ts             # Proveedores globales de Angular (Routing, HttpClient)
│   ├── app.routes.ts             # Configuración y protección de rutas con Guards
│   ├── core/                     # Servicios transversales, modelos y guards
│   │   ├── guards/
│   │   │   ├── auth.guard.ts     # Guard para verificar inicio de sesión
│   │   │   └── role.guard.ts     # Guard para verificar rol de Administrador
│   │   ├── models/
│   │   │   ├── vehicle.model.ts  # Tipados TypeScript de Vehículos
│   │   │   ├── user.model.ts     # Tipados de Usuarios
│   │   │   └── reservation.model.ts # Tipados de Reservas y Formularios
│   │   └── services/
│   │       ├── auth.service.ts   # Autenticación simulada y roles (cliente/admin)
│   │       ├── vehicle.service.ts# CRUD completo con persistencia en localStorage
│   │       ├── favorite.service.ts# Favoritos dinámicos en localStorage
│   │       └── comparison.service.ts # Comparador de especificaciones técnicas (máx. 3)
│   ├── shared/                   # Componentes globales reutilizables
│   │   └── components/
│   │       ├── navbar/           # Cabecera interactiva con contadores dinámicos
│   │       ├── footer/           # Pie de página y datos de contacto de sucursal
│   │       └── vehicle-card/     # Tarjeta de producto con hover y acciones
│   └── features/                 # Vistas principales
│       ├── home/                 # Inicio (Hero, Buscador, Categorías, Destacados)
│       ├── catalog/              # Catálogo con filtros avanzados y ordenación
│       ├── detail/               # Detalle interactivo (Galería, Cotización, Reserva)
│       ├── comparison/           # Comparador técnico side-by-side
│       ├── favorites/            # Lista de favoritos del usuario
│       ├── contact/              # Ubicación, mapa real e info de sucursales
│       ├── auth/                 # Login y registro de usuarios
│       └── admin/                # Panel del administrador (CRUD)
│           ├── dashboard/        # Listado de inventario, cambio de estados/destacados
│           └── form/             # Formulario reactivo para Crear y Editar
```

---

## 👥 Cuentas de Prueba Preconfiguradas

Para probar las diferentes vistas y los guards de roles en la plataforma, puedes iniciar sesión con las siguientes credenciales de demostración:

* **Administrador** (Acceso completo a CRUD, destacado y cambio de estados):
  * **Email**: `admin@concesionaria.com`
  * **Contraseña**: `admin123`
* **Cliente Estándar** (Acceso a reservas de vehículos y visuales normales):
  * **Email**: `cliente@concesionaria.com`
  * **Contraseña**: `cliente123`

*(Nota: Cualquier otra combinación de correo y clave de al menos 6 caracteres creará una cuenta de cliente temporal).*

---

## 📝 Ejemplos de Código Clave

### 1. Servicio de Vehículos (`vehicle.service.ts`)
Implementa Angular Signals para el estado y sincronización automática en `localStorage` para simular un backend persistente en la demo:

```typescript
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'concesionaria_vehicles';
  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  public readonly vehicles = this.vehiclesSignal.asReadonly();

  constructor() { this.initVehicles(); }

  private async initVehicles(): Promise<void> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.vehiclesSignal.set(JSON.parse(stored));
        return;
      }
    }
    // Si no hay datos locales, cargar el JSON mock original
    const data = await firstValueFrom(this.http.get<Vehicle[]>('/mock-data/vehicles.json'));
    this.saveToStorage(data);
  }

  private saveToStorage(data: Vehicle[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    this.vehiclesSignal.set(data);
  }

  public getVehicleById(id: string) { return this.vehicles().find(v => v.id === id); }

  public createVehicle(vehicle: Omit<Vehicle, 'id' | 'fechaIngreso'>): void {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `${vehicle.categoria}-${Date.now()}`,
      fechaIngreso: new Date().toISOString().split('T')[0]
    };
    this.saveToStorage([newVehicle, ...this.vehicles()]);
  }

  public updateVehicle(id: string, vehicle: Partial<Vehicle>): void {
    const updated = this.vehicles().map(v => v.id === id ? { ...v, ...vehicle } : v);
    this.saveToStorage(updated);
  }

  public deleteVehicle(id: string): void {
    this.saveToStorage(this.vehicles().filter(v => v.id !== id));
  }
}
```

### 2. Catálogo con Filtros Avanzados (`catalog.component.ts`)
Usa Angular `computed` reactivo para calcular la lista filtrada basándose en las variables de filtro:

```typescript
protected readonly filteredVehicles = computed(() => {
  let result = [...this.vehicleService.vehicles()];

  // Filtrado por Categoría
  if (this.filterCategory()) {
    result = result.filter(v => v.categoria === this.filterCategory());
  }
  // Filtrado por Texto (Buscador)
  if (this.filterText()) {
    const q = this.filterText().toLowerCase();
    result = result.filter(v => 
      v.nombre.toLowerCase().includes(q) || 
      v.marca.toLowerCase().includes(q)
    );
  }
  // Rango de Precios
  if (this.filterMinPrice() !== null) {
    result = result.filter(v => v.precio >= this.filterMinPrice()!);
  }
  if (this.filterMaxPrice() !== null) {
    result = result.filter(v => v.precio <= this.filterMaxPrice()!);
  }
  // Ordenar
  if (this.sortBy() === 'precio_asc') {
    result.sort((a, b) => a.precio - b.precio);
  } else if (this.sortBy() === 'precio_desc') {
    result.sort((a, b) => b.precio - a.precio);
  } else {
    result.sort((a, b) => b.fechaIngreso.localeCompare(a.fechaIngreso));
  }
  return result;
});
```

### 3. Detalle de Vehículo (`detail.component.ts`)
Manejo de la galería interactiva, cotizaciones en modal y actualización de inventario para reservas:

```typescript
protected confirmReservation(): void {
  this.reserveFinished.set(true);
  // Al reservar, cambia el estado en el servicio persistente local
  this.vehicleService.updateVehicle(this.vehicleId(), { estado: 'reservado' });
  
  setTimeout(() => {
    this.closeReserveModal();
  }, 3500);
}
```

### 4. CRUD de Administración (`form.component.ts`)
Formulario Reactivo unificado para dar de alta y editar vehículos con validaciones complejas:

```typescript
protected onSubmit(): void {
  if (this.vehicleForm.valid) {
    const formValue = this.vehicleForm.value;
    const especificaciones = {
      'Motor': formValue.specMotor,
      'Potencia': formValue.specPotencia,
      'Torque': formValue.specTorque,
      'Tracción': formValue.specTraccion
    };

    const vehicleData = {
      nombre: formValue.nombre,
      marca: formValue.marca,
      modelo: formValue.modelo,
      anio: formValue.anio,
      precio: formValue.precio,
      categoria: formValue.categoria,
      tipoCombustible: formValue.tipoCombustible,
      transmision: formValue.transmision,
      kilometraje: formValue.kilometraje,
      condicion: formValue.condicion,
      ubicacion: formValue.ubicacion,
      imagenPrincipal: formValue.imagenPrincipal,
      imagenes: [formValue.imagenPrincipal],
      descripcion: formValue.descripcion,
      destacado: formValue.destacado,
      estado: formValue.estado,
      especificaciones: especificaciones
    };

    if (this.isEditMode() && this.vehicleId()) {
      this.vehicleService.updateVehicle(this.vehicleId()!, vehicleData);
    } else {
      this.vehicleService.createVehicle(vehicleData);
    }
    this.router.navigate(['/admin']);
  }
}
```
