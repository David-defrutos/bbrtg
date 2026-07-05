// Documento generado el 2026-07-05-1710
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type WizardStep = 'inicio' | 'raza' | 'atributos' | 'habilidades' | 'dotes' | 'dios' | 'plan' | 'ficha'

/** Orden del asistente de creación (sin 'inicio', que es el paso previo) */
const WIZARD_STEPS: WizardStep[] = ['raza', 'atributos', 'habilidades', 'dotes', 'dios', 'plan']

export const useUiStore = defineStore('ui', () => {
  const step       = ref<WizardStep>('inicio')
  const nivelVista = ref<number>(1) // nivel cuya ficha se muestra en el panel lateral

  function goTo(s: WizardStep)  { step.value = s }
  function next() {
    const i = WIZARD_STEPS.indexOf(step.value)
    if (i >= 0 && i < WIZARD_STEPS.length - 1) step.value = WIZARD_STEPS[i + 1]!
  }
  function back() {
    const i = WIZARD_STEPS.indexOf(step.value)
    if (i > 0) step.value = WIZARD_STEPS[i - 1]!
    else step.value = 'inicio'
  }
  function setNivelVista(n: number) { nivelVista.value = Math.max(1, Math.min(30, n)) }

  return { step, nivelVista, WIZARD_STEPS, goTo, next, back, setNivelVista }
}, {
  // Un F5 vuelve al mismo paso y nivel de vista (junto al wizardDraft persistido)
  persist: { pick: ['step', 'nivelVista'] },
})
