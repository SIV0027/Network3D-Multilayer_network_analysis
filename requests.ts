/* 

- knihovna nezávislá na grafických výstupech (Babylon, chart.js) => vrstva nad ní (jádro a "interface")
- u globálních i lokálních variant funkcí (vlastností, operací) dodržovat jednotnou syntaktickou konvencni (např.: všechny
  názvy metod globálních vlastností budou končit sufixem _global)
- BIA možno použít na optimalizaci modularity (detekci komunit)
- detekce komuit (vrstva nad) */

/* OneLayer network */



/* Bipartite network */
const bipartiteNetwork: BipartiteNetwork<FIRST_NODE_TYPE = Actor, /* názvy generických typů přepsat */
                                         FIRST_NODE_ID_TYPE = String,
                                         SECOND_NODE_TYPE = Film,
                                         SECOND_NODE_ID_TYPE = String> = NetworkFactory.createBipartite({ filepath: null /* default */ });

bipartiteNetwork.addPartite({ name: "actors" }); /* unikátnost názvů */
bipartiteNetwork.addPartite({ name: "films" }); /*  */

bipartiteNetwork.addNode({ partiteName: "actors",
                           id: "Ben Affleck",
                           node: new Actor("Ben", "Affleck") }); /* opět zajistit unikátnost id (třídy uzlu - Actor by měly 
                                                                    mít metodu getId() ??) */

const projection: Network<NODE_TYPE = Actor,
                          NODE_ID_TYPE = String> = bipartiteNetwork.projection({ partite: "actors", /* zkontrolovat, zda partita exisutje */
                                                                                 algorithm: Algorithms... /* default */ });

/* Multiplex network */



/* str. 18 - definice obecné vícevrstvé sítě M = (A, L, V, E); A - množina aktérů, L - množina vrstev, (V, E) - graf, kde V je relací A x L */
/* SNA - tři scénáře (pilíře): heterogenita vztahů, heterogenita aktérů a korelace vrstev */


for(const actor of projection.getNodes())
{
    multiplexNetwork.addNode({ id: actor.getId(), /* multiplexové sítě mají na každé vrstvě podmnožinu množiny uzlů => specifikace */
                               value: actor });   /* vrstvy je zbytečná (uzly na vrstvě specifikují vazby mezi nimi v dané vrstvě) */
}

for(const link of projection.getLinks())
{
    multiplexNetwork.addLink({ layer: "colabs",
                               sourceNode: link.getSourceNode(),
                               targetNode: link.getTargetNode() });
}

const randomNetwork: RandomNetwork<NODE_TYPE = Actor,
                                   NODE_ID_TYPE = typeof projection.getNodes()[0].getId(),
                                   LINK_TYPE = Link /* default */> = NetworkModels.createRandom({ nodes: projection.getNodes() });
for(const link of randomNetwork.getLinks()) /* zamyslet se nad modely sítí a nad možností kombinovat sítě mezi sebou - např.: 
                                               jednovrsvtou jedním příkazem zakomponovat do vícevsrtvé (multiplexové, 
                                               sítě sítí, ...) */
{
    multiplexNetwork.addLink({ layer: "private",
                               sourceNode: link.getSourceNode(),
                               targetNode: link.getTargetNode() });
}

const communityStructure: CommunityStructure = multiplexNetwork.detectCommunity({ algorithm: Algorithms.Louvain /* default */ });
const communitiesObject: { [key: number]: Array<String> } = communityStructure.getByCommunities(); /* objekt, kde každý prvek =
                                                                                                      komunita s polem id uzlů, které 
                                                                                                      do ní náleží (může být jeden uzel 
                                                                                                      ve více komunitách) */
const communitiesNodesObject: { [key: String]: Array<number> } = communityStructure.getByNodes(); /* objekt, kde zaždý prvek =
                                                                                                     id uzlu s polem komunit, do kterých
                                                                                                     uzel náleží (může být více komunit 
                                                                                                     pro jeden prvek) - vhodné pro algoritmy
                                                                                                     pro překrývající se komunity */

/* každý ze všech tří cyklů výše udělat jedním příkazem - pomocí jedné sítě vytvořit další (samostatně vložit uzly či vazby) */
/* namespace Algorithms rozdělit do tříd, kde každá bude určena pro danou podskupinu algoritmů (prohledávání grafu, detekce komunit, ...) */


/* Obecné poznámky */
/* - lokal. = lokální vlastnost (počítá se vůči uzlu - případně vrstvy), global. = globální vlastnost (počítá se vůči celé síti)
   - pro všechny lokální vlastnosti možná udělat možnost distribuce těchto vlastností (global.)
   - při výpočtu měr si výsledky zapamatovat a následně je jen vracet, až při změně jejich proměnné (to, na základě čeho se míra počítá,
     přepočítat) -> observer -> možná vytvořit třídu pro uchavávání výsledků měr
   - při implementaci i návrhu znovu přečíst text k dané míře (vlastnosti)
   - v textu jsou i další postupy, které nejsou v praxi ještě prozkoumány - možnost přidat jako "něco navíc"
   - vše implementovat s ohledem na modifikaci (v parametrech jednotlivých měr ideálně možnost specifikovat algoritmus => dobře promyslet
     rozhraní daného algoritmu - parametry, které mu metoda předá)
   - zkusit použít datovou strukturu "Set"
   - zaměřit se na neorientované a nevážené sítě (tyto vlastnosti doimplementovat následně => při návrhu brát toto rozšíření v potaz)
   - zamyslet se nad defaultními datovými typy hodnot uzlů a vazeb (null by z hlediska metod getNode(...) a getLink(...) nemusel být vhodný)
   - Params třídu udělat tak, ať je schopna vyvolat výjimku při poslání undefined, pokud nemají všechny atributy default hodnotu
   - Params podtřídy (pro jednotlivé metody udělat jako vnitřní třídy)
   - MÍRY CENTRALITY STUPNĚ A SOUSEDSTVÍ:
      - výpočet stupně (lokal.) - str. 44 - možnost ignorace mezivrstvých vazeb
      - výpočet stupňové odchylky - str. 45 - multiplexové sítě - výpočet pro jednotlivé uzly (lokal.) a následná distribuce (global.)
      - výpočet sousedů a sousedské centrality (lokal.) - str. 47 - možnost ignorace mezivrstvých vazeb
      - výpočet konektivní redundance (lokal.) - str. 48
      - exkluzivní sousedství (lokal.) - str. 48
      - occupation centrality (lokal.) - (jak to přeložit??) - str. 49 - random-walk based degree centrality
   - MĚŘÍTKA VZDÁLENOSTÍ (A CEST):
      - (vícevrstvá) vzdálenost (lokal. - mezi dvěma uzly) - str. 51 -> shorter-than relation - str. 52
      - random walk closeness centrality (lokal.) - str. 54
      - random walk betweenness centrality (lokal.) - str. 54
   - MEŘÍTKA RELEVANCE:
      - relevance (lokal.) - str. 57.
      - exklusivní relevance (lokal.) - str. 59 
   - SHLUKOVACÍ MÍRY:
      - shlukovací koeficient (lokal. a global.) - str. 61
      - tranzitivita (lokal. a global.) - str. 61
   - MÍRY PODOBNOSTI VRSTVEV:
      - korelace vrstev (lokal. - vrstvy) - str. 62
      - asortativita a disortativita (lokal. - vrstvy) - str. 63 */


/* Návrh na Params třídu - promyslet a dodělat
   - dodělat metody pro validaci případu, kdy je přípustná hodnota nebo typ jednoho parametru závislý na hodnotě jiného parametru,
     např. id == null => nepočítá se lokální, ale globální vlastnost => nutné použít jiný typ algoritmu (s jiným rozhraním) */
class Params
{
   constructor(given: { } | undefined)
   {
      for()
   }

   public getArgs()
   {

   }
};

class MyParams<Type> extends Params
{
   protected sourceNodeId: Type | Number = 1;
   protected targetNodeId: Type | Number = 2;
};

/* -------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------- */
/* MULTILAYER NETWORKS */

/* Obecné rysy vícevrstvých sítí */
/* - aktéři jsou uspořádáni do různých vrstev
   - uzly v různých vrstvách mohou odpovídat stejnému aktérovi
   - ...addNode({ ... }) => třída Node skrytá uživateli, bude obalovat uživatelský typ (pokud nějaký je) */

/* Onelayer networks */
/* - vážené a nevážené
   - orientované a neorientované
   - multigrafy (možnost existence více hran mezi dvěma uzly) - většina sítí takových není => samostatný 
      speciální typ sítě (možnost jej změnit na jednoduchou síť s váženými hranami, pokud nejsou samostatné hrany vážené =>
      volba uživatele)
   - smyčky (self-loop)
   - Simple networks - neorientované a nevážené (a jednoduché - nejsou to multigrafy)
   - funkce - počet uzlů (M), počet vrcholů (N), stupeň (k) - specifika pro bipartitní síť (N-partitní - ??), sekvence stupňů -
     uspořádaná sekvence stupňů ({ k_1, ..., k_N }, implementačně možná pro velké sítě jen část sekvence => top N (N zvoleno
     uživatelem)), průměrný stupeň (<k>), distribuce stupňů (P(k)), shlukovací koeficient (a tranzitivita sítě), délka nejkratší
     cesty (i průměrné - globální vlastnost), průměr sítě
   - adjecency "list" (mapa) -> hierarchicky: mapa uzlů (třída sítě) -> mapa hran konkrétního uzlu (třída uzlu)
   - matice vzdáleností - implementovat ??
   - komponenty sítě - orientované a neorientované (dostudovat teorii a promyslet implementaci zacházení s nimi - detekce a 
     manipulace)
   - modely sítí - k analýze (porovnání mezi analyzovanou sítí a modelem - kterému modelu nejlépe odpovída a jak moc) a 
     ke generování sítí (implementovat jako vrstvu nad jádrem)
   --------------------------------------------------------------------------------------------------------------------------------
   - korelace v síti, Pearsonův koeficient asortativity
   - strength and inverse participation ratio */

type Network<NODE_ID_TYPE,
             NODE_VALUE_TYPE,
             LINK_VALUE_TYPE> = OneLayerNetwork<NODE_ID_TYPE,
                                                NODE_VALUE_TYPE,
                                                LINK_VALUE_TYPE>; /* tento alias jako nativní součást knihovny */
const simpleNetwork: Network<NODE_ID_TYPE = Number /* default */,
                             NODE_VALUE_TYPE = null /* default */,
                             LINK_VALUE_TYPE = null /* default */> = NetworkFactory.createOneLayer({ weighted: false /* default */,
                                                                                                     oriented: false /* default */,
                                                                                                     multi: false /* default */,
                                                                                                     filepath: null /* default */ }); /* vytvoření sítě */
/* methods - adders */
simpleNetwork.addNode({ nodeId: 1,
                        value: null /* default */ }); /* přidá uzel s daným id do sítě */
simpleNetwork.addLink({ sourceNodeId: 1,
                        targetNodeId: 2,
                        value: null /* default */ }); /* přidá vazbu mezi danou dvojicí uzlů (daných id) vazbu - pohlídat si, jestli uzly
                                                         s daným id existují - pokud "value" == null */

/* methods - getters */
console.log(simpleNetwork.getNode({ nodeId: 1 })) /* vrátí uzel (jeho hodnotu) s daným id => validace, zda daný uzel existuje -> skrz tuto 
                                                     metodu přistupovat k uzlům sítě i v rámci metod */
console.log(simpleNetwork.getLink({ sourceNodeId: 1,
                                    targetNodeId: 2 })); /* vrátí vazbu (její hodnotu) mezi danými uzly (s daným id) => validace, zda 
                                                            existuje spojení mezi danými uzly a validace existence uzlů s danými id) */

/* - MÍRY CENTRALITY STUPNĚ A SOUSEDSTVÍ:
      - ??výpočet stupňové odchylky - str. 45 - multiplexové sítě - výpočet pro jednotlivé uzly (lokal.) a následná distribuce (global.)
      - ??výpočet sousedů a sousedské centrality (lokal.) - str. 47 - možnost ignorace mezivrstvých vazeb
      - ??výpočet konektivní redundance (lokal.) - str. 48
      - ??exkluzivní sousedství (lokal.) - str. 48
      - ??occupation centrality (lokal.) - (jak to přeložit??) - str. 49 - random-walk based degree centrality
   - MĚŘÍTKA VZDÁLENOSTÍ (A CEST):
      - ??(vícevrstvá) vzdálenost (lokal. - mezi dvěma uzly) - str. 51 -> shorter-than relation - str. 52
      - ??random walk closeness centrality (lokal.) - str. 54
      - ??random walk betweenness centrality (lokal.) - str. 54
   - MEŘÍTKA RELEVANCE:
      - ??relevance (lokal.) - str. 57.
      - ??exklusivní relevance (lokal.) - str. 59 
   - SHLUKOVACÍ MÍRY:
      - ??tranzitivita (lokal. a global.) - str. 61
   - MÍRY PODOBNOSTI VRSTVEV:
      - ??korelace vrstev (lokal. - vrstvy) - str. 62
      - ??asortativita a disortativita (global. - vrstvy) - str. 63 */

                                                                             
/* methods - výpočet měr - "konstanty" */
console.log(simpleNetwork.getNodesCount()); /* počet uzlů (vrcholů) */
console.log(simpleNetwork.getLinksCount()); /* počet vazeb (hran) */
/* methods - výpočet měr - "dynamické" */
console.log(simpleNetwork.calculateDensity()); /* hustota sítě */
console.log(simpleNetwork.calculateClusteringCoefficient({ nodeId: null /* default */,
                                                      algorithm: Algorithms... })); /* shlukovací koeficient (nodeId: null - globální, jinak lokální */
console.log(simpleNetwork.calculateDegreeCentrality({ nodeId: null, /* default */
                                                 algorithm: ... /* default */  })); /* degree centrality (nodeId: null - průměrná, jinak lokální) */
console.log(simpleNetwork.calculateDegreeDistribution({ algorithm: ... /* default */ })); /* distribuce stupňů */
console.log(simpleNetwork.calculateDistance({ sourceNodeId: null, /* default */
                                         targetNodeId: null, /* default */
                                         algorithm: ... /* default */ })); /* vzádlenost mezi dvěma uzly (dáno id), pokud jsou null - průměrná 
                                                                              vzdálenost */
console.log(simpleNetwork.calculateDiameter({ algorithm: Algorithms... /* default */ })); /* průměr sítě */


/* Multiplex networks */
/* - reprezentace pomocí matic sousednosti (jedna pro každou vrstvu) - neefektivní a nepraktické
   - reprezentace pomocí multigrafu (mutlivazby různých typů mezi uzly) - stojí za zvážení, ale spíše ne
   - typy "vazeb" (soc. kontext) (str. 23) - reciprocita (reciprocity) - aktér "i" spojen s aktérem "j" a "j" je také spojen 
                                             s "i" na stejném typu vazb
                                           - výměna (exchange) - dvě spojení odehrávající se na dvou různých typech vazeb
   - multiplexita - lze vysvětlit vývoj sítě - existence spolupracovnického vztahu lze často využít k předpovědi možného
                                               vzniku spojení přátelského typu */


   /* - MÍRY CENTRALITY STUPNĚ A SOUSEDSTVÍ:
      - výpočet stupně (lokal.) - str. 44 - možnost ignorace mezivrstvých vazeb
      - výpočet stupňové odchylky - str. 45 - multiplexové sítě - výpočet pro jednotlivé uzly (lokal.) a následná distribuce (global.)
      - výpočet sousedů a sousedské centrality (lokal.) - str. 47 - možnost ignorace mezivrstvých vazeb
      - výpočet konektivní redundance (lokal.) - str. 48
      - exkluzivní sousedství (lokal.) - str. 48
      - occupation centrality (lokal.) - (jak to přeložit??) - str. 49 - random-walk based degree centrality
   - MĚŘÍTKA VZDÁLENOSTÍ (A CEST):
      - (vícevrstvá) vzdálenost (lokal. - mezi dvěma uzly) - str. 51 -> shorter-than relation - str. 52
      - random walk closeness centrality (lokal.) - str. 54
      - random walk betweenness centrality (lokal.) - str. 54
   - MEŘÍTKA RELEVANCE:
      - relevance (lokal.) - str. 57.
      - exklusivní relevance (lokal.) - str. 59 
   - SHLUKOVACÍ MÍRY:
      - tranzitivita (lokal. a global.) - str. 59
   - MÍRY PODOBNOSTI VRSTVEV:
      - korelace vrstev (lokal. - vrstvy) - str. 62
      - asortativita a disortativita (lokal. - vrstvy) - str. 63 */

const multiplex: MultiplexNetwork<NODE_ID_TYPE = Number /* default */,
                                  NODE_VALUE_TYPE = null /* default */> = NetworkFactory.createMultiplex({ filepath: null /* default */ });


/* methods - adders */
multiplex.addLayer<LINK_VALUE_TYPE = null /* default */>({ name: "colabs" }); /* přidá novou vrstvu */
multiplex.addNode({ nodeId: 1,
                    value: null /* default */ }); /* přidá uzel s daným id do sítě - pokud "value" == null => jako "value" se nastaví 
                                                     dané id */
multiplex.addLink({ sourceNodeId: 1,
                    targetNodeId: 2,
                    layer: "colabs",
                    value: null /* default */ }); /* přidá vazbu do sítě - zkontrolovat existenci uzlu a datový typ "value" vůči datovému 
                                                     typu "value" dané vrsty (zde "colabs") */

/* methods - getters */
console.log(multiplex.getNode({ nodeId: 1 })) /* vrátí uzel (jeho hodnotu) s daným id => validace, zda daný uzel existuje -> skrz tuto 
                                                 metodu přistupovat k uzlům sítě i v rámci metod */
console.log(multiplex.getLink({ sourceNodeId: 1,
                                targetNodeId: 2,
                                layer: "colabs" })); /* vrátí vazbu (její hodnotu) mezi danými uzly (s daným id) => validace, zda existuje 
                                                        spojení mezi danými uzly a validace existence uzlů s danými id a validace existence dané vrstvy) */
console.log(multiplex.getLayersNames()) /* vrací seznam (pole) názvů všech vrstev */


/* methods - výpočet měr - "konstanty" */
console.log(multiplex.getNodesCount({ layer: null /* default */ })); /* počet uzlů (vrcholů) na dané vrstvě - pokud "layer" == null =>
                                                                        vrátí se počet vrcholů  */
console.log(multiplex.getLinksCount({ layer: null /* default */ })); /* počet vazeb (hran) na dané vrstvě, pokud "layer" == null => počet 
                                                                        vazeb v celé síti */

enum ClusteringCoefficientType
{
   Ci1, 
   Ci2 
};
console.log(multiplex.calculateDensity({ layer: null /* default */ })); /* hustota vrstvy - "layer" == null => vrátí se hustota celé sítě */
console.log(multiplex.calculateClusteringCoefficient({ type: ClusteringCoefficientType,
                                                       nodeId: null /* default */,
                                                       algorithm: Algorithms... })); /* shlukovací koeficient (nodeId: null - globální, jinak lokální */
/* methods - výpočet měr - "dynamické" -------------------------------------------DODĚLAT---------------------- */
console.log(multiplex.calculateDegreeCentrality({ nodeId: null, /* default */
                                                  algorithm: ... /* default */  })); /* degree centrality (nodeId: null - průměrná, jinak lokální) */
console.log(multiplex.calculateDegreeDistribution({ algorithm: ... /* default */ })); /* distribuce stupňů */
console.log(multiplex.calculateDistance({ sourceNodeId: null, /* default */
                                          targetNodeId: null, /* default */
                                          algorithm: ... /* default */ })); /* vzádlenost mezi dvěma uzly (dáno id), pokud jsou null - průměrná 
                                                                          vzdálenost */
console.log(multiplex.calculateDiameter({ algorithm: Algorithms... /* default */ })); /* průměr sítě */




/* Multimode & multilevel networks */
/* - multimode - obecně se jedná o N-partitní sítě (nejčastěji bipartitní síť = two-mode network)
   - mutlilevel - rozšíření multimode sítě o možnost existence vazeb v rámci jednotlivých vrstev (partit)
   - na základě způsobů zacházení (one-mode projekce) a analýzy těchto dvou typů vícevrstvých sítí rozhodnout
     o implementačních detailech
   - možná zobecnit na N-partitní sítě (případně dvě třídy: Bipartitní a N-partitní - možnost dědičnosti) ->
     závisí na výpočetní náročnosti obecného případu (N-partitní sítě) */

/* Heterogeneous Information Networks (HIN) */
/* - popisuje schéma sítě (str. 25)
   - vhodný k dolování vzorů nebo k modelování (generování) vícevrstvých sítí (definice schématu a následným modelováním
     jednotlivých vazeb ve vrstvách či napříč vrstvami jedním z modelů pro sítě jednovrstvé)
   - možnost využít ke tvorbě dotazovacího jazyk, pokud by síť byla brána jako databáze
   - Sítě s více typy uzlů, kde jsou typy někdy reprezentovány jako barvy, se v literatuře nazývají také multitypové sítě -
     různé barvy mohou být spojeny s různými vlastnostmi uzlů, například s nižší nebo vyšší pravděpodobností navázání vazeb
     s jinými uzly */

/* ML model */
/* - jednomu aktérovi odpovídá více uzlů na téže vrstvě (např.: jedna osoba má více účtu na jední OSN - jeden na práci a druhý soukromý)
   - není rozšířený (zejména kvůli obtížnému získávání dat tohoto typu) 
   - implementovat jako poslední (něco navíc) */

/* Networks of Networks */
/* - popisují zejména nesociální sítě - jak na sebe různorodé systémy vzájemně působí - kaskádové efekty (mohou vést k řetězovým reakcím)
   - liší se od ostatních výše popsaných modelů - nikoli strukturou, ale jevy, které byly pomocí nich studovány,
     a souboru metod, které byly nad nimi vyvinuty
   - uzly v různých vrstvách většinou odpovídají různým aktérům (zejména pokud se skupiny příliš nepřekrývají) 
   - použít jako obecný případ, ze kterého ostatní dědí (i když ML sítě se zdají být obecnější) */

/* Temporal Networks */
/* - stejná síť ve více časových okamžicích (jedna vrstva = jeden časový okamžík)
   - specifické přístupy, které berou v úvahu časovou složku */

/* Exponential Random Graph Models (ERGM) */
/* - slouží k hledání definovaných vzorů v síti (jenovrstvých i vícevstrvých) (str. 28)
   - nejčastěji se používá k analýze multiplex a multilevel sítí
   - pro sítě s malým počtem uzlů (řádově 10^3, pro vícevrstvé sítě < 10^3) */

