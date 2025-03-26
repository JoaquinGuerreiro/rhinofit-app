import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const initialRoutines = [

  {
    "id": "beginner-home-resistance-short",
    "name": "Rutina Principiante en Casa - Resistencia Corta",
    "description": "Rutina básica para principiantes en casa con foco en resistencia y sesiones cortas.",
    "characteristics": {
      "equipment": "poco/ninguno",
      "difficulty": "principiante",
      "trainingType": "resistencia",
      "duration": "corto"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-1", "name": "Saltar la soga", "sets": 2, "reps": "30 segundos" },
          { "id": "chest-5", "name": "Flexiones de Pecho", "sets": 3, "reps": "8-12" },
          { "id": "back-25", "name": "Superman", "sets": 3, "reps": "12-15" },
          { "id": "shoulder-13", "name": "Press con Banda Elástica", "sets": 3, "reps": "15-20" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "legs-36", "name": "Tijeras con Salto", "sets": 3, "reps": "20-25" },
          { "id": "abs-2", "name": "Plancha Frontal", "sets": 3, "reps": "12-15" },
          { "id": "biceps-6", "name": "Curl Martillo", "sets": 3, "reps": "8-10" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-3", "name": "Jumping Jacks", "sets": 3, "reps": "30 segundos" },
          { "id": "triceps-4", "name": "Fondos en Banco", "sets": 3, "reps": "15-20" },
          { "id": "chest-5", "name": "Flexiones de Pecho", "sets": 3, "reps": "8-12" },
          { "id": "abs-17", "name": "Plancha con Elevación Alternada", "sets": 3, "reps": "15-20" }
        ]
      }
    }
  },
  {
    "id": "beginner-basic-hypertrophy-medium",
    "name": "Rutina Principiante con Equipamiento Básico - Hipertrofia Media",
    "description": "Rutina diseñada para principiantes con mancuernas o bandas elásticas enfocada en hipertrofia.",
    "characteristics": {
      "equipment": "basico",
      "difficulty": "principiante",
      "trainingType": "hipertrofia",
      "duration": "normal"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-2", "name": "Burpees", "sets": 2, "reps": "30 segundos" },
          { "id": "chest-6", "name": "Press con Mancuernas", "sets": 3, "reps": "10-12" },
          { "id": "back-4", "name": "Remo con Mancuerna", "sets": 3, "reps": "10-12" },
          { "id": "shoulder-2", "name": "Elevaciones Laterales", "sets": 3, "reps": "12-15" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "biceps-4", "name": "Curl de Concentración", "sets": 3, "reps": "10-12" },
          { "id": "triceps-13", "name": "Press Francés con Mancuerna", "sets": 3, "reps": "12-15" },
          { "id": "legs-7", "name": "Zancadas con Mancuernas", "sets": 3, "reps": "10-12" },
          { "id": "abs-1", "name": "Crunch Básico", "sets": 3, "reps": "10-12" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "chest-6", "name": "Press con Mancuernas", "sets": 3, "reps": "10-12" },
          { "id": "back-1", "name": "Dominadas", "sets": 3, "reps": "3-5" },
          { "id": "shoulder-3", "name": "Press Arnold", "sets": 3, "reps": "12-15" }
        ]
      }
    }
  },
  {
    "id": "beginner-home-strength-long",
    "name": "Rutina Principiante en Casa - Fuerza Extendida",
    "description": "Rutina de fuerza para principiantes que entrenan en casa con sesiones más largas.",
    "characteristics": {
      "equipment": "poco/ninguno",
      "difficulty": "principiante",
      "trainingType": "fuerza",
      "duration": "largo"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "chest-5", "name": "Flexiones de Pecho", "sets": 4, "reps": "10-12" },
          { "id": "back-25", "name": "Superman", "sets": 4, "reps": "12-15" },
          { "id": "shoulder-20", "name": "Elevaciones Frontales con Plato", "sets": 4, "reps": "12-15" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "aerobics-2", "name": "Burpees", "sets": 2, "reps": "30 segundos" },
          { "id": "biceps-2", "name": "Curl Alternado con Mancuernas", "sets": 3, "reps": "8-10" },
          { "id": "legs-18", "name": "Sentadilla con Salto", "sets": 3, "reps": "12-15" },
          { "id": "abs-10", "name": "Plancha Lateral con Rotación", "sets": 3, "reps": "8-10" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "chest-14", "name": "Flexiones Diamante", "sets": 4, "reps": "10-12" },
          { "id": "triceps-4", "name": "Fondos en Banco", "sets": 3, "reps": "15-20" },
          { "id": "back-20", "name": "Peso Muerto Rumano", "sets": 3, "reps": "10-12" }
        ]
      }
    }
  },
  {
    "id": "beginner-basic-resistance-short",
    "name": "Rutina Principiante con Equipamiento Básico - Resistencia Corta",
    "description": "Rutina enfocada en mejorar la resistencia utilizando equipamiento básico.",
    "characteristics": {
      "equipment": "basico",
      "difficulty": "principiante",
      "trainingType": "resistencia",
      "duration": "corto"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-7", "name": "Trote en el lugar", "sets": 3, "reps": "30 segundos" },
          { "id": "chest-5", "name": "Flexiones de Pecho", "sets": 3, "reps": "15-20" },
          { "id": "back-4", "name": "Remo con Mancuerna", "sets": 3, "reps": "12-15" },
          { "id": "shoulder-2", "name": "Elevaciones Laterales", "sets": 3, "reps": "15-20" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "biceps-2", "name": "Curl Alternado con Mancuernas", "sets": 3, "reps": "12-15" },
          { "id": "triceps-3", "name": "Extensiones de Tríceps con Mancuerna sobre la Cabeza", "sets": 3, "reps": "12-15" },
          { "id": "legs-7", "name": "Zancadas con Mancuernas", "sets": 3, "reps": "8-10" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-7", "name": "Trote en el lugar", "sets": 3, "reps": "30 segundos" },
          { "id": "abs-3", "name": "Russian Twist", "sets": 3, "reps": "15-20" },
          { "id": "back-25", "name": "Superman", "sets": 3, "reps": "12-15" },
          { "id": "chest-11", "name": "Press Inclinado con Mancuernas", "sets": 3, "reps": "15-20" }
        ]
      }
    }
  },
  {
    "id": "beginner-gym-hypertrophy-medium",
    "name": "Rutina Principiante en Gimnasio - Hipertrofia Media",
    "description": "Rutina diseñada para principiantes con acceso a gimnasio enfocada en hipertrofia.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "principiante",
      "trainingType": "hipertrofia",
      "duration": "normal"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "chest-1", "name": "Press de Banca", "sets": 3, "reps": "8-10" },
          { "id": "back-2", "name": "Remo con Barra", "sets": 3, "reps": "8-10" },
          { "id": "shoulder-1", "name": "Press Militar con Barra", "sets": 3, "reps": "8-10" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "aerobics-2", "name": "Burpees", "sets": 3, "reps": "30 segundos" },
          { "id": "chest-2", "name": "Press de Banca Inclinado", "sets": 3, "reps": "8-10" },
          { "id": "back-3", "name": "Jalón al Pecho", "sets": 3, "reps": "10-12" },
          { "id": "shoulder-3", "name": "Press Arnold", "sets": 3, "reps": "10-12" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "chest-6", "name": "Press con Mancuernas", "sets": 3, "reps": "10-12" },
          { "id": "back-4", "name": "Remo con Mancuerna", "sets": 3, "reps": "10-12" },
          { "id": "shoulder-6", "name": "Press con Mancuernas", "sets": 3, "reps": "10-12" }
        ]
      }
    }
  },
  {
    "id": "beginner-home-strength-circuit",
    "name": "Rutina Circuito de Fuerza en Casa",
    "description": "Rutina basada en un circuito de fuerza para principiantes con equipo mínimo.",
    "characteristics": {
      "equipment": "poco/ninguno",
      "difficulty": "principiante",
      "trainingType": "fuerza",
      "duration": "normal"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "chest-5", "name": "Flexiones de Pecho", "sets": 3, "reps": "8-12" },
          { "id": "back-25", "name": "Superman", "sets": 4, "reps": "12-15" },
          { "id": "shoulder-2", "name": "Elevaciones Laterales", "sets": 3, "reps": "10-12" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "biceps-4", "name": "Curl de Concentración", "sets": 3, "reps": "10-12" },
          { "id": "legs-18", "name": "Sentadilla con Salto", "sets": 3, "reps": "8-10" },
          { "id": "abs-1", "name": "Crunch Básico", "sets": 3, "reps": "12-15" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "chest-14", "name": "Flexiones Diamante", "sets": 3, "reps": "10-12" },
          { "id": "triceps-4", "name": "Fondos en Banco", "sets": 3, "reps": "10-12" },
          { "id": "shoulder-4", "name": "Elevaciones Frontales", "sets": 3, "reps": "10-12" }
        ]
      }
    }
  },
  {
    "id": "beginner-gym-resistance-varied",
    "name": "Rutina de Resistencia en Gimnasio - Variada",
    "description": "Rutina con enfoque variado para principiantes en gimnasio.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "principiante",
      "trainingType": "resistencia",
      "duration": "largo"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-14", "name": "Bicicleta estática", "sets": 1, "reps": "120 segundos" },
          { "id": "chest-1", "name": "Press de Banca", "sets": 3, "reps": "8-10" },
          { "id": "back-30", "name": "Remo Bajo con Agarre Ancho", "sets": 3, "reps": "10-12" },
          { "id": "shoulder-2", "name": "Elevaciones Laterales", "sets": 3, "reps": "12-15" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "chest-10", "name": "Press Hammer", "sets": 3, "reps": "10-12" },
          { "id": "back-7", "name": "Remo en Máquina", "sets": 3, "reps": "8-10" },
          { "id": "shoulder-7", "name": "Face Pull", "sets": 3, "reps": "12-15" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-14", "name": "Bicicleta estática", "sets": 1, "reps": "120 segundos" },
          { "id": "chest-18", "name": "Press de Banca con Agarre Cerrado", "sets": 3, "reps": "10-12" },
          { "id": "back-10", "name": "Hiperextensiones", "sets": 3, "reps": "10-12" },
          { "id": "shoulder-8", "name": "Press Militar Tras Nuca", "sets": 3, "reps": "8-10" }
        ]
      }
    }
  },
  {
    "id": "intermediate-home-resistance-short",
    "name": "Resistencia en Casa (Corto)",
    "description": "Rutina de resistencia para personas intermedias con poco o ningún equipamiento.",
    "characteristics": {
      "equipment": "poco/ninguno",
      "difficulty": "intermedia",
      "trainingType": "resistencia",
      "duration": "corto"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-16", "name": "Saltos de banco", "sets": 3, "reps": "12" },
          { "id": "chest-5", "name": "Flexiones de Pecho", "sets": 4, "reps": "15-20" },
          { "id": "back-25", "name": "Superman", "sets": 3, "reps": "15-20" },
          { "id": "shoulder-11", "name": "Press 180°", "sets": 3, "reps": "10-15" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "chest-14", "name": "Flexiones Diamante", "sets": 4, "reps": "10-12" },
          { "id": "legs-18", "name": "Sentadilla con Salto", "sets": 3, "reps": "15-20" },
          { "id": "shoulder-2", "name": "Elevaciones Laterales", "sets": 3, "reps": "15-18" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-16", "name": "Saltos de banco", "sets": 3, "reps": "12" },
          { "id": "abs-2", "name": "Plancha Frontal", "sets": 3, "reps": "15-20" },
          { "id": "biceps-2", "name": "Curl Alternado con Mancuernas", "sets": 3, "reps": "15-20" },
          { "id": "legs-36", "name": "Tijeras con Salto", "sets": 3, "reps": "20-25" }
        ]
      }
    }
  },
  {
    "id": "intermediate-basic-strength-normal",
    "name": "Fuerza Básica (45-60 min)",
    "description": "Rutina de fuerza intermedia con equipamiento básico.",
    "characteristics": {
      "equipment": "basico",
      "difficulty": "intermedia",
      "trainingType": "fuerza",
      "duration": "normal"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "chest-6", "name": "Press con Mancuernas", "sets": 4, "reps": "10-12" },
          { "id": "back-4", "name": "Remo con Mancuerna", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-3", "name": "Press Arnold", "sets": 4, "reps": "10-12" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "chest-4", "name": "Aperturas con Mancuernas", "sets": 3, "reps": "12-15" },
          { "id": "back-20", "name": "Peso Muerto Rumano", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-19", "name": "Press con Barra Z", "sets": 4, "reps": "10-12" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "chest-11", "name": "Press Inclinado con Mancuernas", "sets": 4, "reps": "10-12" },
          { "id": "back-8", "name": "Remo en T con Barra", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-15", "name": "Press con Kettlebell", "sets": 3, "reps": "10-12" }
        ]
      },
      "saturday": {
        "exercises": [
          { "id": "chest-12", "name": "Aperturas Inclinadas con Mancuernas", "sets": 3, "reps": "12-15" },
          { "id": "back-9", "name": "Pullover con Barra", "sets": 3, "reps": "12-15" },
          { "id": "shoulder-18", "name": "Remo Alto con Barra", "sets": 3, "reps": "12-15" }
        ]
      }
    }
  },
  {
    "id": "intermediate-gym-hypertrophy-long",
    "name": "Hipertrofia en Gimnasio (60-90 min)",
    "description": "Rutina intermedia de hipertrofia con acceso a gimnasio completo.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "intermedia",
      "trainingType": "hipertrofia",
      "duration": "largo"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-14", "name": "Bicicleta estática", "sets": 1, "reps": "120 segundos" },
          { "id": "chest-1", "name": "Press de Banca", "sets": 4, "reps": "10-12" },
          { "id": "back-1", "name": "Dominadas", "sets": 3, "reps": "6-8" },
          { "id": "shoulder-1", "name": "Press Militar con Barra", "sets": 4, "reps": "10-12" }
        ]
      },
      "tuesday": {
        "exercises": [
          { "id": "chest-2", "name": "Press de Banca Inclinado", "sets": 4, "reps": "10-12" },
          { "id": "back-2", "name": "Remo con Barra", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-19", "name": "Press con Barra Z", "sets": 4, "reps": "10-12" }
        ]
      },
      "thursday": {
        "exercises": [
          { "id": "aerobics-14", "name": "Bicicleta estática", "sets": 1, "reps": "120 segundos" },
          { "id": "chest-13", "name": "Aperturas en Polea Baja", "sets": 3, "reps": "12-15" },
          { "id": "back-5", "name": "Peso Muerto", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-3", "name": "Press Arnold", "sets": 4, "reps": "10-12" }
        ]
      },
      "saturday": {
        "exercises": [
          { "id": "chest-15", "name": "Flexiones con Pies Elevados", "sets": 3, "reps": "12-15" },
          { "id": "back-18", "name": "Jalón al Pecho Agarre Cerrado", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-11", "name": "Press 180°", "sets": 4, "reps": "10-12" }
        ]
      }
    }
  },
  {
    "id": "intermediate-basic-resistance-normal",
    "name": "Resistencia Básica (45-60 min)",
    "description": "Rutina intermedia de resistencia con equipamiento básico.",
    "characteristics": {
      "equipment": "basico",
      "difficulty": "intermedia",
      "trainingType": "resistencia",
      "duration": "normal"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-11", "name": "Trote ligero", "sets": 1, "reps": "180 segundos" },
          { "id": "chest-4", "name": "Aperturas con Mancuernas", "sets": 3, "reps": "12-15" },
          { "id": "back-4", "name": "Remo con Mancuerna", "sets": 3, "reps": "12-15" },
          { "id": "shoulder-2", "name": "Elevaciones Laterales", "sets": 3, "reps": "15-18" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "chest-6", "name": "Press con Mancuernas", "sets": 4, "reps": "10-12" },
          { "id": "back-27", "name": "Remo en Banco Inclinado", "sets": 3, "reps": "12-15" },
          { "id": "shoulder-11", "name": "Press 180°", "sets": 3, "reps": "12-15" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "chest-22", "name": "Press con Banda Elástica", "sets": 3, "reps": "15-20" },
          { "id": "back-4", "name": "Remo con Mancuerna", "sets": 3, "reps": "12-15" },
          { "id": "shoulder-15", "name": "Press con Kettlebell", "sets": 3, "reps": "12-15" }
        ]
      },
      "sunday": {
        "exercises": [
          { "id": "aerobics-11", "name": "Trote ligero", "sets": 1, "reps": "180 segundos" },
          { "id": "chest-23", "name": "Aperturas en TRX", "sets": 3, "reps": "12-15" },
          { "id": "back-21", "name": "Remo con Banda Elástica", "sets": 3, "reps": "15-20" },
          { "id": "shoulder-24", "name": "Press de Hombro en TRX", "sets": 3, "reps": "12-15" }
        ]
      }
    }
  },
  {
    "id": "intermediate-gym-strength-short",
    "name": "Fuerza en Gimnasio (30-45 min)",
    "description": "Rutina intermedia de fuerza con acceso a gimnasio completo y sesiones cortas.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "intermedia",
      "trainingType": "fuerza",
      "duration": "corto"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 2, "reps": "90 segundos" },
          { "id": "chest-1", "name": "Press de Banca", "sets": 4, "reps": "10-12" },
          { "id": "back-1", "name": "Dominadas", "sets": 3, "reps": "6-8" },
          { "id": "shoulder-1", "name": "Press Militar con Barra", "sets": 4, "reps": "10-12" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "chest-11", "name": "Press Inclinado con Mancuernas", "sets": 4, "reps": "10-12" },
          { "id": "back-2", "name": "Remo con Barra", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-18", "name": "Remo Alto con Barra", "sets": 3, "reps": "12-15" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "chest-13", "name": "Aperturas en Polea Baja", "sets": 3, "reps": "12-15" },
          { "id": "back-20", "name": "Peso Muerto Rumano", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-3", "name": "Press Arnold", "sets": 4, "reps": "10-12" }
        ]
      },
      "sunday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 2, "reps": "90 segundos" },
          { "id": "chest-2", "name": "Press de Banca Inclinado", "sets": 4, "reps": "10-12" },
          { "id": "back-18", "name": "Jalón al Pecho Agarre Cerrado", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-11", "name": "Press 180°", "sets": 4, "reps": "10-12" }
        ]
      }
    }
  },
  {
    "id": "intermediate-gym-hypertrophy-normal",
    "name": "Hipertrofia en Gimnasio (45-60 min)",
    "description": "Rutina intermedia centrada en hipertrofia utilizando equipo de gimnasio básico.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "intermedia",
      "trainingType": "hipertrofia",
      "duration": "normal"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 2, "reps": "90 segundos" },
          { "id": "chest-1", "name": "Press de Banca", "sets": 4, "reps": "10-12" },
          { "id": "back-3", "name": "Jalón al Pecho", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-18", "name": "Remo Alto con Barra", "sets": 3, "reps": "12-15" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "chest-15", "name": "Flexiones con Pies Elevados", "sets": 3, "reps": "12-15" },
          { "id": "back-27", "name": "Remo en Banco Inclinado", "sets": 3, "reps": "10-12" },
          { "id": "shoulder-11", "name": "Press 180°", "sets": 4, "reps": "10-12" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 2, "reps": "90 segundos" },
          { "id": "chest-6", "name": "Press con Mancuernas", "sets": 4, "reps": "10-12" },
          { "id": "back-20", "name": "Peso Muerto Rumano", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-15", "name": "Press con Kettlebell", "sets": 4, "reps": "10-12" }
        ]
      }
    }
  },
 {
    "id": "intermediate-home-resistance-short",
    "name": "Resistencia en Casa (30-45 min)",
    "description": "Rutina intermedia enfocada en resistencia y fuerza para sesiones cortas en casa.",
    "characteristics": {
      "equipment": "poco/ninguno",
      "difficulty": "intermedia",
      "trainingType": "resistencia",
      "duration": "corto"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-16", "name": "Saltos de banco", "sets": 2, "reps": "60 segundos" },
          { "id": "chest-5", "name": "Flexiones de Pecho", "sets": 4, "reps": "15-20" },
          { "id": "back-25", "name": "Superman", "sets": 3, "reps": "15-20" },
          { "id": "shoulder-2", "name": "Elevaciones Laterales", "sets": 3, "reps": "12-15" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "aerobics-10", "name": "Shadow Boxing", "sets": 2, "reps": "90 segundos" },
          { "id": "chest-14", "name": "Flexiones Diamante", "sets": 4, "reps": "12-15" },
          { "id": "back-6", "name": "Dominadas Supinas", "sets": 3, "reps": "6-8" },
          { "id": "legs-9", "name": "Sentadilla Búlgara", "sets": 3, "reps": "12-15" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-16", "name": "Saltos de banco", "sets": 2, "reps": "60 segundos" },
          { "id": "biceps-9", "name": "Curl Araña", "sets": 4, "reps": "10-12" },
          { "id": "triceps-13", "name": "Press Francés con Mancuerna", "sets": 4, "reps": "10-12" },
          { "id": "abs-23", "name": "Plancha con Knee Tucks", "sets": 4, "reps": "10-12" }
        ]
      }
    }
  },
  {
    "id": "intermediate-gym-resistance-long",
    "name": "Resistencia en Gimnasio (60-90 min)",
    "description": "Rutina intermedia para resistencia con equipo completo de gimnasio.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "intermedia",
      "trainingType": "resistencia",
      "duration": "largo"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-14", "name": "Bicicleta estática", "sets": 2, "reps": "120 segundos" },
          { "id": "chest-13", "name": "Aperturas en Polea Baja", "sets": 3, "reps": "12-15" },
          { "id": "back-3", "name": "Jalón al Pecho", "sets": 4, "reps": "12-15" },
          { "id": "shoulder-12", "name": "Elevaciones Laterales con Cable Cruzado", "sets": 3, "reps": "15-18" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 1, "reps": "60 segundos" },
          { "id": "chest-1", "name": "Press de Banca", "sets": 4, "reps": "10-12" },
          { "id": "back-20", "name": "Peso Muerto Rumano", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-3", "name": "Press Arnold", "sets": 4, "reps": "10-12" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-14", "name": "Bicicleta estática", "sets": 2, "reps": "120 segundos" },
          { "id": "chest-2", "name": "Press de Banca Inclinado", "sets": 4, "reps": "10-12" },
          { "id": "back-8", "name": "Remo en T con Barra", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-11", "name": "Press 180°", "sets": 4, "reps": "10-12" }
        ]
      },
      "sunday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 1, "reps": "60 segundos" },
          { "id": "chest-15", "name": "Flexiones con Pies Elevados", "sets": 3, "reps": "12-15" },
          { "id": "back-27", "name": "Remo en Banco Inclinado", "sets": 3, "reps": "12-15" },
          { "id": "shoulder-24", "name": "Press de Hombro en TRX", "sets": 3, "reps": "12-15" }
        ]
      }
    }
  },
  {
    "id": "advanced-gym-hypertrophy",
    "name": "Hipertrofia Avanzada en Gimnasio",
    "description": "Rutina avanzada centrada en hipertrofia muscular con equipo completo de gimnasio.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "avanzada",
      "trainingType": "hipertrofia",
      "duration": "normal"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 1, "reps": "60 segundos" },
          { "id": "chest-1", "name": "Press de Banca", "sets": 4, "reps": "12-15" },
          { "id": "back-2", "name": "Remo con Barra", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-17", "name": "Press Bradford", "sets": 3, "reps": "10-12" }
        ]
      },
      "tuesday": {
        "exercises": [
          { "id": "aerobics-9", "name": "Subida a Banco", "sets": 1, "reps": "60 segundos" },
          { "id": "legs-1", "name": "Sentadilla con Barra", "sets": 4, "reps": "10-12" },
          { "id": "legs-3", "name": "Prensa de Piernas", "sets": 3, "reps": "12-15" },
          { "id": "back-20", "name": "Peso Muerto Rumano", "sets": 4, "reps": "12-15" }
        ]
      },
      "thursday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 1, "reps": "60 segundos" },
          { "id": "chest-2", "name": "Press de Banca Inclinado", "sets": 4, "reps": "12-15" },
          { "id": "back-8", "name": "Remo en T con Barra", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-11", "name": "Press 180°", "sets": 4, "reps": "10-12" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-9", "name": "Subida a Banco", "sets": 1, "reps": "60 segundos" },
          { "id": "biceps-1", "name": "Curl con Barra", "sets": 4, "reps": "12-15" },
          { "id": "triceps-1", "name": "Extensión de Tríceps con Polea Alta", "sets": 3, "reps": "12-15" },
          { "id": "biceps-6", "name": "Curl Martillo", "sets": 3, "reps": "12-15" }
        ]
      }
    }
  },
  {
    "id": "advanced-home-resistance",
    "name": "Resistencia Avanzada en Casa",
    "description": "Rutina avanzada de resistencia utilizando poco o ningún equipamiento.",
    "characteristics": {
      "equipment": "poco/ninguno",
      "difficulty": "avanzada",
      "trainingType": "resistencia",
      "duration": "corto"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-20", "name": "Circuito de Cardio", "sets": 2, "reps": "60 segundos" },
          { "id": "chest-25", "name": "Flexiones Hindú", "sets": 4, "reps": "15-20" },
          { "id": "back-25", "name": "Superman", "sets": 4, "reps": "15-20" },
          { "id": "shoulder-6", "name": "Press con Mancuernas", "sets": 4, "reps": "15-20" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "aerobics-11", "name": "Trote ligero", "sets": 2, "reps": "90 segundos" },
          { "id": "legs-7", "name": "Zancadas con Mancuernas", "sets": 4, "reps": "15-20" },
          { "id": "abs-10", "name": "Plancha Lateral con Rotación", "sets": 3, "reps": "30-45 seg por lado" },
          { "id": "abs-6", "name": "Crunch Bicicleta", "sets": 3, "reps": "20-25" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-20", "name": "Circuito de Cardio", "sets": 2, "reps": "60 segundos" },
          { "id": "chest-14", "name": "Flexiones Diamante", "sets": 4, "reps": "12-15" },
          { "id": "back-4", "name": "Remo con Mancuerna", "sets": 3, "reps": "15-20" },
          { "id": "shoulder-22", "name": "Elevaciones Laterales Inclinado", "sets": 3, "reps": "15-18" }
        ]
      }
    }
  },
  {
    "id": "advanced-gym-strength",
    "name": "Fuerza Avanzada en Gimnasio",
    "description": "Rutina avanzada de fuerza con acceso completo al gimnasio.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "avanzada",
      "trainingType": "fuerza",
      "duration": "largo"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-19", "name": "Caminata inclinada", "sets": 1, "reps": "120 segundos" },
          { "id": "chest-1", "name": "Press de Banca", "sets": 5, "reps": "6-8" },
          { "id": "back-5", "name": "Peso Muerto", "sets": 5, "reps": "6-8" },
          { "id": "shoulder-17", "name": "Press Bradford", "sets": 4, "reps": "6-8" }
        ]
      },
      "tuesday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 2, "reps": "90 segundos" },
          { "id": "legs-1", "name": "Sentadilla con Barra", "sets": 5, "reps": "6-8" },
          { "id": "legs-3", "name": "Prensa de Piernas", "sets": 4, "reps": "8-10" },
          { "id": "abs-3", "name": "Russian Twist", "sets": 3, "reps": "15" }
        ]
      },
      "thursday": {
        "exercises": [
          { "id": "aerobics-19", "name": "Caminata inclinada", "sets": 1, "reps": "120 segundos" },
          { "id": "chest-11", "name": "Press Inclinado con Mancuernas", "sets": 4, "reps": "6-8" },
          { "id": "back-2", "name": "Remo con Barra", "sets": 5, "reps": "6-8" },
          { "id": "shoulder-11", "name": "Press 180°", "sets": 4, "reps": "6-8" }
        ]
      },
      "saturday": {
        "exercises": [
          { "id": "aerobics-17", "name": "Remo en máquina aeróbica", "sets": 2, "reps": "90 segundos" },
          { "id": "biceps-3", "name": "Curl con Barra Z", "sets": 4, "reps": "8-10" },
          { "id": "triceps-1", "name": "Extensión de Tríceps con Polea Alta", "sets": 4, "reps": "8-10" },
          { "id": "biceps-6", "name": "Curl Martillo", "sets": 4, "reps": "8-10" }
        ]
      }
    }
  },
  {
    "id": "advanced-gym-functional",
    "name": "Funcional Avanzado en Gimnasio",
    "description": "Rutina avanzada de entrenamiento funcional en gimnasio.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "avanzada",
      "trainingType": "fuerza",
      "duration": "normal"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-20", "name": "Circuito de cardio", "sets": 1, "reps": "120 segundos" },
          { "id": "abs-15", "name": "Plancha con Deslizadores", "sets": 3, "reps": "20" },
          { "id": "legs-24", "name": "Sentadilla Goblet", "sets": 4, "reps": "15-20" },
          { "id": "shoulder-15", "name": "Press con Kettlebell", "sets": 3, "reps": "15" }
        ]
      },
      "tuesday": {
        "exercises": [
          { "id": "aerobics-19", "name": "Caminata inclinada", "sets": 1, "reps": "120 segundos" },
          { "id": "legs-19", "name": "Prensa de Piernas Unilateral", "sets": 4, "reps": "12-15" },
          { "id": "legs-20", "name": "Zancadas Laterales", "sets": 3, "reps": "12 por pierna" },
          { "id": "abs-5", "name": "Rueda Abdominal", "sets": 3, "reps": "20" }
        ]
      },
      "wednesday": {
        "exercises": [
          { "id": "aerobics-20", "name": "Circuito de cardio", "sets": 1, "reps": "120 segundos" },
          { "id": "biceps-5", "name": "Curl en Banco Scott", "sets": 3, "reps": "30 segundos" },
          { "id": "chest-7", "name": "Aperturas en Polea", "sets": 4, "reps": "12 por lado" },
          { "id": "back-7", "name": "Remo en Máquina", "sets": 4, "reps": "12-15" }
        ]
      },
      "thursday": {
        "exercises": [
          { "id": "aerobics-19", "name": "Caminata inclinada", "sets": 1, "reps": "120 segundos" },
          { "id": "legs-9", "name": "Sentadilla Búlgara", "sets": 3, "reps": "10-12" },
          { "id": "chest-16", "name": "Press Guillotina", "sets": 4, "reps": "20" },
          { "id": "triceps-7", "name": "Extensiones de Tríceps en Polea con Una Mano", "sets": 3, "reps": "12-15" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "shoulder-28", "name": "Press Militar con Pausa", "sets": 4, "reps": "10-12" },
          { "id": "legs-6", "name": "Elevación de Pantorrillas de Pie en Máquina", "sets": 3, "reps": "12" },
          { "id": "biceps-5", "name": "Curl en Banco Scott", "sets": 3, "reps": "12-15" }
        ]
      }
    }
  },
  {
    "id": "advanced-gym-hypertrophy-long",
    "name": "Hipertrofia Extensa en Gimnasio",
    "description": "Rutina avanzada de hipertrofia con mayor duración y volumen de trabajo en gimnasio.",
    "characteristics": {
      "equipment": "maquinas de gimnasio",
      "difficulty": "avanzada",
      "trainingType": "hipertrofia",
      "duration": "largo"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "aerobics-2", "name": "Burpees", "sets": 2, "reps": "60 segundos" },
          { "id": "chest-30", "name": "Press de Banca Isométrico", "sets": 4, "reps": "10-12" },
          { "id": "back-22", "name": "Dominadas Asistidas", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-2", "name": "Elevaciones Laterales", "sets": 4, "reps": "12-15" }
        ]
      },
      "tuesday": {
        "exercises": [
          { "id": "legs-3", "name": "Prensa de Piernas", "sets": 4, "reps": "10-12" },
          { "id": "legs-39", "name": "Peso Muerto Sumo", "sets": 4, "reps": "8-10" },
          { "id": "abs-23", "name": "Plancha con Knee Tucks", "sets": 3, "reps": "30 seg" }
        ]
      },
      "thursday": {
        "exercises": [
          { "id": "aerobics-2", "name": "Burpees", "sets": 2, "reps": "60 segundos" },
          { "id": "chest-11", "name": "Press Inclinado con Mancuernas", "sets": 4, "reps": "10-12" },
          { "id": "back-2", "name": "Remo con Barra", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-30", "name": "Press Militar Unilateral", "sets": 4, "reps": "10-12" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "triceps-4", "name": "Fondos en Banco", "sets": 3, "reps": "10-12" },
          { "id": "biceps-8", "name": "Curl 21s", "sets": 3, "reps": "10-12" },
          { "id": "chest-8", "name": "Press en Máquina Smith", "sets": 3, "reps": "12-15" }
        ]
      },
      "saturday": {
        "exercises": [
          { "id": "aerobics-2", "name": "Burpees", "sets": 2, "reps": "60 segundos" },
          { "id": "abs-4", "name": "Elevación de Piernas en Suelo", "sets": 4, "reps": "20" },
          { "id": "abs-11", "name": "Crunch Declinado con Peso", "sets": 3, "reps": "15 por lado" },
          { "id": "back-7", "name": "Remo en Máquina", "sets": 4, "reps": "12-15" }
        ]
      }
    }
  },
  {
    "id": "advanced-basic-strenght-long",
    "name": "Fuerza Avanzada Extensa con Equipo Básico",
    "description": "Rutina avanzada de fuerza con mayor duración, utilizando equipo básico.",
    "characteristics": {
      "equipment": "basico",
      "difficulty": "avanzada",
      "trainingType": "fuerza",
      "duration": "largo"
    },
    "days": {
      "monday": {
        "exercises": [
          { "id": "chest-4", "name": "Aperturas con Mancuernas", "sets": 4, "reps": "10-12" },
          { "id": "back-12", "name": "Dominadas con Agarre Neutro", "sets": 4, "reps": "10-12" },
          { "id": "shoulder-5", "name": "Pájaros o Elevaciones Posteriores", "sets": 4, "reps": "12-15" }
        ]
      },
      "tuesday": {
        "exercises": [
          { "id": "aerobics-2", "name": "Burpees", "sets": 2, "reps": "60 segundos" },
          { "id": "legs-14", "name": "Sentadilla Sumo", "sets": 4, "reps": "10-12" },
          { "id": "legs-15", "name": "Elevación de Talones Sentado", "sets": 4, "reps": "12-15" },
          { "id": "abs-7", "name": "Dragon Flag", "sets": 3, "reps": "30 seg" }
        ]
      },
      "thursday": {
        "exercises": [
          { "id": "chest-11", "name": "Press Inclinado con Mancuernas", "sets": 4, "reps": "10-12" },
          { "id": "back-16", "name": "Remo Pendlay", "sets": 4, "reps": "10-12" },
          { "id": "biceps-15", "name": "Curl Isométrico con Mancuernas", "sets": 4, "reps": "10-12" }
        ]
      },
      "friday": {
        "exercises": [
          { "id": "aerobics-2", "name": "Burpees", "sets": 2, "reps": "60 segundos" },
          { "id": "shoulder-23", "name": "Press Cubano", "sets": 3, "reps": "10-12" },
          { "id": "triceps-17", "name": "Press Francés Inclinado", "sets": 3, "reps": "10-12" },
          { "id": "legs-41", "name": "Sentadilla Isométrica en Pared", "sets": 3, "reps": "12-15" }
        ]
      },
      "saturday": {
        "exercises": [
          { "id": "abs-29", "name": "Toes to Bar", "sets": 4, "reps": "20" },
          { "id": "abs-27", "name": "Plancha lateral elevada con apoyo de pie en banco o soporte", "sets": 3, "reps": "15 por lado" },
          { "id": "back-6", "name": "Dominadas Supinas", "sets": 4, "reps": "12-15" }
        ]
      }
    }
  },
  


  
  
];

export async function initializeGeneratedRoutines() {
  try {
    for (const routine of initialRoutines) {
      await setDoc(doc(db, 'generated-routines', routine.id), routine);
    }
    console.log('Rutinas generadas inicializadas exitosamente');
  } catch (error) {
    console.error('Error al inicializar rutinas generadas:', error);
    throw error;
  }
} 