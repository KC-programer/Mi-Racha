/* =========================================================
   Mi Racha · lógica de la aplicación
   ------------------------------------------------------------
   La app tiene 6 capas, de abajo hacia arriba:
     1. Almacen       -> guarda las sesiones en el navegador.
     2. Fechas        -> trabaja siempre con la hora local.
     3. BaseDeDatos   -> guarda y consulta las sesiones con SQL real.
     4. calcularRacha -> cuenta los días consecutivos hasta hoy.
     5. Interfaz      -> dibuja las pantallas y responde a los clics.
     6. Eventos       -> conecta los clics y arranca la aplicación.
   ========================================================= */

'use strict';

/* =========================================================
   1. ALMACÉN LOCAL
   Envuelve localStorage para que la app nunca se rompa si el
   navegador lo bloquea (o si el almacenamiento está lleno).
   ========================================================= */

const Claves = {
  sesiones: 'miRacha:sesiones',
  frase: 'miRacha:frase',
  modo: 'miRacha:modo'
};

const Almacen = (function () {
  // 'memoria' hace doble trabajo: es el almacén de respaldo cuando el
  // navegador no deja guardar, y además la copia donde se escribe siempre.
  // Por eso 'escribir' la actualiza en los dos casos, pero 'leer' solo la
  // consulta cuando no hay persistencia.
  const memoria = {};
  let disponible = true;

  // No hay forma de preguntarle a localStorage si va a dejar escribir sin
  // intentarlo de verdad, así que se graba una clave y se borra acto seguido.
  // No quitar esta prueba: es lo que detecta el modo privado, las cookies
  // bloqueadas y el almacenamiento lleno.
  try {
    const prueba = 'miRacha:prueba';
    localStorage.setItem(prueba, '1');
    localStorage.removeItem(prueba);
  } catch (error) {
    disponible = false;
  }

  return {
    hayPersistencia: function () {
      return disponible;
    },

    leer: function (clave, valorPorDefecto) {
      try {
        if (!disponible) {
          return Object.prototype.hasOwnProperty.call(memoria, clave) ? memoria[clave] : valorPorDefecto;
        }
        const texto = localStorage.getItem(clave);
        return texto === null ? valorPorDefecto : JSON.parse(texto);
      } catch (error) {
        return valorPorDefecto;
      }
    },

    escribir: function (clave, valor) {
      memoria[clave] = valor;
      if (!disponible) return true;
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
      } catch (error) {
        return false;
      }
    }
  };
})();

/* =========================================================
   2. FECHAS
   Todo se calcula con la hora local del usuario (nunca UTC),
   usando el constructor new Date(año, mes, día).
   ========================================================= */

/* Convierte un Date en texto "AAAA-MM-DD" usando sus datos locales. */
function claveFecha(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return anio + '-' + mes + '-' + dia;
}

function claveDeHoy() {
  return claveFecha(new Date());
}

/* Suma (o resta) días a una clave "AAAA-MM-DD". */
function moverDias(clave, cantidad) {
  const partes = clave.split('-').map(Number);
  const fecha = new Date(partes[0], partes[1] - 1, partes[2] + cantidad);
  return claveFecha(fecha);
}

/* Índice del día de la semana, con 0 = lunes y 6 = domingo.
   'Date.getDay()' devuelve 0 para el domingo, así que el '+ 6'
   y el '% 7' mueven el origen al lunes: la convención declarada
   en RF-002 para que dos implementaciones no den semanas
   distintas. */
function indiceDiaSemana(clave) {
  const partes = clave.split('-').map(Number);
  return (new Date(partes[0], partes[1] - 1, partes[2]).getDay() + 6) % 7;
}

/* Clave del lunes de la última semana ya cerrada: el lunes de la
   semana en curso menos siete días, para no resumir nunca una
   semana que todavía está en marcha. */
function ultimaSemanaCerrada(hoy) {
  return moverDias(hoy, -(indiceDiaSemana(hoy) + 7));
}

/* Clave del lunes de la semana a la que pertenece 'clave', esté
   cerrada o en curso: con ella cada sesión cae en su semana con
   una sola comparación de texto. */
function lunesDeSemana(clave) {
  return moverDias(clave, -indiceDiaSemana(clave));
}

/* Las siete claves de lunes a domingo. Todas se devuelven aunque
   no tengan sesión, porque los siete días se pintan siempre: un
   día vacío dentro de una semana con actividad también se ve. */
function clavesSemana(lunes) {
  const claves = [];
  for (let i = 0; i < 7; i++) {
    claves.push(moverDias(lunes, i));
  }
  return claves;
}

/* Texto bonito para mostrar: "lunes, 15 de septiembre". */
function fechaLegible(clave) {
  const partes = clave.split('-').map(Number);
  const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
  const texto = fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* =========================================================
   3. BASE DE DATOS
   Las sesiones se consultan con SQL real (SQLite) dentro del
   navegador, así que no hace falta instalar ni levantar un
   servidor.

   Lo que se guarda en el navegador es una lista de sesiones en
   texto plano, y al abrir la app esa lista se carga en la base
   de datos. Así los datos nunca se dañan y se pueden leer
   desde las herramientas del navegador.
   ========================================================= */

/* Dos cosas que no se deducen del SQL: el CHECK (minutos > 0) replica en la
   base de datos la validación que hace el formulario, y el índice de fecha
   existe para el ORDER BY de 'filas()'. Si se cambia el esquema, la
   traducción de los datos ya guardados va en 'sesionesValidas'. */
const ESQUEMA_SQL = [
  'CREATE TABLE IF NOT EXISTS sesiones (',
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,',
  '  fecha TEXT NOT NULL,',
  '  frase TEXT NOT NULL,',
  '  minutos INTEGER NOT NULL CHECK (minutos > 0),',
  '  avances TEXT NOT NULL DEFAULT \'\',',
  '  creado_en TEXT NOT NULL',
  ');',
  'CREATE INDEX IF NOT EXISTS indice_sesiones_fecha ON sesiones (fecha DESC);'
].join('\n');

const RUTA_SQL_JS = 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/';

const BaseDeDatos = {
  modo: 'respaldo',
  db: null,
  sesionesRespaldo: [],

  /* Prepara la base de datos y carga las sesiones guardadas. */
  iniciar: async function () {
    const guardadas = Almacen.leer(Claves.sesiones, []);
    const lista = this.sesionesValidas(Array.isArray(guardadas) ? guardadas : []);

    // Si a la primera no se puede, se reintenta una vez: a veces la
    // descarga falla un instante y a la segunda sí sale.
    for (let intento = 1; intento <= 2; intento++) {
      try {
        if (window.sqlJsNoDisponible || typeof initSqlJs !== 'function') {
          throw new Error('sql.js no está disponible');
        }
        const SQL = await initSqlJs({
          locateFile: function (archivo) {
            return RUTA_SQL_JS + archivo;
          }
        });
        this.db = new SQL.Database();
        this.db.run(ESQUEMA_SQL);
        lista.forEach(this.insertar, this);
        this.modo = 'sql';
        return;
      } catch (error) {
        console.warn('Intento ' + intento + ' de iniciar SQLite falló:', error);
      }
    }

    this.modo = 'respaldo';
    this.sesionesRespaldo = lista;
  },

  /* Descarta las sesiones guardadas que estén incompletas o mal
     escritas y les deja los tipos correctos, para que un dato tocado
     a mano no impida que la aplicación arranque. */
  sesionesValidas: function (lista) {
    return lista
      .filter(function (s) {
        return s && Number.isInteger(s.id) && typeof s.fecha === 'string' &&
          /^\d{4}-\d{2}-\d{2}$/.test(s.fecha) && Number.isFinite(Number(s.minutos)) &&
          Number(s.minutos) > 0;
      })
      .map(function (s) {
        return {
          id: s.id,
          fecha: s.fecha,
          frase: typeof s.frase === 'string' && s.frase ? s.frase : 'Sesión de estudio',
          minutos: Number(s.minutos),
          avances: typeof s.avances === 'string' ? s.avances : '',
          creado_en: typeof s.creado_en === 'string' && s.creado_en ? s.creado_en : s.fecha + ' 00:00:00'
        };
      });
  },

  /* Inserta una sesión ya existente, sin volver a guardar. */
  insertar: function (sesion) {
    this.db.run(
      'INSERT INTO sesiones (id, fecha, frase, minutos, avances, creado_en) VALUES (?, ?, ?, ?, ?, ?)',
      [sesion.id, sesion.fecha, sesion.frase, sesion.minutos, sesion.avances, sesion.creado_en]
    );
  },

  /* Escribe las sesiones actuales en el navegador. */
  guardar: function () {
    Almacen.escribir(Claves.sesiones, this.modo === 'sql' ? this.filas() : this.sesionesRespaldo);
  },

  /* Todas las sesiones, de la más reciente a la más antigua.
     El id al final rompe los empates cuando dos sesiones se
     guardan en el mismo segundo. */
  filas: function () {
    const resultado = this.db.exec(
      'SELECT id, fecha, frase, minutos, avances, creado_en FROM sesiones ' +
      'ORDER BY fecha DESC, creado_en DESC, id DESC'
    );
    if (!resultado.length) return [];
    return resultado[0].values.map(function (fila) {
      return {
        id: fila[0],
        fecha: fila[1],
        frase: fila[2],
        minutos: fila[3],
        avances: fila[4],
        creado_en: fila[5]
      };
    });
  },

  listar: function () {
    if (this.modo === 'sql') return this.filas();
    return this.sesionesRespaldo.slice().sort(function (a, b) {
      if (a.fecha !== b.fecha) return String(b.fecha).localeCompare(String(a.fecha));
      if (a.creado_en !== b.creado_en) return String(b.creado_en).localeCompare(String(a.creado_en));
      return b.id - a.id;
    });
  },

  /* Crea una sesión nueva y devuelve el identificador que se le asignó. */
  crear: function (datos) {
    const creado = new Date();
    const marca = claveFecha(creado) + ' ' +
      String(creado.getHours()).padStart(2, '0') + ':' +
      String(creado.getMinutes()).padStart(2, '0') + ':' +
      String(creado.getSeconds()).padStart(2, '0');

    let id;

    if (this.modo === 'sql') {
      this.db.run(
        'INSERT INTO sesiones (fecha, frase, minutos, avances, creado_en) VALUES (?, ?, ?, ?, ?)',
        [datos.fecha, datos.frase, datos.minutos, datos.avances, marca]
      );
      id = this.db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    } else {
      id = this.sesionesRespaldo.reduce(function (mayor, sesion) {
        return Math.max(mayor, sesion.id);
      }, 0) + 1;
      this.sesionesRespaldo.push({
        id: id,
        fecha: datos.fecha,
        frase: datos.frase,
        minutos: datos.minutos,
        avances: datos.avances,
        creado_en: marca
      });
    }

    this.guardar();
    return id;
  },

  borrar: function (id) {
    if (this.modo === 'sql') {
      this.db.run('DELETE FROM sesiones WHERE id = ?', [id]);
    } else {
      this.sesionesRespaldo = this.sesionesRespaldo.filter(function (sesion) {
        return sesion.id !== id;
      });
    }
    this.guardar();
  },

  /* Totales para el resumen del historial. */
  resumen: function () {
    if (this.modo === 'sql') {
      const resultado = this.db.exec('SELECT COUNT(*), COALESCE(SUM(minutos), 0) FROM sesiones');
      if (!resultado.length) return { cantidad: 0, minutos: 0 };
      return { cantidad: resultado[0].values[0][0], minutos: resultado[0].values[0][1] };
    }
    return this.sesionesRespaldo.reduce(function (acumulado, sesion) {
      acumulado.cantidad += 1;
      acumulado.minutos += sesion.minutos;
      return acumulado;
    }, { cantidad: 0, minutos: 0 });
  },

  nombreModo: function () {
    return this.modo === 'sql' ? 'SQL (SQLite)' : 'modo de respaldo';
  }
};

/* =========================================================
   4. CÁLCULO DE LA RACHA
   Son días consecutivos que terminan hoy.
   - Si hoy hay sesión, la cuenta empieza en hoy.
   - Si hoy no hay sesión pero ayer sí, la racha sigue viva
     hasta que el día de hoy termine.
   - Sin ninguna sesión guardada no hay racha.
   ========================================================= */

function calcularRacha(sesiones) {
  const diasConSesion = new Set(sesiones.map(function (sesion) {
    return sesion.fecha;
  }));

  if (diasConSesion.size === 0) return 0;

  const hoy = claveDeHoy();
  let cursor = diasConSesion.has(hoy) ? hoy : moverDias(hoy, -1);
  if (!diasConSesion.has(cursor)) return 0;

  let racha = 0;
  while (diasConSesion.has(cursor)) {
    racha += 1;
    cursor = moverDias(cursor, -1);
  }
  return racha;
}

/* =========================================================
   5. INTERFAZ
   ========================================================= */

/* 'resumen-semanal' tiene que estar aquí desde el mismo momento que su
   <section> existe en el HTML: 'mostrarPantalla' solo oculta lo que está en
   esta lista, así que fuera de ella la pantalla nueva nunca se escondería y
   se quedarían dos visibles a la vez. */
const Pantallas = ['inicio', 'intencion', 'tablero', 'resumen-semanal'];

/* Toda la navegación de la app: se ocultan todas las pantallas y se deja
   visible la elegida. Depende del atributo 'hidden' y de que el CSS lo
   aplique con !important, porque si no lo que decide la visibilidad es
   display y las demás reglas de la hoja ganarían. */
function mostrarPantalla(nombre) {
  Pantallas.forEach(function (pantalla) {
    document.getElementById('pantalla-' + pantalla).hidden = pantalla !== nombre;
  });
  window.scrollTo(0, 0);
}

function mostrarMensaje(elemento, texto, esError) {
  elemento.textContent = texto;
  elemento.hidden = !texto;
  elemento.classList.toggle('mensaje--error', Boolean(esError));
}

function formatearTiempo(totalMinutos) {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  if (horas === 0) return minutos + ' min';
  if (minutos === 0) return horas + ' h';
  return horas + ' h ' + minutos + ' min';
}

/* Claves de lunes de las semanas ya cerradas que tienen alguna sesión, de más
   antigua a más reciente. Es un conjunto de semanas con actividad y no un
   intervalo, así que las semanas intermedias sin sesiones se omiten solas.
   El límite va incluido: 'ultimaSemanaCerrada' es el lunes de la última semana
   cerrada, y esa semana se ofrece siempre que tenga actividad (RF-005). Lo que
   se descarta es la semana en curso y cualquier otra posterior; el filtro es una
   comparación de texto, que ordena igual que la fecha porque las claves llevan
   los ceros. */
function calcularSemanasCerradas(sesiones, hoy) {
  const limite = ultimaSemanaCerrada(hoy);
  const semanas = new Set();

  sesiones.forEach(function (sesion) {
    const lunes = lunesDeSemana(sesion.fecha);
    if (lunes <= limite) semanas.add(lunes);
  });

  return Array.from(semanas).sort();
}

/* Minutos sumados y días con sesión de una semana. Las 'fecha' van a un Set
   porque varias sesiones del mismo día cuentan como un solo día, igual que en
   la racha. El 'Number()' protege el total por si el dato llega como texto:
   los minutos se suman y se pintan juntos, así que tienen que ser número. */
function calcularTotalesSemana(sesiones) {
  const dias = new Set();

  const minutos = sesiones.reduce(function (acumulado, sesion) {
    dias.add(sesion.fecha);
    return acumulado + Number(sesion.minutos);
  }, 0);

  return { minutos: minutos, dias: dias.size };
}

/* ---------- Resumen semanal ---------- */

/* Qué semana está abierta en la pantalla de resumen. Es estado en memoria de la
   sesión a propósito: la semana elegida no es un dato que deba guardarse, y al
   volver a entrar tiene que volver a la semana inicial. Por eso no está en
   'Claves' ni pasa por 'Almacen': no se persiste nada. */
let semanaSeleccionada = null;

/* Las sesiones de una semana agrupadas por su día: clave "AAAA-MM-DD" → sesiones.
   Es un 'Map' y no un objeto porque conserva el orden de entrada, y el de
   'listar()' (fecha DESC, creado_en DESC, id DESC) es exactamente el que RF-009
   pide dentro de un día. */
function agruparSesionesPorDia(sesiones) {
  const grupos = new Map();

  sesiones.forEach(function (sesion) {
    if (!grupos.has(sesion.fecha)) grupos.set(sesion.fecha, []);
    grupos.get(sesion.fecha).push(sesion);
  });

  return grupos;
}

/* "dd/mm" con los ceros que ya trae la clave. Nada de 'toLocaleDateString':
   medido en el navegador con 'es-ES' devuelve "28/9", sin el cero del mes, y
   RF-008 exige los ceros. */
function formatearDiaCorto(clave) {
  const partes = clave.split('-');
  return partes[2] + '/' + partes[1];
}

/* Rango de la semana: regla única de RF-008. El año va en los dos extremos solo
   cuando el del lunes y el del domingo difieren, que es el cruce de Año Nuevo y
   ningún otro; un cambio de mes dentro del mismo año va sin año. La cabecera y
   las opciones del selector salen de aquí, así que el texto es idéntico por
   construcción y no puede haber dos variantes que se separen al tocar una. */
function formatearRangoSemana(lunes) {
  const domingo = clavesSemana(lunes)[6];
  const inicio = lunes.split('-');
  const fin = domingo.split('-');

  if (inicio[0] === fin[0]) {
    return formatearDiaCorto(lunes) + ' - ' + formatearDiaCorto(domingo);
  }

  return formatearDiaCorto(lunes) + '/' + inicio[0] + ' - ' +
    formatearDiaCorto(domingo) + '/' + fin[0];
}

/* Dibuja la cabecera del resumen: el rango de la semana, el total de minutos y
   cuántos días tienen sesión. Empieza por el rango porque es la parte que tiene
   que coincidir carácter a carácter con el texto de la opción del selector. */
function pintarCabeceraResumen(lunes, totales) {
  document.getElementById('resumen-semanal').textContent =
    formatearRangoSemana(lunes) + ', ' +
    formatearTiempo(totales.minutos) + ', ' +
    totales.dias + (totales.dias === 1 ? ' día con sesión' : ' días con sesión');
}

/* Dibuja los siete días, de lunes a domingo y aunque no tengan sesión (RF-009):
   un día vacío dentro de una semana con actividad también se ve. Cada día lleva
   su fecha y el total de sus minutos, y debajo sus sesiones con los avances
   íntegros. El 'data-id' es lo que permite localizar una sesión concreta y
   comprobar su texto; la frase y el botón de eliminar no se copian aquí porque el
   resumen no las usa y esa acción es del tablero. */
function pintarDiasSemana(lunes, grupos) {
  const lista = document.getElementById('lista-dias');
  lista.textContent = '';

  clavesSemana(lunes).forEach(function (fecha) {
    const sesiones = grupos.get(fecha) || [];

    const dia = document.createElement('li');
    dia.className = 'dia';

    const fila = document.createElement('div');
    fila.className = 'dia__fila';

    const rotulo = document.createElement('span');
    rotulo.className = 'dia__fecha';
    rotulo.textContent = formatearDiaCorto(fecha);

    const minutos = document.createElement('span');
    minutos.className = 'dia__minutos';
    minutos.textContent = formatearTiempo(calcularTotalesSemana(sesiones).minutos);

    fila.appendChild(rotulo);
    fila.appendChild(minutos);
    dia.appendChild(fila);

    const items = document.createElement('ol');
    items.className = 'dia__sesiones';

    sesiones.forEach(function (sesion) {
      const item = document.createElement('li');
      item.className = 'sesion';
      item.dataset.id = String(sesion.id);

      const filaSesion = document.createElement('div');
      filaSesion.className = 'sesion__fila';

      // Sin la fecha: el día de arriba ya la dice, y repetirla tres veces por
      // día solo haría ruido.
      const minutosSesion = document.createElement('span');
      minutosSesion.className = 'sesion__minutos';
      minutosSesion.textContent = formatearTiempo(sesion.minutos);

      filaSesion.appendChild(minutosSesion);
      item.appendChild(filaSesion);

      // El texto va entero, sin recortar nada: es la razón de esta pantalla.
      const avances = document.createElement('p');
      avances.className = 'sesion__avances' + (sesion.avances ? '' : ' sesion__vacio');
      avances.textContent = sesion.avances || 'Sin avances anotados.';
      item.appendChild(avances);

      items.appendChild(item);
    });

    dia.appendChild(items);
    lista.appendChild(dia);
  });
}

/* Llena el selector con las semanas disponibles, de más antigua a más reciente:
   el 'value' de cada opción es la clave del lunes y el texto sale de
   'formatearRangoSemana'. El selector nunca lleva 'disabled', ni siquiera con una
   sola opción (RF-006), así que no se toca ese atributo en ningún camino. */
function poblarSelectorSemana(semanas, elegida) {
  const selector = document.getElementById('selector-semana');
  selector.textContent = '';

  semanas.forEach(function (lunes) {
    const opcion = document.createElement('option');
    opcion.value = lunes;
    opcion.textContent = formatearRangoSemana(lunes);
    selector.appendChild(opcion);
  });

  selector.value = elegida;
}

/* Orquestador de la pantalla de resumen. No se llama al arrancar ni al guardar
   una sesión (RF-003): solo la llaman al entrar en la pantalla y al cambiar el
   selector, así que relee 'claveDeHoy()' aquí y no guarda un "hoy" que caduca al
   cruzar medianoche. */
function pintarResumenSemanal() {
  const sesiones = BaseDeDatos.listar();
  const hoy = claveDeHoy();
  const cerradas = calcularSemanasCerradas(sesiones, hoy);

  // Sin ninguna semana cerrada con actividad no hay nada que elegir, así que se
  // ofrece la última cerrada con sus totales a cero (estado (a)). No hace falta un
  // mensaje propio: una semana sin sesiones ya se ve con sus siete días vacíos.
  const semanas = cerradas.length > 0 ? cerradas : [ultimaSemanaCerrada(hoy)];

  // La semana inicial es la última cerrada con actividad, y como las opciones van
  // de más antigua a más reciente es la última del array. Si lo que hay guardado
  // ya no está entre las opciones, cae a esa: pasa al abrir, porque entonces está
  // a null, y si los datos cambiaron con la pantalla abierta.
  if (semanas.indexOf(semanaSeleccionada) === -1) {
    semanaSeleccionada = semanas[semanas.length - 1];
  }

  poblarSelectorSemana(semanas, semanaSeleccionada);

  const deLaSemana = sesiones.filter(function (sesion) {
    return lunesDeSemana(sesion.fecha) === semanaSeleccionada;
  });

  pintarCabeceraResumen(semanaSeleccionada, calcularTotalesSemana(deLaSemana));
  pintarDiasSemana(semanaSeleccionada, agruparSesionesPorDia(deLaSemana));
}

/* Dibuja la tarjeta de la racha. */
function pintarRacha(sesiones) {
  const racha = calcularRacha(sesiones);
  const hoy = claveDeHoy();
  const registroHoy = sesiones.some(function (sesion) {
    return sesion.fecha === hoy;
  });

  document.getElementById('racha-dias').textContent = String(racha);
  document.querySelector('.racha').classList.toggle('racha--activa', racha > 0);

  let texto;
  if (racha === 0) {
    texto = sesiones.length === 0
      ? 'Registra tu primera sesión para empezar'
      : 'Empieza una racha nueva hoy';
  } else {
    texto = racha === 1 ? 'día de racha' : 'días de racha';
  }
  document.getElementById('racha-texto').textContent = texto;

  let nota;
  if (racha === 0) {
    nota = 'Un día con al menos una sesión guardada enciende tu racha.';
  } else if (registroHoy) {
    nota = 'Hoy ya está registrado. Así se mantiene viva tu racha.';
  } else {
    nota = 'Todavía no registras hoy. Tu racha sigue viva hasta que termine el día.';
  }
  document.getElementById('racha-nota').textContent = nota;
}

/* Dibuja el historial de sesiones. */
function pintarHistorial(sesiones) {
  sesiones = BaseDeDatos.listar().slice(0, 5);
  const lista = document.getElementById('lista-sesiones');
  const vacia = document.getElementById('lista-vacia');
  const resumen = document.getElementById('resumen');

  lista.textContent = '';
  vacia.hidden = sesiones.length > 0;

  const totales = BaseDeDatos.resumen();
  resumen.textContent = sesiones.length === 0 ? '' :
    sesiones.length + (sesiones.length === 1 ? ' sesión, ' : ' sesiones, ') +
    formatearTiempo(totales.minutos) + ' de estudio en total';

  sesiones.forEach(function (sesion) {
    const item = document.createElement('li');
    item.className = 'sesion';
    item.dataset.id = String(sesion.id);

    const fila = document.createElement('div');
    fila.className = 'sesion__fila';

    const fecha = document.createElement('span');
    fecha.className = 'sesion__fecha';
    fecha.textContent = fechaLegible(sesion.fecha);

    const minutos = document.createElement('span');
    minutos.className = 'sesion__minutos';
    minutos.textContent = formatearTiempo(sesion.minutos);

    fila.appendChild(fecha);
    fila.appendChild(minutos);
    item.appendChild(fila);

    const frase = document.createElement('p');
    frase.className = 'sesion__frase';
    frase.textContent = '“' + sesion.frase + '”';
    item.appendChild(frase);

    const avances = document.createElement('p');
    avances.className = 'sesion__avances' + (sesion.avances ? '' : ' sesion__vacio');
    avances.textContent = sesion.avances || 'Sin avances anotados.';
    item.appendChild(avances);

    const borrar = document.createElement('button');
    borrar.type = 'button';
    borrar.className = 'boton-borrar';
    borrar.textContent = 'Eliminar esta sesión';
    borrar.setAttribute('aria-label', 'Eliminar la sesión del ' + fechaLegible(sesion.fecha));
    borrar.addEventListener('click', function () {
      const confirmado = window.confirm(
        '¿Eliminar la sesión del ' + fechaLegible(sesion.fecha) + '?\nEsta acción no se puede deshacer.'
      );
      if (!confirmado) return;
      BaseDeDatos.borrar(sesion.id);
      pintarTodo();
    });
    item.appendChild(borrar);

    lista.appendChild(item);
  });
}

/* Pinta el resumen que se muestra en la pantalla de inicio. */
function pintarResumenInicio() {
  const sesiones = BaseDeDatos.listar();
  const elemento = document.getElementById('resumen-inicio');
  if (sesiones.length === 0) {
    elemento.textContent = 'Todavía no tienes sesiones registradas.';
    return;
  }
  const racha = calcularRacha(sesiones);
  const totales = BaseDeDatos.resumen();
  elemento.textContent = 'Llevas ' + racha + (racha === 1 ? ' día' : ' días') +
    ' de racha y ' + formatearTiempo(totales.minutos) + ' de estudio en total.';
}

/* Refresca las partes del tablero que dependen de los datos. */
function pintarTodo(idDestacado) {
  const sesiones = BaseDeDatos.listar();
  pintarRacha(sesiones);
  pintarHistorial(sesiones);

  if (idDestacado !== undefined) {
    const item = document.querySelector('.sesion[data-id="' + idDestacado + '"]');
    if (item) {
      item.classList.add('sesion--nueva');
      item.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
}

function abrirTablero() {
  const frase = Almacen.leer(Claves.frase, '');
  document.getElementById('frase-actual').textContent = frase || 'Sin frase';
  mostrarPantalla('tablero');
  pintarTodo();
}

function prepararFormularioSesion() {
  const hoy = claveDeHoy();
  const campoFecha = document.getElementById('fecha');
  campoFecha.value = hoy;
  campoFecha.max = hoy;
  document.getElementById('minutos').value = '';
  document.getElementById('avances').value = '';
}

/* =========================================================
   6. EVENTOS
   ========================================================= */

function conectarEventos() {

  // Pantalla 1 -> 2
  document.getElementById('boton-iniciar-sesion').addEventListener('click', function () {
    mostrarPantalla('intencion');
    const campo = document.getElementById('frase');
    campo.value = Almacen.leer(Claves.frase, '');
    mostrarMensaje(document.getElementById('mensaje-frase'), '', false);
    campo.focus();
  });

  // Pantalla 2: la frase y el botón "Listo"
  document.getElementById('formulario-frase').addEventListener('submit', function (evento) {
    evento.preventDefault();
    const campo = document.getElementById('frase');
    const frase = campo.value.trim();
    const mensaje = document.getElementById('mensaje-frase');

    if (frase.length === 0) {
      mostrarMensaje(mensaje, 'Escribe una frase para empezar el día.', true);
      campo.focus();
      return;
    }

    Almacen.escribir(Claves.frase, frase);
    abrirTablero();
  });

  // Cambiar la frase en cualquier momento
  document.getElementById('boton-cambiar-frase').addEventListener('click', function () {
    mostrarPantalla('intencion');
    document.getElementById('frase').focus();
  });

  // Alternar modo claro/oscuro
  document.getElementById('boton-modo-claro').addEventListener('click', function () {
    // 1. Alternar la clase modo-claro en <body>
    document.body.classList.toggle('modo-claro');

    // 2. Guardar la nueva preferencia en localStorage (si está disponible)
    //    Usamos 'claro' u 'oscuro' según el estado actual de la clase
    const modoActual = document.body.classList.contains('modo-claro');
    const valorModo = modoActual ? 'claro' : 'oscuro';
    if (Almacen.hayPersistencia()) {
      Almacen.escribir(Claves.modo, valorModo);
    }

    // 3. Anunciar el cambio usando mostrarMensaje
    const mensajeElemento = document.getElementById('mensaje-formulario');
    const textoAnuncio = modoActual ? 'Modo cambiado a claro' : 'Modo cambiado a oscuro';
    mostrarMensaje(mensajeElemento, textoAnuncio, false);

    // 4. Actualizar atributo aria-checked del botón
    const botonModo = document.getElementById('boton-modo-claro');
    botonModo.setAttribute('aria-checked', modoActual);

    // 5. Actualizar el pie #pie-modo para reflejar el modo actual
    const pie = document.getElementById('pie-modo');
    const modoSQL = BaseDeDatos.modo;  // 'sql' o 'respaldo'
    const sqlModoTexto = modoSQL === 'sql' ? 'SQL (SQLite)' : 'respaldo';

    if (modoActual) {
      if (modoSQL === 'respaldo') {
        pie.textContent = 'Modo: Claro. Base de datos: respaldo.';
      } else {
        pie.textContent = 'Modo: Claro. Base de datos: SQL (SQLite)';
      }
    } else {
      pie.textContent = 'Base de datos: ' + sqlModoTexto;
    }
  });

  // Guardar una sesión de estudio
  document.getElementById('formulario-sesion').addEventListener('submit', function (evento) {
    evento.preventDefault();
    const mensaje = document.getElementById('mensaje-formulario');

    const campoFecha = document.getElementById('fecha');
    const campoMinutos = document.getElementById('minutos');
    const campoAvances = document.getElementById('avances');
    const hoy = claveDeHoy();
    const fecha = campoFecha.value;

    if (!fecha) {
      mostrarMensaje(mensaje, 'Elige una fecha.', true);
      return;
    }
    // 'fecha' y 'hoy' son las dos 'AAAA-MM-DD' con ceros a la izquierda, así
    // que compararlas como texto las ordena igual que compararlas como fecha.
    // No pasar a un formato ISO con horas: rompería esto en silencio, porque
    // seguiría pareciendo una fecha.
    if (fecha > hoy) {
      mostrarMensaje(mensaje, 'No puedes registrar fechas futuras.', true);
      return;
    }

    const minutos = Number.parseInt(campoMinutos.value, 10);
    if (!Number.isFinite(minutos) || minutos <= 0) {
      mostrarMensaje(mensaje, 'Los minutos estudiados deben ser un número mayor que 0.', true);
      campoMinutos.focus();
      return;
    }

    const idNuevo = BaseDeDatos.crear({
      fecha: fecha,
      frase: Almacen.leer(Claves.frase, 'Sesión de estudio'),
      minutos: minutos,
      avances: campoAvances.value.trim()
    });

    const historial = BaseDeDatos.listar();
    const racha = calcularRacha(historial);
    mostrarMensaje(mensaje, '¡Sesión guardada! Racha actual: ' +
      racha + (racha === 1 ? ' día.' : ' días.'), false);

    // Se conservan la fecha y la frase del día; solo se limpian los textos.
    campoMinutos.value = '';
    campoAvances.value = '';

    pintarTodo(idNuevo);
  });

  /* ---------- Pantalla 4: resumen semanal ---------- */

  /* Entrar en el resumen semanal. Poner la semana a null antes de pintar es lo
     que hace que al reabrir vuelva a la semana inicial: 'pintarResumenSemanal'
     sustituye cualquier selección que no esté entre las opciones, y null nunca
     lo está. El foco va al encabezado porque es lo que anuncia la pantalla
     nueva a quien navega con teclado o lector de pantalla; su tabindex="-1" es
     lo que permite ese foco, sin él se perdería en el body al quedar el botón
     de entrada dentro de una pantalla oculta. El orden importa: ni pintar ni
     enfocar sirven sobre algo que sigue oculto. */
  function abrirResumenSemanal() {
    semanaSeleccionada = null;
    mostrarPantalla('resumen-semanal');
    pintarResumenSemanal();
    document.getElementById('encabezado-resumen-semanal').focus();
  }

  document.getElementById('boton-ver-resumenes').addEventListener('click', function () {
    abrirResumenSemanal();
  });

  /* Volver al tablero con 'mostrarPantalla' a secas. 'pintarTodo' y
     'abrirTablero' rehacen el historial y con él el scrollTop de '.sesiones',
     que es justo lo que hay que conservar; no repintando, el scroll, los valores
     del formulario, '#frase-actual' y '#mensaje-formulario' sobreviven sin
     tocar nada. El foco vuelve al botón de entrada, que sigue en la pantalla a
     la que se vuelve. */
  document.getElementById('boton-volver-tablero').addEventListener('click', function () {
    mostrarPantalla('tablero');
    document.getElementById('boton-ver-resumenes').focus();
  });

  /* Elegir semana es la otra acción del usuario que repinta el resumen, y la
     única además de entrar en la pantalla: guardar o borrar una sesión con la
     pantalla abierta no lo actualiza (RF-003). El 'value' de la opción es la
     clave del lunes, que es lo que espera el filtro de 'pintarResumenSemanal'. */
  document.getElementById('selector-semana').addEventListener('change', function (evento) {
    semanaSeleccionada = evento.target.value;
    pintarResumenSemanal();
  });
}

/* Arranque de la aplicación. */
async function iniciar() {
  await BaseDeDatos.iniciar();

  // 1. Leer modo guardado de localStorage
  let modoGuardado = null;
  if (Almacen.hayPersistencia()) {
    modoGuardado = Almacen.leer(Claves.modo, null);
  }

  // 2. Determinar modo actual según RF-005
  const body = document.body;
  const pie = document.getElementById('pie-modo');
  const modoSQL = BaseDeDatos.modo;  // 'sql' o 'respaldo'
  const sqlModoTexto = modoSQL === 'sql' ? 'SQL (SQLite)' : 'respaldo';

  let modoClaro = false;
  let esModoMemoria = false;

  if (modoGuardado === 'claro') {
    modoClaro = true;
  } else if (modoGuardado === 'oscuro') {
    modoClaro = false;
  } else {
    // modoGuardado es null: detectar prefers-color-scheme del sistema
    const media = window.matchMedia('(prefers-color-scheme: light)');
    if (media.matches) {
      modoClaro = true;
      // Si localStorage no está disponible, el modo viene de la detección del sistema
      // y se avisa en el pie de que la elección se perderá al cerrar
      if (!Almacen.hayPersistencia()) {
        esModoMemoria = true;
      }
    } else {
      modoClaro = false;
    }
  }

  // Aplicar clase en <body>
  if (modoClaro) {
    body.classList.add('modo-claro');
  } else {
    body.classList.remove('modo-claro');
  }

  // 3. Actualizar pie según el estado actual (5 estados posibles)
  if (modoClaro) {
    if (modoSQL === 'respaldo') {
      // Estado (e): Modo degradado sin sql.js
      // Igual que (b) o (c) pero el pie indica respaldo
      pie.textContent = 'Modo: Claro. Base de datos: respaldo.';
    } else if (modoGuardado === 'claro') {
      // Estado (b): Modo claro guardado en localStorage
      pie.textContent = 'Modo: Claro. Base de datos: SQL (SQLite)';
    } else if (esModoMemoria) {
      // Estado (d): Modo claro degradado sin localStorage
      pie.textContent = 'Modo: Claro (memoria)';
    } else {
      // Estado (c): Modo claro por detección del sistema
      pie.textContent = 'Modo: Claro (sistema)';
    }
  } else {
    // Modo oscuro (estado a)
    pie.textContent = 'Base de datos: ' + sqlModoTexto;
  }

  // Si ya hay una frase guardada se salta al tablero: la pantalla de inicio
  // solo aparece la primera vez. Cambiar la frase más adelante no pasa por
  // aquí, va por su propio botón.
  const hayFrase = Almacen.leer(Claves.frase, '');
  if (hayFrase) {
    abrirTablero();
  } else {
    pintarResumenInicio();
    mostrarPantalla('inicio');
  }

  conectarEventos();
  prepararFormularioSesion();
}

document.addEventListener('DOMContentLoaded', iniciar);
