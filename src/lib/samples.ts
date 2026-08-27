export type SampleDoc = {
  id: string;
  title: string;
  author: string;
  blurb: string;
  pages: number;
  text: string;
};

export const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: "caverna",
    title: "A alegoria da caverna",
    author: "Platão — retelling de estudo",
    blurb: "Sombras, libertação e o custo de ver o real.",
    pages: 4,
    text: `A ALEGoria DA CAVERNA — texto de estudo

Imagine uma caverna subterrânea. Desde a infância, um grupo de pessoas vive ali, acorrentado pelo pescoço e pelas pernas. Não podem virar a cabeça. Às suas costas há uma fogueira; entre o fogo e os prisioneiros passa um muro baixo, como o palco de um teatro de marionetes. Outros homens caminham sobre esse muro carregando estátuas, vasos, figuras de animais. A luz projeta as sombras desses objetos na parede que os prisioneiros encaram o dia inteiro.

Para eles, a verdade é o que se move na parede. Nomeiam as sombras, apostam qual virá a seguir, honram quem prevê melhor o desfile. Nunca viram a coisa em si — só a cópia projetada.

Agora suponha que um prisioneiro é solto. A luz da fogueira dói. Os objetos reais, que ele tomava por ilusão, parecem menos nítidos do que as sombras familiares. Se o arrastam para fora, a subida é íngreme e o sol o cega. Primeiro distingue reflexos na água, depois as coisas, depois o céu, e por fim o próprio sol — a causa de tudo o que via.

Platão chama esse movimento de educação: não é colocar visão em olhos cegos, é girar a alma inteira na direção do que é. O bem, no mito, ocupa o lugar do sol. Sem ele, não há verdade nem justiça visíveis.

O libertado lembra dos companheiros. Desce de novo. Na penumbra, seus olhos já não competem no jogo das sombras. Os que ficaram zombam: a viagem para cima estragou a vista. Se ele tenta desatar as correntes, ameaçam matá-lo. A cidade das sombras defende o hábito como se fosse a verdade.

Três teses para o estudo:

1. Percepção não é conhecimento. O que se vê com mais frequência pode ser só o mais projetado.
2. Educar dói. A passagem da opinião (doxa) ao conhecimento (episteme) exige um giro, não um acúmulo de fatos.
3. Quem viu o sol tem uma dívida e um risco: voltar à caverna é um dever político, e também um perigo.

Perguntas que o texto deixa abertas: as sombras de hoje são quais — notícias, métricas, slogans? O educador deve arrastar o outro à força, ou basta apontar a saída? E se o libertado, ao voltar, passa a falar uma língua que a caverna não reconhece?`,
  },
  {
    id: "juros",
    title: "Juros compostos",
    author: "Caderno de fundamentos",
    blurb: "Por que o tempo multiplica — e quando destrói.",
    pages: 3,
    text: `JUROS COMPOSTOS — texto de estudo

Juro simples incide só sobre o capital inicial. Juro composto incide sobre o capital e sobre os juros que já foram incorporados. A fórmula canônica do montante M depois de n períodos, com taxa i por período, é:

M = C × (1 + i)^n

C é o capital. i deve estar na mesma unidade de n: 1% ao mês com n em meses; 12% ao ano com n em anos. Trocar a unidade sem converter a taxa é o erro mais comum.

Um exemplo numérico. R$ 1.000 a 1% ao mês, por 12 meses:
M = 1000 × (1,01)^12 ≈ 1.126,83
O juro simples equivalente teria sido 12% × 1000 = 120, total 1.120. A diferença de R$ 6,83 parece pequena. Em 20 anos, 1% ao mês vira:
M = 1000 × (1,01)^240 ≈ 10.892
Quase onze vezes o capital. O mesmo 1% “inofensivo”, com horizonte longo, deixa de ser arredondamento e vira o fenômeno.

Três ideias que o texto pede para dominar:

1. A taxa e o tempo são o mesmo motor. Duplicar a taxa não duplica o resultado final — eleva a base. Duplicar o tempo também não duplica: o expoente cresce, e o crescimento é acelerado.
2. A regra prática do 72: anos para dobrar ≈ 72 / (taxa percentual ao ano). A 6% a.a., cerca de 12 anos. É aproximação, não lei, e piora com taxas altas.
3. Compostos funcionam nos dois sentidos. Dívida de cartão, correção de multa, inflação sobre preço — o mesmo motor que enriquece a reserva destrói o saldo devedor. O sinal da operação (investir versus dever) não muda a matemática; muda quem paga o expoente.

Inflação é juro composto com sinal invertido sobre o poder de compra. Um salário que não reajusta a 6% a.a. perde metade do poder de compra em cerca de 12 anos — de novo a regra do 72.

Para estudar de verdade, não memorize a fórmula. Pegue um caso: “se eu atrasar a dívida em 8 meses a 3,5% a.m., o que acontece com o principal?” Calcule. Depois pergunte o que aconteceria se a taxa caísse pela metade e o prazo dobrasse. Os dois cenários quase nunca dão o mesmo montante — e essa assimetria é o ponto do capítulo.`,
  },
  {
    id: "foto",
    title: "Fotossíntese, o essencial",
    author: "Notas de biologia",
    blurb: "Luz vira açúcar — e oxigênio é o subproduto.",
    pages: 3,
    text: `FOTOSSÍNTESE — o essencial

A frase escolar “plantas fazem comida com sol” esconde uma reação química com dois atos. A equação resumida:

6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂

Dióxido de carbono e água, com energia luminosa, tornam-se glicose e oxigênio. O oxigênio que respiramos não vem do CO₂: vem da água. Experiências com o isótopo ¹⁸O mostraram isso. Quem “quebra” a água nas fases claras é o fotossistema II, no tilacoide do cloroplasto.

Dois atos:

Fase clara (dependente de luz). Ocorre nas membranas dos tilacoides. A luz excita clorofila. Elétrons sobem de nível energético e viajam por uma cadeia de transporte. Essa queda controlada bombeia prótons para o lúmen; o fluxo de prótons de volta através da ATP sintase produz ATP. NADP+ recebe elétrons e vira NADPH. Água é a fonte dos elétrons perdidos — daí o O₂ liberado.

Fase escura (independente de luz direta, o ciclo de Calvin). Ocorre no estroma. Não precisa de escuro: precisa de ATP e NADPH. A enzima Rubisco fixa CO₂ numa molécula de 5 carbonos (RuBP), gerando compostos de 3 carbonos que, após gasto de ATP e NADPH, formam açúcar. Parte do açúcar recompõe RuBP; o ciclo continua.

Três armadilhas clássicas de prova:

1. “Fase escura acontece de noite.” Falso. Acontece quando há ATP e NADPH, em geral com luz. De noite a planta respira, não “fotossintetiza no escuro”.
2. “O oxigênio sai do gás carbônico.” Falso. Sai da água.
3. “Fotossíntese é o contrário da respiração.” Quase: as equações se espelham, mas os organelos, as enzimas e o sentido energético não são um filme rebobinado.

Para aplicar: se uma folha fecha os estômatos num dia muito quente, entra menos CO₂. O ciclo de Calvin desacelera, NADPH e ATP se acumulam, e a fase clara também trava. Luz demais com pouco CO₂ ainda pode danificar o fotossistema. O organismo não é uma fórmula — é um sistema com gargalos.`,
  },
];
