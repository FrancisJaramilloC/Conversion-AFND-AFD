# Simulador de Equivalencia AFND a AFD

Este proyecto implementa la demostración práctica de la **Construcción de Subconjuntos** y la **Minimización de Hopcroft**, demostrando matemáticamente la equivalencia de lenguajes aceptados entre un AFND, su versión AFD, y el AFD minimizado.

La arquitectura cumple con el paradigma *Clean Architecture*:
- **Backend:** Java 17 + Spring Boot
- **Frontend:** React + Vite

## Requisitos Previos
- **Java 17** o superior instalado (`java -version`).
- **Maven** instalado (`mvn -version`).
- **Node.js** (versión 18+ recomendada) instalado (`node -v`).

---

## 🚀 Cómo correr el proyecto localmente

Para ver el simulador funcionando, necesitarás levantar ambos servidores (el backend en Java y el frontend en React) en dos terminales distintas.

### 1. Levantar el Backend (Spring Boot)
Abre una terminal en tu editor, asegúrate de estar en la raíz de este proyecto y ejecuta:

```bash
cd backend
mvn spring-boot:run
```
*(El servidor backend arrancará en el puerto `8080`)*

### 2. Levantar el Frontend (React Vite)
Abre una **segunda terminal** en tu editor (puedes usar el botón `+` en la pestaña de terminal de VS Code), asegúrate de estar en la raíz del proyecto y ejecuta:

```bash
cd frontend
npm install
npm run dev
```
*(Vite te mostrará una URL, usualmente `http://localhost:5173`. Abre ese enlace en tu navegador)*

---

## 💡 Cómo realizar las pruebas manuales
Una vez tengas la interfaz abierta en tu navegador:
1. Selecciona el **ejercicio** en las pestañas superiores (IDS, Telemetría IoT, Genética).
2. En el panel de validación, ingresa una de tus cadenas teóricas (por ejemplo `saa` para el IDS).
3. Presiona **Evaluar Equivalencia**.
4. Verás la triple validación: el AFND original, el AFD por subconjuntos y el AFD minimizado evaluarán la misma cadena en paralelo y mostrarán si es `ACEPTADA` o `RECHAZADA`.