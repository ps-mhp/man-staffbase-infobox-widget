# Configuración

Todo se gestiona en la ventana **Editar cuadro informativo**. En el propio cuadro de diálogo de configuración
solo aparece el botón que la abre.

| Sección | Configuración | Valor predeterminado | Significado |
| --- | --- | --- | --- |
| Contenido | **Título** | vacío | La primera línea en negrita. Puede dejarse en blanco. |
| Contenido | **Texto** | vacío | El texto que aparece debajo. Se conservan los saltos de línea. Puede dejarse en blanco. |
| Diseño | **Variante** | Neutral | El color del recuadro: Neutral, Información, Explicación, Éxito, Advertencia, Error. Cada pastilla lleva un punto del color que se le asigna al recuadro en la página. |
| Comportamiento | **Permitir cerrar** | activado | Muestra el ✕ en la esquina superior derecha. |

## Notas

- El título y el texto no pueden estar ambos vacíos; de lo contrario, el widget
  no mostrará nada. **Aplicar** indica entonces, en la parte superior del estado y debajo del campo de texto,
  lo que falta.
- **Aplicar** abre el cuadro de diálogo de configuración; los cambios solo se guardan al
  pulsar **Guardar** en dicho cuadro.
- En ordenador, tableta y móvil, el cuadro de información se muestra tal y como aparece en la página,
  entre el título de la página y un párrafo, a modo de marcador de posición. Los
  ajustes se encuentran a la derecha, en **Ajustes**. Si el cuadro está vacío,
  aparece en su lugar una indicación con una línea discontinua.
- Las opciones **Deshacer** y **Rehacer** se encuentran en la parte superior de la ventana (⌘/Ctrl Z o ⇧⌘/Ctrl Z).

## Cuadros informativos de versiones anteriores

Hasta la versión 0.1.0-rc.5, Variante, Título, Texto y Cerrar aparecían como
campos independientes en el cuadro de diálogo de configuración. Desde entonces, la ventana guarda todo
juntos en el atributo `infobox-config`; los campos antiguos están ocultos,
pero sus valores se mantienen.

- Un cuadro de información anterior se ve en la página exactamente igual que antes.
- Al abrirla por primera vez, la ventana toma los valores antiguos. Abrirla y
  **Aplicar** sin realizar cambios no modifica nada.
- Si no se puede leer un campo antiguo —en el Content Designer, esto suele afectar
  a la **variante**—, la ventana no muestra ninguna opción en ese lugar y aparece una
  nota debajo. En la página seguirá aplicándose la configuración anterior,
  hasta que se seleccione otra en la ventana.
