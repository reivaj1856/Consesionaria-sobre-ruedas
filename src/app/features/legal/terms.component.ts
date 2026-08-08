import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 fade-in transition-colors">
      <div class="mx-auto max-w-4xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-xl dark:shadow-2xl">
        
        <!-- Header -->
        <div class="border-b border-slate-200 dark:border-slate-700 pb-6 mb-8 text-center sm:text-left">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">Legal y Normativa</span>
          <h1 class="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Términos y Condiciones de Uso</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">ruedas.store - Cochabamba, Bolivia | Última actualización: 2026</p>
        </div>

        <!-- Content -->
        <div class="space-y-8 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">

          <!-- Section 1 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
              Aspectos Generales
            </h2>
            <p class="mb-3">
              El sitio web <strong class="text-slate-900 dark:text-white">www.ruedas.store</strong> (en adelante, el "Sitio Web") es de propiedad y operación exclusiva de ruedas.store, con sede principal en la ciudad de Cochabamba, Bolivia.
            </p>
            <p class="mb-3">
              Al acceder y utilizar este Sitio Web, el usuario (en adelante, el "Usuario") acepta íntegramente las cláusulas, términos, condiciones y políticas de privacidad establecidas en el presente documento (el "Acuerdo"). Si el Usuario no está de acuerdo con estos términos, deberá abstenerse de utilizar la plataforma.
            </p>
            <p class="mb-3">
              Por regla general, el Sitio Web es un portal informativo y de intermediación publicitaria para la comercialización de vehículos y maquinarias. La información publicada no constituye una oferta legal vinculante por sí misma; en consecuencia, cualquier relación contractual o transacción requerirá la confirmación formal y por escrito entre las partes. Excepcionalmente, cuando se habiliten transacciones o contratos por medios electrónicos, estos se regirán conforme al Art. 78 y siguientes de la Ley N° 164 (Ley General de Telecomunicaciones, Tecnologías de Información y Comunicación) y normativa boliviana aplicable.
            </p>
            <p>
              ruedas.store se reserva el derecho de modificar, actualizar o eliminar cualquier parte de estos Términos y Condiciones en cualquier momento y sin previo aviso. Los cambios surtirán efecto a partir de su publicación en el Sitio Web. El servicio está dirigido exclusivamente a personas mayores de 18 años con capacidad legal para contratar en Bolivia.
            </p>
          </section>

          <!-- Section 2 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
              Alcance Comercial y Servicios Ofrecidos
            </h2>
            <p class="mb-3">
              ruedas.store es una plataforma especializada en la publicación, exhibición y facilitación de compraventa de las siguientes categorías de bienes, tanto nuevos como de segundo uso (usados):
            </p>
            <ul class="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
              <li>Automóviles, vagonetas y camionetas.</li>
              <li>Vehículos 100% eléctricos e híbridos.</li>
              <li>Motocicletas y cuadratracs.</li>
              <li>Maquinaria pesada (construcción, minería, etc.).</li>
              <li>Maquinaria agrícola y equipos especializados.</li>
            </ul>
            <p class="mt-3">
              Los datos técnicos, año, kilometraje, horas de uso, equipamiento y precios exhibidos en las publicaciones están sujetos a verificación y permanentes cambios. ruedas.store realiza esfuerzos constantes por validar la información, pero no se responsabiliza por errores u omisiones en las especificaciones proporcionadas directamente por los vendedores o usuarios anunciantes.
            </p>
          </section>

          <!-- Section 3 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
              Puntos de Encuentro y Verificación en Cochabamba
            </h2>
            <p class="mb-3">
              ruedas.store podrá habilitar o coordinar puntos de encuentro físicos dentro de la ciudad de Cochabamba para la inspección visual, revisión técnica o demostración de los vehículos y maquinarias entre comprador y vendedor.
            </p>
            <div class="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 space-y-2">
              <p><strong class="text-slate-900 dark:text-white">Responsabilidad:</strong> ruedas.store actúa únicamente como facilitador del espacio o la logística de contacto, no siendo responsable de la concreción de la venta ni del estado mecánico o legal del bien, salvo que el cliente contrate expresamente un servicio adicional de peritaje o gestión legal instrumentado en documento separado.</p>
              <p><strong class="text-slate-900 dark:text-white">Identificación:</strong> Para cualquier cita o inspección presencial, ambas partes deberán exhibir su Cédula de Identidad (C.I.) vigente. En caso de representación, se requerirá fotocopia de C.I. del propietario y Poder Notarial suficiente.</p>
            </div>
          </section>

          <!-- Section 4 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">4</span>
              Transacciones, Pagos y Reservas
            </h2>
            <p class="mb-3">
              ruedas.store no solicita adelantos de dinero, giros ni transferencias bancarias a través de sistemas de mensajería informal previo a la verificación del vehículo o firma de minutas de compraventa.
            </p>
            <p class="mb-2">En caso de que el Comprador y Vendedor acuerden utilizar los servicios de gestión de pago o transferencia de ruedas.store:</p>
            <ol class="list-decimal list-inside space-y-2 pl-2 text-slate-600 dark:text-slate-300">
              <li>Los fondos recibidos serán custodiados y transferidos al vendedor conforme a las condiciones que se pacten por escrito para cada operación.</li>
              <li>ruedas.store no se responsabiliza por entregas de dinero realizadas de forma directa entre particulares fuera de los canales y procedimientos oficiales de la empresa.</li>
              <li>Una vez formalizada la venta de un vehículo o maquinaria usada, ruedas.store no realiza reembolsos ni renegociaciones de precio. El Comprador asume la responsabilidad total del estado técnico y legal del bien desde el momento de la toma de posesión.</li>
            </ol>
          </section>

          <!-- Section 5 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">5</span>
              Prohibiciones de Uso del Sitio
            </h2>
            <p class="mb-2">Queda estrictamente prohibido al Usuario:</p>
            <ol class="list-decimal list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
              <li>Publicar información falsa, engañosa, o sobre vehículos/maquinarias de procedencia dudosa, con gravámenes no declarados o con documentación alterada.</li>
              <li>Transmitir contenido difamatorio, obsceno, fraudulento o violatorio de derechos de propiedad intelectual de terceros.</li>
              <li>Introducir virus, scripts maliciosos o realizar ataques que vulneren la seguridad o estabilidad del Sitio Web.</li>
              <li>Cometer o intentar fraudes, estafas u otros delitos sancionados por el Código Penal Boliviano mediante el uso de la plataforma.</li>
            </ol>
            <p class="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-lg border border-amber-200 dark:border-amber-500/20">
              ruedas.store se reserva el derecho de dar de baja cualquier publicación o suspender cuentas de usuario que incumplan estas prohibiciones.
            </p>
          </section>

          <!-- Section 6 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">6</span>
              Propiedad Intelectual y Marcas
            </h2>
            <p>
              El diseño del sitio web www.ruedas.store, logos, marcas, bases de datos, código fuente y contenidos propios están protegidos por las leyes de Propiedad Intelectual e Industrial de Bolivia e instrumentos internacionales. Queda prohibida su reproducción, copia o explotación comercial sin la autorización previa y por escrito de ruedas.store.
            </p>
          </section>

          <!-- Section 7 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">7</span>
              Exención de Responsabilidad Técnica
            </h2>
            <p>
              ruedas.store no garantiza la disponibilidad ininterrumpida de su plataforma web debido a posibles fallos técnicos, mantenimiento o problemas de infraestructura de red ajenos a su control. Tampoco responderá por daños derivados de intromisiones ilegítimas de terceros (hackers) que superen las medidas de seguridad adoptadas.
            </p>
          </section>

          <!-- Section 8 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">8</span>
              Política de Privacidad y Tratamiento de Datos
            </h2>
            <p class="mb-3">
              Los datos personales recabados por ruedas.store serán tratados con estricta confidencialidad y utilizados exclusivamente para mantener el contacto comercial, verificar la identidad de las partes, prevenir fraudes y enviar ofertas o actualizaciones de productos/servicios dentro de la plataforma.
            </p>
            <ul class="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
              <li>El Usuario autoriza a ruedas.store al tratamiento de sus datos al momento de registrarse o llenar un formulario en el sitio.</li>
              <li>El Sitio Web puede hacer uso de cookies para mejorar la experiencia de navegación.</li>
              <li>El Usuario podrá solicitar la eliminación o baja de su cuenta y datos personales escribiendo a los canales oficiales de atención o mediante la opción configurada en su perfil.</li>
            </ul>
          </section>

          <!-- Section 9 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">9</span>
              Jurisdicción y Legislación Aplicable
            </h2>
            <p class="mb-3">
              El presente Acuerdo se rige en su totalidad por las leyes de la República Plurinacional de Bolivia.
            </p>
            <p>
              Cualquier controversia, reclamo o conflicto derivado de la interpretación, validez o ejecución de este contrato será sometido prioritariamente a una etapa de conciliación directa. De no llegar a un acuerdo, las partes acuerdan someter la controversia al procedimiento de Arbitraje y Conciliación administrado por el Centro de Conciliación y Arbitraje de la Cámara de Comercio y Servicios de Cochabamba (FEPC / ICAM), sometiéndose a sus reglamentos y al marco legal regulado por la Ley N° 708 de Conciliación y Arbitraje. La sede del arbitraje será la ciudad de Cochabamba, Bolivia.
            </p>
          </section>

        </div>

        <!-- Back Button -->
        <div class="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-center">
          <a routerLink="/" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/30">
            Volver a Inicio
          </a>
        </div>

      </div>
    </div>
  `
})
export class TermsComponent {}
