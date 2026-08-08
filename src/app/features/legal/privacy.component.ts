import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 fade-in transition-colors">
      <div class="mx-auto max-w-4xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-xl dark:shadow-2xl">
        
        <!-- Header -->
        <div class="border-b border-slate-200 dark:border-slate-700 pb-6 mb-8 text-center sm:text-left">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">Legal y Normativa</span>
          <h1 class="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Políticas de Privacidad</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">ruedas.store - Cochabamba, Bolivia | Pie de página del Sitio Web www.ruedas.store</p>
        </div>

        <!-- Content -->
        <div class="space-y-8 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">

          <p>
            Las Políticas de Privacidad estipulan cómo administramos la información personal que nos envía. Esta política se aplica a todos los miembros y visitantes que utilizan nuestro sitio web <strong class="text-slate-900 dark:text-white">www.ruedas.store</strong>, siempre y cuando estas políticas aparezcan en el pie de página del Sitio Web.
          </p>

          <!-- Section 1 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
              Tratamiento de Datos de Carácter Personal
            </h2>
            <p class="mb-3">
              Puede visitar nuestro Sitio Web sin indicarnos quién es ni revelar ninguna información personal sobre usted. Una vez nos haya proporcionado su información personal, dejará de ser anónimo para nosotros. Al proporcionarnos su información personal, consiente que recabemos y procesemos sus datos de la siguiente manera:
            </p>

            <ul class="space-y-3 pl-2">
              <li class="bg-slate-100 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/40">
                <strong class="text-slate-900 dark:text-white block mb-1">• Datos Recopilados:</strong> 
                Al aceptar nuestras Políticas de Privacidad, nos otorga la facultad de recopilar y almacenar su información personal como por ejemplo: nombre, dirección de correo electrónico, teléfono, dirección física, género, rango de edad, discusiones, conversaciones, disputas y correspondencia que realice a través de www.ruedas.store, así como la correspondencia que nos envíe; datos sobre su ordenador y su conexión, estadísticas de consultas de páginas, tráfico entrante y saliente, dirección IP e información de registro web estándar.
              </li>
              <li class="bg-slate-100 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/40">
                <strong class="text-slate-900 dark:text-white block mb-1">• Promoción de Anuncios:</strong> 
                Nos autoriza y acepta que www.ruedas.store aumente la difusión publicitaria de sus vehículos, maquinarias o publicaciones en sus otros canales publicitarios y de comunicación (impresos, redes sociales, televisión, eventos, etc.).
              </li>
              <li class="bg-slate-100 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/40">
                <strong class="text-slate-900 dark:text-white block mb-1">• Comunicaciones Directas:</strong> 
                ruedas.store podrá contactarlo a través del correo electrónico u otros medios proveídos para mantenerle informado acerca de promociones, nuevos servicios, actualización de políticas o cualquier otra información relevante. Los correos contarán con una opción para deshabilitar el envío de información comercial.
              </li>
              <li class="bg-slate-100 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/40">
                <strong class="text-slate-900 dark:text-white block mb-1">• Revelación por Requerimientos Legales:</strong> 
                Nos otorga la facultad de revelar su información personal para responder a requerimientos legales, hacer cumplir nuestras políticas, responder a reclamaciones de que un anuncio u otro contenido infringe derechos de terceros o proteger los derechos, propiedad o seguridad de otras partes.
              </li>
              <li class="bg-slate-100 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/40">
                <strong class="text-slate-900 dark:text-white block mb-1">• Protección de Datos:</strong> 
                No revelaremos su información personal a agentes de la ley, representantes gubernamentales o terceras partes sin una citación, orden judicial o procedimiento legal similar, excepto cuando creamos de buena fe que la revelación sea necesaria para impedir un daño físico o pérdida financiera inminente, o para informar acerca de una supuesta actividad ilegal.
              </li>
            </ul>
          </section>

          <!-- Section 2 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
              Infracción o Indicio de Infracción
            </h2>
            <p class="mb-3">
              Cuando existan indicios de que se están vulnerando las normas de nuestro Sitio Web o la legislación vigente, podemos solicitar información adicional o copia de determinados documentos:
            </p>
            <ul class="list-disc list-inside space-y-2 pl-2">
              <li>Copia de documento de identidad (C.I.) para verificar su identidad.</li>
              <li>RUAT, póliza de importación, factura o título de propiedad (pudiendo tapar datos innecesarios) para verificar la titularidad sobre los vehículos, motocicletas o maquinarias puestos a la venta.</li>
              <li>Bajo determinadas circunstancias, podemos utilizar otros medios justificados para corroborar su identidad y la legalidad del bien publicado.</li>
            </ul>
          </section>

          <!-- Section 3 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
              Términos y Condiciones de Uso de la Página Web (Anexo)
            </h2>
            <p class="mb-3">
              Al utilizar los servicios de www.ruedas.store, usted acepta las siguientes condiciones:
            </p>
            
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2">Exención de Responsabilidad Transaccional</h3>
            <ul class="list-disc list-inside space-y-2 pl-2">
              <li>ruedas.store no se hace responsable de los vehículos, motocicletas, automotores eléctricos o maquinarias que se publiquen, mefrezcan o compren a través de la plataforma, ya que NO estamos involucrados como parte en la transacción real entre compradores y vendedores individuales.</li>
              <li>No controlamos ni garantizamos la calidad, seguridad, funcionamiento mecánico, veracidad de kilometraje/horas de uso o legalidad de los artículos puestos en venta, ni la veracidad o exactitud de las publicaciones. Tampoco garantizamos la capacidad de los vendedores para transferir el bien ni la capacidad de pago de los compradores.</li>
              <li>En la medida máxima permitida por la ley, excluimos todas las garantías implícitas. No somos responsables ante cualquier pérdida de dinero, daño directo, indirecto o emergente que ocasione el uso de nuestro Sitio Web.</li>
            </ul>

            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2">Disputas entre Miembros y Jurisdicción</h3>
            <ul class="list-disc list-inside space-y-2 pl-2">
              <li>Si tiene una disputa con uno o varios miembros, exime a ruedas.store, sus encargados, directores, agentes y empleados de toda responsabilidad ante cualquier reclamación, demanda y daño de cualquier tipo o naturaleza.</li>
              <li>En caso de disputa directa entre usted y ruedas.store, acepta someterse a la jurisdicción de los tribunales bolivianos o a medios alternativos de resolución de conflictos (Conciliación y Arbitraje en el Centro de Conciliación y Arbitraje de Cochabamba).</li>
            </ul>
          </section>

          <!-- Section 4 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">4</span>
              Registro de los Miembros
            </h2>
            <ul class="list-disc list-inside space-y-2 pl-2">
              <li><strong class="text-slate-900 dark:text-white">Veracidad de Datos:</strong> ruedas.store podrá utilizar diversos medios para identificar a sus miembros, pero no se responsabiliza por la certeza de los datos personales provistos. Los miembros garantizan y responden por la veracidad, vigencia y autenticidad de sus datos.</li>
              <li><strong class="text-slate-900 dark:text-white">Credenciales de Acceso:</strong> El miembro accederá a su cuenta mediante su usuario/correo y clave de seguridad. El miembro es el único responsable por todas las ofertas y publicaciones efectuadas desde su cuenta.</li>
              <li><strong class="text-slate-900 dark:text-white">Derecho de Admisión:</strong> ruedas.store se reserva el derecho de rechazar cualquier solicitud de registro o cancelar un registro previo sin obligación de comunicar los motivos y sin que ello genere derecho a indemnización alguna.</li>
            </ul>
          </section>

          <!-- Section 5 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">5</span>
              Reglas de Uso de ruedas.store
            </h2>
            <p class="mb-2">Al utilizar www.ruedas.store, el usuario se compromete a NO:</p>
            <ol class="list-decimal list-inside space-y-1.5 pl-2">
              <li>Publicar anuncios en categorías que no correspondan (ej. publicar maquinaria en la categoría de motocicletas).</li>
              <li>Publicar en un mismo anuncio más de un vehículo, máquina o producto.</li>
              <li>Infringir ninguna ley, derechos de terceros o nuestras políticas de artículos restringidos.</li>
              <li>Utilizar el sitio si es menor de 18 años o no cuenta con capacidad legal para contratar según las leyes del Estado Plurinacional de Bolivia.</li>
              <li>Publicar contenido falso, engañoso, difamatorio o con documentación inconsistente de vehículos/maquinaria.</li>
              <li>Transferir su cuenta o seudónimo a un tercero sin nuestro consentimiento.</li>
              <li>Distribuir virus o tecnologías que vulneren la plataforma.</li>
              <li>Copiar, modificar o distribuir contenido del Sitio Web protegido por derechos de autor o marcas registradas de ruedas.store.</li>
              <li>Negar la responsabilidad de conocimiento acerca de la autenticidad, legalidad y estado técnico de los bienes que ofrecen en sus anuncios.</li>
            </ol>
          </section>

          <!-- Section 6 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">6</span>
              Derechos de Propiedad Intelectual
            </h2>
            <p class="mb-3">
              Queda prohibido publicar contenido que infrinja derechos de propiedad intelectual de terceros. Quien viole dichos derechos asumirá la total responsabilidad por los daños causados.
            </p>
            <p>
              <strong class="text-slate-900 dark:text-white">• Denuncias de Infracción:</strong> Los titulares de marcas, patentes o derechos de autor pueden denunciar publicaciones que vulneren sus derechos enviando un correo a <a href="mailto:denuncias@ruedas.store" class="text-blue-600 dark:text-blue-400 hover:underline">denuncias@ruedas.store</a>. Tras verificar la denuncia, el anuncio será retirado de inmediato.
            </p>
          </section>

          <!-- Section 7 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">7</span>
              Artículos y Contenidos Prohibidos
            </h2>
            <p class="mb-3">
              Queda estrictamente prohibido colocar publicidad, requerimiento o venta en ruedas.store de los siguientes bienes o servicios:
            </p>
            <ul class="list-disc list-inside space-y-1.5 pl-2">
              <li><strong class="text-red-600 dark:text-red-400">Vehículos o Maquinarias Robadas/Indocumentadas:</strong> Está absolutamente prohibida la publicación de vehículos, motos o maquinaria pesada/agrícola robada, clonada, chuto (ilegal) o sin los registros legales correspondientes exigidos por la ley boliviana. ruedas.store colaborará con la Policía Boliviana y autoridades competentes en la investigación de dichos casos.</li>
              <li>Armas de fuego, municiones, explosivos o material militar.</li>
              <li>Estupefacientes, drogas o sustancias no permitidas.</li>
              <li>Medicamentos o insumos médicos.</li>
              <li>Artículos de contrabando o adulterados.</li>
              <li>Oferta de personas, órganos o tejido humano.</li>
              <li>Fauna salvaje, especies protegidas o en peligro de extinción.</li>
              <li>Monedas, billetes o valores falsificados.</li>
              <li>Servicios o contenidos de carácter pornográfico, prostitución o trata de personas.</li>
              <li>Documentos de identidad reales o falsificados (C.I., licencias de conducir, RUATs clonados, etc.).</li>
              <li>Servicios de hacking, cracking o clonación electrónica de sistemas vehiculares.</li>
              <li>Reventa ilícita de entradas, loterías o rifas no autorizadas.</li>
              <li>Cualquier anuncio destinado a la burla, engaño, estafa o que carezca de seriedad comercial.</li>
            </ul>
          </section>

          <!-- Section 8 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">8</span>
              Sanciones por Infracción
            </h2>
            <p class="mb-2">Si una publicación infringe las políticas del sitio, ruedas.store podrá aplicar las siguientes sanciones:</p>
            <ol class="list-decimal list-inside space-y-1 pl-2">
              <li>Cancelación o eliminación inmediata del anuncio.</li>
              <li>Limitación de los privilegios de la cuenta.</li>
              <li>Suspensión temporal o definitiva de la cuenta del Miembro.</li>
              <li>Remisión del caso y antecedentes a las autoridades policiales o judiciales de Bolivia.</li>
            </ol>
          </section>

          <!-- Section 9 -->
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold">9</span>
              Modificación de Condiciones
            </h2>
            <p>
              ruedas.store se reserva el derecho de modificar estas Políticas y Condiciones de Uso en cualquier momento mediante la publicación de los términos modificados en el Sitio Web. Es responsabilidad del Miembro mantenerse informado de los cambios. Si no está de acuerdo con las modificaciones, el Miembro podrá dar de baja y cerrar su cuenta.
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
export class PrivacyComponent {}
