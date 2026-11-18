# Definições

Tudo é gerido na janela **Editar caixa de informação**. Na própria caixa de diálogo de definições
apenas aparece o botão que a abre.

| Secção | Definição | Padrão | Significado |
| --- | --- | --- | --- |
| Conteúdo | **Título** | vazio | A primeira linha em negrito. Pode ficar em branco. |
| Conteúdo | **Texto** | vazio | O texto abaixo. As quebras de linha são mantidas. Pode ficar em branco. |
| Formato | **Variante** | Neutro | A cor da caixa: Neutro, Informação, Explicação, Sucesso, Aviso, Erro. Cada pastilha apresenta um ponto na cor que a caixa assume na página. |
| Comportamento | **Permitir fechar** | ativado | Mostra o ✕ no canto superior direito. |

## Notas

- O título e o texto não podem estar ambos em branco — caso contrário, o widget
  não exibe nada. **Aplicar** indica então, na parte superior do estado e por baixo do campo de texto,
  o que falta.
- **Aplicar** abre a caixa de diálogo de definições; só fica guardado ao clicar no
  botão **Guardar** dessa caixa de diálogo.
- O computador, o tablet e o telemóvel apresentam a caixa de informação tal como a página a apresenta,
  entre o título da página e um parágrafo, como marcador de posição. As
  configurações encontram-se à direita, em **Configurações**. Se a caixa estiver vazia,
  aparece no seu lugar uma indicação tracejada.
- *Desfazer* e *Repetir* encontram-se na parte superior da janela (⌘/Ctrl Z ou ⇧⌘/Ctrl Z).

## Caixas de informação de versões anteriores

Até à versão 0.1.0-rc.5, «Variante», «Título», «Texto» e «Fechar» apareciam como
campos individuais na caixa de diálogo de definições. Desde então, a janela guarda tudo
em conjunto no atributo `infobox-config`; os campos antigos estão ocultos,
mas os seus valores permanecem.

- Uma caixa de informação mais antiga tem exatamente o mesmo aspeto na página que tinha anteriormente.
- Ao abrir pela primeira vez, a janela assume os valores antigos. Abrir e
  **Aplicar** sem alterações não altera nada.
- Se um campo antigo não puder ser lido — no Content Designer, isto diz respeito
  principalmente à **variante** —, a janela não apresenta nenhuma opção nesse local e exibe uma
  nota explicativa por baixo. Na página, a configuração anterior continua a aplicar-se,
  até que seja selecionada outra opção na janela.
