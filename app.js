function calcular() {
  // 1. Obtener valores
  const dContrato = parseFloat(document.getElementById('dContrato').value) || 0;
  const dReal = parseFloat(document.getElementById('dReal').value) || 0;
  const alpha = parseFloat(document.getElementById('alpha').value) || 0;
  const T = parseFloat(document.getElementById('tendencia').value) || 0;
  const t = parseFloat(document.getElementById('semana').value) || 1;

  const iEst = parseFloat(document.getElementById('estacionalidad').value) || 1;
  const fProm = parseFloat(document.getElementById('promocion').value) || 1;
  const fExt = parseFloat(document.getElementById('entorno').value) || 1;

  const Z = parseFloat(document.getElementById('nivelServicio').value) || 1.65;
  const sigma = parseFloat(document.getElementById('sigma').value) || 0;
  const L = parseFloat(document.getElementById('leadTime').value) || 1;

  // 2. Cálculo de la fórmula
  const baseSuavizada = (alpha * dReal) + ((1 - alpha) * (dContrato + (T * t)));
  const demandaContexto = baseSuavizada * iEst * fProm * fExt;
  const colchonSeguridad = Z * sigma * Math.sqrt(L);
  const demandaTotal = Math.round(demandaContexto + colchonSeguridad);

  // 3. Mostrar resultados
  document.getElementById('resTotal').textContent = `${demandaTotal.toLocaleString('es-ES')} uds.`;
  document.getElementById('resBase').textContent = Math.round(demandaContexto).toLocaleString('es-ES');
  document.getElementById('resStock').textContent = Math.round(colchonSeguridad).toLocaleString('es-ES');

  // 4. Evaluar Banda de Tolerancia respecto al contrato
  const badge = document.getElementById('zonaBadge');
  const desviacion = dContrato > 0 ? ((demandaTotal - dContrato) / dContrato) * 100 : 0;

  badge.className = 'badge';
  if (desviacion <= 15) {
    badge.classList.add('verde');
    badge.textContent = `Zona Verde (+${desviacion.toFixed(1)}% s/contrato)`;
  } else if (desviacion <= 30) {
    badge.classList.add('ambar');
    badge.textContent = `Zona Ámbar (+${desviacion.toFixed(1)}% - Requiere preaviso)`;
  } else {
    badge.classList.add('roja');
    badge.textContent = `Zona Roja (+${desviacion.toFixed(1)}% - Renegociar/Spot)`;
  }
}

// Ejecutar cálculo inicial al abrir
window.addEventListener('DOMContentLoaded', calcular);

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.error('Error SW:', err));
}
