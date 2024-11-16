- [x] Agregar funcionalidad a repositories (vault, fieldValue, fields)
- [x] Agregar funcionalidad en application
 ### 19 Sept
- [x] Agregar funcionalidad al FieldController
- [x] Agregar fieldTypes??

### 14 nov
- [ ] Agregar casos de uso para fieldTypes
- [ ] Agregar logica de creacion vaults

- [ ] Agregar endpoint para crear fields y fieldTypes por default
- [ ] Separar logica de IModels y schemas en una nueva interfaz con implement y extend a Document en persistance
- [x] Utilizar abstract repository base en los demas repositories heredar los metodos commons
- [ ] Crear una Interfaz base de los UseCases
- [ ] Crear una interfaz base para los Controllers
- [x] Desacoplar schemas de los repositorios y utilizar la abstraccion y model a traves del contructor para quitar el acoplamiento
- [x] Estructurar correctamente ioc

### 20 Nov
- [ ] Test a query y queryOne en repositories

### 21 nov
- [ ] Hacer useCase para notas por usuario paginadas?


### 24 nov
- [ ] Mover logica de validacion de fieldValue body en fieldHandler a fieldController

### 29 nov

- [ ] Separar IModels en models y types para poder hacer los mocks de los bodys de cada endpoint con tsoa

- [ ] Hacer una function para mockear automaticamente todas las props de una interfaz utilizando faker (basandose en el type de la property)


### 1 dic
- [ ] Documentar endpoints para carga de archivos (/upload)

### 3 dic
- [x] Implementar endpoint delete note
- [ ] Implementar isDeleted property a las notas
- [ ] Modificar endpoint que regresa las notas para que filtre las notas con la propiedad isDeleted en false
- [ ] Implementar endpoint para eliminar imagenes de notas eliminadas o incluirlo en el endpoint que elimina la nota

### 13 dic

- [ ] Utilizar function getPagination queries en otros handlers
- [ ] Renombrar funcions de handlers (remover *handler)

### 12 may 24
- [ ] Agregar logger
- [ ] Utilizar un encriptado para enviar los datos desde el front y desencriptarlos y volverlos a encriptar en el back
- [ ] Consulta de contraseñas/vaults por medio de tokens por tiempo
- [ ] Login por phone - code 
