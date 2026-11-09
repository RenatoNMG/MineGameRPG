/*
 * SISTEMA DE COMPORTAMENTO DOS ITENS
 *
 * REGRA PARA FUTURAS IAs:
 * - Este arquivo contém APENAS regras de uso/comportamento de itens.
 * - Não coloque aqui HTML, CSS, desenho Canvas ou receitas.
 * - Um novo item deve declarar `behavior` no arquivo em data/items quando
 *   precisar de um comportamento diferente do padrão.
 * - Para um comportamento realmente novo, crie uma entrada aqui ou registre
 *   uma estratégia com registerItemBehavior(). Não espalhe `if(item.id===...)`
 *   por vários sistemas.
 * - O ItemSystem decide validação/consumo; este módulo decide o efeito do uso.
 */

export const ITEM_BEHAVIORS={
  food:{
    use({item,player}){
      const hunger=item.effects?.hunger??0;
      const thirst=item.effects?.thirst??0;
      const heal=item.heal??0;
      if(!hunger&&!thirst&&!heal)return false;
      if(hunger)player.hunger=Math.min(player.maxHunger??100,(player.hunger??0)+hunger);
      if(thirst)player.thirst=Math.min(player.maxThirst??100,(player.thirst??0)+thirst);
      if(heal)player.hp=Math.min(player.max??100,(player.hp??0)+heal);
      return true;
    }
  },
  consumable:{
    use({item,player}){
      const heal=item.heal??0;
      const hunger=item.effects?.hunger??0;
      const thirst=item.effects?.thirst??0;
      if(!heal&&!hunger&&!thirst)return false;
      if(heal)player.hp=Math.min(player.max??100,(player.hp??0)+heal);
      if(hunger)player.hunger=Math.min(player.maxHunger??100,(player.hunger??0)+hunger);
      if(thirst)player.thirst=Math.min(player.maxThirst??100,(player.thirst??0)+thirst);
      return true;
    }
  },
  placeable:{
    use({item,world,player}){
      if(typeof world?.placeItem!=="function")return false;
      return !!world.placeItem(item.id,player.x+(player.lastDir||1)*28,player.y);
    }
  },
  tool:{use(){return false;}},
  material:{use(){return false;}}
};

export function getItemBehavior(item){
  return ITEM_BEHAVIORS[item?.behavior||item?.category]||null;
}

export function useItem(context){
  const behavior=getItemBehavior(context?.item);
  return !!behavior?.use(context);
}

/*
 * Extensão segura para mecânicas futuras:
 * registre um comportamento pelo ID/nome definido no campo `behavior` do item.
 * Não altere diretamente sistemas como Inventory, Renderer ou GameLoop para
 * executar o efeito do item.
 */
export function registerItemBehavior(id,behavior){
  if(!id||typeof behavior?.use!=="function")throw new Error("Comportamento de item inválido");
  ITEM_BEHAVIORS[id]=behavior;
}
