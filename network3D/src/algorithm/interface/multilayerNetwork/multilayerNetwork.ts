import {
    type ActorId,
    type LayerId,
    type MultilayerIterateCallback,
    type PartitionId,

    type PartitionId_args,

    MultilayerNetwork as MultilayerNetworkBase
} from "@/core/";

export class MultilayerNetwork extends MultilayerNetworkBase
{
    // IMPLEMENTOVAT STATICKY - NEROZŠIŘOVAT INSTAČNÍ FUNKCIONALITU, ALE TŘÍDNÍ, TO SAMÉ I U VIZUALIZACE (NENÍ TAK TŘEBA ROZŠIŘOVAT 
    // TUTO TŘÍDU, TZN. TENTO PŘÍSTUP UMOŽNUJE VĚTVIT V RÁMCI HIERARCHIE DĚDIČNOSTI - NEVZNIKNE ZÁVISLOST VIZUALIZACE NA ALGORITHM)

    // MOŽNÁ VŠEM TŘÍDÁM IMPLEMENTOVAT INTERFACE "iterate" - PROBLÉM - KAŽDÁ TŘÍDA MÁ JINÉ ROZHRANÍ METODY "iterate"
    // MÍT "private" METODY PRO POČÍTÁNÍ - KAŽDÁ METRIKA MÁ ROZHRANÍ PRO KONKRÉTNÍ MATICI (bipartitní/unipartitní/vážené/nevážené/orientované/neorientované)
    // ČI MNOŽINU MATIC (např.: "flattening")
    // DALŠÍ "private" METODY SLOUŽÍ JAKO "validate" A PŘÍPADNĚ "getAdjacency"
    // "public" METODY SLOUŽÍ PAK JEN JAKO ROZHRANÍ
    // JEN JEDNA TŘÍDA "Algorithm"?, ČI POMOCNÉ TŘÍDY, KDY KAŽDA SLOUŽÍ PRO KONKRÉTNÍ ÚČEL (unipartite/bipartite/multilayer ČI JINAK ROZDĚLENY)?

    public static N({ network, partitionId }: { network: MultilayerNetwork, partitionId: PartitionId }): number
    {
        return network.getActorsCount({ partitionId });
    }

    public static M({ network, layerId }: { network: MultilayerNetwork, layerId: LayerId }): number
    {
        return network.getLinksCount({ layerId });
    }

    public static L({ network }: { network: MultilayerNetwork }): number
    {
        return network.getLayersCount();
    }

    /*public static degree(): Map<ActorId, number>
    {

    }

    public static degreeAvg(): number
    {
        
    }

    public static closeness(): Map<ActorId, number>
    {

    }

    public static closenessAvg(): number
    {
        
    }

    public static betweenness(): Map<ActorId, number>
    {

    }

    public static betweennessAvg(): number
    {
        
    }

    public static clusteringCoefficient(): Map<ActorId, number>
    {

    }

    public static clusteringCoefficientAvg(): number
    {
        
    }

    public static degreeDistribution(): Map<number, number>
    {

    }*/
};