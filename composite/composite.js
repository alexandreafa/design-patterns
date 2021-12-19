/* A classe de Component base declara operações comuns para
objetos simples e complexos de uma composição */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Componente = /** @class */ (function () {
    function Componente() {
    }
    /**
     * Opcionalmente, o componente base pode declarar uma interface para configuração e
     * acessando um pai do componente em uma estrutura de árvore.
     * Também pode fornecer alguma implementação padrão para esses métodos.
     */
    Componente.prototype.setPai = function (pai) {
        this.pai = pai;
    };
    Componente.prototype.getPai = function () {
        return this.pai;
    };
    /**
     * Em alguns casos, seria benéfico definir operações de gerenciamento de
     * classes filhas direto na classe base.
     * Dessa forma, você não precisará expor nenhuma classe de componente
     * concreta ao código do cliente, mesmo durante a montagem da árvore de
     * objetos. A desvantagem é que esses métodos estarão vazios para os
     * componentes de nível folha.
     */
    Componente.prototype.adicionar = function (componente) { };
    Componente.prototype.remover = function (componente) { };
    /**
     * Você pode fornecer um método que permite ao código do cliente
     * descobrir se um componente pode gerar filhos.
     */
    Componente.prototype.ehComposto = function () {
        return false;
    };
    return Componente;
}());
/**
 * A classe Folha representa os objetos finais de uma composição. Uma folha
 * não pode ter filhos.
 * Normalmente, são os objetos Folha que fazem o trabalho real,
 * enquanto os objetos Composto apenas delegam a seus subcomponentes.
 */
var Folha = /** @class */ (function (_super) {
    __extends(Folha, _super);
    function Folha() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Folha.prototype.operacao = function () {
        return "Folha";
    };
    return Folha;
}(Componente));
/* A classe Composite representa os componentes complexos que podem ter filhos.
 * Normalmente, os objetos Composite delegam o trabalho real a seus filhos e,
 * em seguida, "somam" o resultado.
 */
var Composite = /** @class */ (function (_super) {
    __extends(Composite, _super);
    function Composite() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.filha = [];
        return _this;
    }
    /** Um objeto composto pode adicionar ou remover outros componentes
     * (simples ou complexos) para ou [a partir] de sua lista de filhos.
     */
    Composite.prototype.adicionar = function (componente) {
        this.filha.push(componente);
        componente.setPai(this);
    };
    Composite.prototype.remover = function (componente) {
        var indiceComponente = this.filha.indexOf(componente);
        this.filha.splice(indiceComponente, 1);
        componente.setPai(null);
    };
    Composite.prototype.ehComposto = function () {
        return true;
    };
    /**
     * O Composite executa sua lógica primária de uma maneira particular. Ele
     * percorre recursivamente todos os seus filhos, coletando e somando seus
     * resultados. Como os filhos do composto passam essas chamadas para seus
     * filhos e assim por diante, toda a árvore de objetos é percorrida como
     * resultado.
     */
    Composite.prototype.operacao = function () {
        var resultados = [];
        for (var _i = 0, _a = this.filha; _i < _a.length; _i++) {
            var filha = _a[_i];
            resultados.push(filha.operacao());
        }
        return "Ramo(".concat(resultados.join("+"), ")");
    };
    return Composite;
}(Componente));
/* O código do cliente funciona com todos os componentes por meio da
interface base. */
function codigoCliente(componente) {
    console.log("RESULTADO: ".concat(componente.operacao()));
}
// Assim, o código do cliente pode suportar os componentes de folha simples...
var simples = new Folha();
console.log("Cliente: Tenho um componente simples:");
codigoCliente(simples);
console.log("");
// ...bem como os compostos complexos.
var arvore = new Composite();
var ramo1 = new Composite();
ramo1.adicionar(new Folha());
ramo1.adicionar(new Folha());
var ramo2 = new Composite();
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
function codigoCliente2(componente1, componente2) {
    if (componente1.ehComposto()) {
        componente1.adicionar(componente2);
    }
    console.log("RESULTADO: ".concat(componente1.operacao()));
}
console.log("Cliente: Não preciso verificar as classes dos componentes, mesmo ao gerenciar a árvore:");
codigoCliente2(arvore, simples);
