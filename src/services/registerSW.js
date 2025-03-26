import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('La aplicación está lista para uso offline')
  },
})