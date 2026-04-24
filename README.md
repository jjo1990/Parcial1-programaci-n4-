Parcial 1    
Alumnos: juan jose orellano
El sistema permite administrar el catálogo de un restaurante, incluyendo la gestión de productos, categorías e ingredientes. Sus principales características son:
•	Tecnologías Utilizadas
Backend: Python con FastAPI y SQLModel (una combinación de SQLAlchemy y Pydantic). Utiliza una base de datos PostgreSQL (con soporte para tipos avanzados como ARRAY para imágenes).
Frontend: React con TypeScript, utilizando Vite como herramienta de construcción y un diseño moderno y responsivo.
•	Funcionalidades Principales
Gestión de Productos: Permite administrar nombre, descripción, precio base, stock y disponibilidad. Un producto puede tener múltiples imágenes.
Categorías Jerárquicas: Las categorías pueden tener subcategorías (relación de autorreferencia) y se relacionan de forma Muchos a Muchos con los productos.
Ingredientes: Los productos pueden estar compuestos por diversos ingredientes, permitiendo marcar si son alérgenos y si son removibles por el cliente.
Sistema de Auditoría: Todas las entidades principales incluyen campos de control como created_at, updated_at y deleted_at (borrado lógico).
El proyecto está organizado en dos carpetas principales: /backend para la API y la lógica de datos, y /frontend para la interfaz de usuario.
link del video explicativo del parcial 1------> https://youtu.be/1PRui1y4ojs
