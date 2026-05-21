export interface Modulo {
  id: string
  title: string
  description: string
  olimpiada: string
  phase: string
  order: number
  totalQuestions: number
}

export interface Trilha {
  id: string
  name: string
  olimpiada: string
  phase: string
  modules: Modulo[]
}

export const trilhas: Trilha[] = [
  {
    id: 'obmep-fase1',
    name: 'OBMEP - Fase 1',
    olimpiada: 'obmep',
    phase: 'Fase 1',
    modules: [
      {
        id: 'obmep-f1-aritmetica',
        title: 'Aritmética',
        description: 'Divisibilidade, MDC, MMC e números primos',
        olimpiada: 'obmep',
        phase: 'Fase 1',
        order: 1,
        totalQuestions: 10,
      },
      {
        id: 'obmep-f1-algebra',
        title: 'Álgebra',
        description: 'Equações, inequações e expressões algébricas',
        olimpiada: 'obmep',
        phase: 'Fase 1',
        order: 2,
        totalQuestions: 10,
      },
      {
        id: 'obmep-f1-geometria',
        title: 'Geometria',
        description: 'Figuras planas, perímetro, área e semelhança',
        olimpiada: 'obmep',
        phase: 'Fase 1',
        order: 3,
        totalQuestions: 10,
      },
      {
        id: 'obmep-f1-combinatoria',
        title: 'Combinatória',
        description: 'Princípio multiplicativo, permutações e combinações',
        olimpiada: 'obmep',
        phase: 'Fase 1',
        order: 4,
        totalQuestions: 10,
      },
      {
        id: 'obmep-f1-probabilidade',
        title: 'Probabilidade',
        description: 'Espaço amostral, eventos e cálculo de probabilidade',
        olimpiada: 'obmep',
        phase: 'Fase 1',
        order: 5,
        totalQuestions: 10,
      },
    ],
  },
]
