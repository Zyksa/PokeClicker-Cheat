/**
 * Utilities for decoding and encoding PokeClicker saves.
 * PokeClicker saves are JSON objects represented as Base64 strings.
 */

export interface PokeClickerSave {
  player: {
    _timeTraveller: boolean;
    effectList: Record<string, any>;
    _lastSeen: number;
    _region: number;
    _subregion: number;
    _route: number;
    _townName: string;
    highestRegion: number;
    highestSubRegion: number;
    regionStarters: number[];
    _itemList: Record<string, number>;
    _itemMultipliers: Record<string, number>;
    trainerId: string;
    _createdTime: number;
    [key: string]: any;
  };
  save: {
    update: {
      version: string;
    };
    profile: {
      name: string;
      trainer: number;
      pokemon: number;
      pokemonShiny: boolean;
      pokemonShadow: boolean;
      pokemonFemale: boolean;
      background: number;
      textColor: string;
    };
    wallet: {
      currencies: number[]; // [money, questPoints, dungeonTokens, diamonds, battlePoints, farmPoints, contestTokens]
    };
    keyItems: Record<string, boolean>;
    oakItems: Record<string, {
      level: number;
      exp: number;
      isActive: boolean;
      purchased?: boolean;
    }>;
    party: {
      caughtPokemon: Array<{
        id: number;
        0?: number; // attackBonusPercent
        1?: number; // attackBonusAmount
        2?: Record<string, number>; // proteinsUsed
        3?: number; // exp
        4?: boolean; // breeding
        5?: boolean; // shiny
        6?: number; // category
        [key: number]: any;
      }>;
    };
    statistics: Record<string, any>;
    farming?: {
      unlockedBerries: boolean[];
      berryList: number[];
      plotList: any[];
      [key: string]: any;
    };
    underground?: {
      undergroundExp: number;
      tools?: Record<string, { durability: number }>;
      battery?: { charges: number };
      [key: string]: any;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Decodes a PokeClicker base64 save string into a structured JSON object.
 * Uses TextDecoder to robustly handle special UTF-8 characters.
 */
export function decodeSave(base64Str: string): PokeClickerSave {
  try {
    const cleanStr = base64Str.trim().replace(/\s/g, '');
    const binaryString = atob(cleanStr);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8');
    const jsonStr = decoder.decode(bytes);
    const parsed = JSON.parse(jsonStr) as PokeClickerSave;

    if (!parsed.player || !parsed.save) {
      throw new Error("Missing 'player' or 'save' fields at root.");
    }
    
    // Basic structural checks on subfields
    if (!parsed.save.profile || !parsed.save.wallet || !parsed.save.party) {
      throw new Error("Save data is missing core sections like 'profile', 'wallet' or 'party'.");
    }

    return parsed;
  } catch (e: any) {
    throw new Error(`Invalid PokeClicker save file format: ${e.message}`);
  }
}

/**
 * Encodes a PokeClicker JSON save object back into a base64 string.
 * Uses TextEncoder to handle Unicode characters correctly.
 */
export function encodeSave(saveObj: PokeClickerSave): string {
  try {
    const jsonStr = JSON.stringify(saveObj);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(jsonStr);
    let binaryString = '';
    
    // Process in chunks to avoid stack overflow with large files when using String.fromCharCode.apply
    const chunkLength = 65536;
    for (let i = 0; i < bytes.length; i += chunkLength) {
      const chunk = bytes.subarray(i, i + chunkLength);
      binaryString += String.fromCharCode.apply(null, chunk as any);
    }
    
    return btoa(binaryString);
  } catch (e: any) {
    throw new Error(`Failed to encode save: ${e.message}`);
  }
}
