/* A classe de Component base declara operações comuns para 
objetos simples e complexos de uma composição */

abstract class Componente {
  protected pai: Componente;

  /**
   * Opcionalmente, o componente base pode declarar uma interface para configuração e
   * acessando um pai do componente em uma estrutura de árvore.
   * Também pode fornecer alguma implementação padrão para esses métodos.
   */
  public setPai(pai: Componente) {
    this.pai = pai;
  }

  public getPai(): Componente {
    return this.pai;
  }

  /**
   * Em alguns casos, seria benéfico definir operações de gerenciamento de
   * classes filhas direto na classe base.
   * Dessa forma, você não precisará expor nenhuma classe de componente
   * concreta ao código do cliente, mesmo durante a montagem da árvore de
   * objetos. A desvantagem é que esses métodos estarão vazios para os
   * componentes de nível folha.
   */
  public adicionar(componente: Componente): void {}

  public remover(componente: Componente): void {}

  /**
   * Você pode fornecer um método que permite ao código do cliente
   * descobrir se um componente pode gerar filhos.
   */
  public ehComposto(): boolean {
    return false;
  }

  /**
   * O componente base pode implementar algum comportamento padrão ou
   * deixá-lo para classes concretas (declarando o método que contém o
   * comportamento como "abstrato").
   */
  public abstract operacao(): string;
}

/**
 * A classe Folha representa os objetos finais de uma composição.
 * Uma folha não pode ter filhos.
 *
 * Normalmente, são os objetos Folha que fazem o trabalho real,
 * enquanto os objetos Composto apenas delegam a seus subcomponentes.
 */
class Folha extends Componente {
  public operacao(): string {
    return "Folha";
  }
}

/**
 * A classe Composite representa os componentes complexos que podem ter filhos.
 * Normalmente, os objetos Composite delegam o trabalho real a seus filhos e,
 * em seguida, "somam" o resultado.
 */
class Composite extends Componente {
  protected filha: Componente[] = [];

  /**
   * Um objeto composto pode adicionar ou remover outros componentes
   * (simples ou complexos) para ou [a partir] de sua lista de filhos.
   */
  public adicionar(componente: Componente): void {
    this.filha.push(componente);
    componente.setPai(this);
  }

  public remover(componente: Componente): void {
    const indiceComponente = this.filha.indexOf(componente);
    this.filha.splice(indiceComponente, 1);

    componente.setPai(null);
  }

  public ehComposto(): boolean {
    return true;
  }

  /**
   * O Composite executa sua lógica primária de uma maneira particular. Ele
   * percorre recursivamente todos os seus filhos, coletando e somando seus
   * resultados. Como os filhos do composto passam essas chamadas para seus
   * filhos e assim por diante, toda a árvore de objetos é percorrida como
   * resultado.
   */
  public operacao(): string {
    const resultados = [];
    for (const filha of this.filha) {
      resultados.push(filha.operacao());
    }

    return `Ramo(${resultados.join("+")})`;
  }
}

/**
 * O código do cliente funciona com todos os componentes por meio da
 * interface base.
 */
function codigoCliente(componente: Componente) {
  // ...

  console.log(`RESULTADO: ${componente.operacao()}`);

  // ...
}

/**
 * Assim, o código do cliente pode suportar os componentes de folha simples...
 */
const simples = new Folha();
console.log("Cliente: Tenho um componente simples:");
codigoCliente(simples);
console.log("");

/**
 * ...bem como os compostos complexos.
 */
const arvore = new Composite();
const ramo1 = new Composite();
ramo1.adicionar(new Folha());
ramo1.adicionar(new Folha());
const ramo2 = new Composite();
ramo2.adicionar(new Folha());
arvore.adicionar(ramo1);
arvore.adicionar(ramo2);
console.log("Cliente: Agora tenho uma árvore composta:");
codigoCliente(arvore);
console.log("");

/**
 * Graças ao fato de que as operações de gerenciamento de filhos 
 * são declaradas na classe Component base, o código do cliente pode 
 * rabalhar com qualquer componente, simples ou complexo, sem depender 
 * de suas classes concretas.
 */
function codigoCliente2(componente1: Componente, componente2: Componente) {
  // ...

  if (componente1.ehComposto()) {
    componente1.adicionar(componente2);
  }
  console.log(`RESULTADO: ${componente1.operacao()}`);

  // ...
}

console.log(
  "Cliente: Não preciso verificar as classes dos componentes, mesmo ao gerenciar a árvore:"
);
codigoCliente2(arvore, simples);
