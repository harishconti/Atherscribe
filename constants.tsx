
import React from 'react';
import type { Template, ResponseSchema } from './types';
import { Type } from "@google/genai";

export interface IconProps {
  className?: string;
}

const UserIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
);

const MapIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M14.002 6.002a2 2 0 10-4 0 2 2 0 004 0z"/><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" /></svg>
);

const MagicIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1zM7 8a1 1 0 011 1v1h1a1 1 0 110 2H8v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h1V9a1 1 0 011-1zm5 4a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" /></svg>
);

const BuildingIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>
);

const CameraIcon = ({ className = "h-5 w-5" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
);

const ScrollIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm.5 4.5a.5.5 0 01.5-.5h8a.5.5 0 010 1H5a.5.5 0 01-.5-.5zM5 9a.5.5 0 000 1h8a.5.5 0 000-1H5zm0 2.5a.5.5 0 01.5-.5h5a.5.5 0 010 1H5a.5.5 0 01-.5-.5z" clipRule="evenodd" /></svg>
);

const ClawIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M12.167 6.334a.75.75 0 00-1.037.29l-3.334 5.5a.75.75 0 00.95 1.132l3.333-5.5a.75.75 0 00-.083-1.022zM15 5.5a.75.75 0 00-1.037.29l-3.333 5.5a.75.75 0 00.95 1.132l3.333-5.5A.75.75 0 0015 5.5zM8.5 4.75a.75.75 0 00-1.037.29L4.13 10.54a.75.75 0 00.95 1.132L8.413 6.17a.75.75 0 00.087-1.42z" /></svg>
);

const SwordIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l8.25-4.881a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
);


export const ICONS: { [key: string]: (props: IconProps) => JSX.Element } = {
  user: UserIcon,
  map: MapIcon,
  magic: MagicIcon,
  building: BuildingIcon,
  camera: CameraIcon,
  scroll: ScrollIcon,
  claw: ClawIcon,
  sword: SwordIcon,
};

// A flexible base schema for custom templates
export const baseSchema: ResponseSchema & { type: Type.OBJECT } = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        sections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    heading: { type: Type.STRING },
                    content: { type: Type.STRING },
                },
                required: ["heading", "content"]
            }
        }
    },
    required: ["title", "sections"]
};

export const TEMPLATES: Template[] = [
  {
    id: 'character',
    name: 'Character',
    description: 'Create a new character with a detailed backstory, personality, and motivations.',
    iconId: 'user',
    templateType: 'worldbuilding',
    mainPromptLabel: "Character Concept",
    mainPromptPlaceholder: "e.g., A cynical elven ranger who has lost their connection to the forest.",
    promptFields: [
        { id: 'age', label: 'Age', type: 'text', placeholder: "e.g., 127" },
        { id: 'gender', label: 'Gender', type: 'text', placeholder: "e.g., Female" },
        { id: 'race', label: 'Race / Species', type: 'text', placeholder: "e.g., Wood Elf" },
        { id: 'occupation', label: 'Occupation', type: 'text', placeholder: "e.g., Exiled Guardian" },
        { id: 'core_value', label: 'Core Value', type: 'text', placeholder: "e.g., The innocent must be protected." },
        { id: 'social_status', label: 'Social Status', type: 'text', placeholder: "e.g., Outcast, Respected Elder, Noble" },
        { id: 'speech_quirk', label: 'Speech Quirk/Mannerism', type: 'text', placeholder: "e.g., Taps fingers when impatient" },
        { id: 'key_relationship', label: 'Key Relationship', type: 'textarea', placeholder: "e.g., Bitter rival to the captain of the guard." },
    ],
    systemInstruction: "You are an expert fantasy character creator specializing in complex, believable characters. Focus on internal motivations, realistic flaws, and rich backstories. Always consider how this character would interact with others and what drives their decisions.",
    schema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        personality_traits: { type: Type.ARRAY, items: { type: Type.STRING } },
        backstory: { type: Type.STRING },
        motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
        flaws_and_fears: { type: Type.ARRAY, items: { type: Type.STRING } },
        physical_description: { type: Type.STRING }
      },
    },
    proSchemaAdditions: {
        psychological_profile: { type: Type.STRING },
        key_relationships: { type: Type.STRING },
        deepest_secret: { type: Type.STRING },
    },
    temperature: 0.9,
    displayOrder: ["physical_description", "personality_traits", "backstory", "motivations", "flaws_and_fears", "psychological_profile", "key_relationships", "deepest_secret"],
    fewShotExamples: [
      "Elara Moonwhisper, Elf Ranger. Personality: Fiercely independent, struggles with trust due to past betrayal. Motivation: Protect the ancient forests. Flaw: Refuses help even when desperately needed.",
      "Thorgan Ironbeard, Dwarf Blacksmith. Personality: Perfectionist craftsman, quick to anger about shoddy work. Motivation: Create a legendary weapon. Flaw: His pride prevents him from admitting mistakes."
    ]
  },
  {
    id: 'location',
    name: 'Location',
    description: 'Generate a new location, from a bustling city to a hidden grove.',
    iconId: 'map',
    templateType: 'worldbuilding',
    mainPromptLabel: "Location Concept",
    mainPromptPlaceholder: "e.g., A floating city built on the back of a colossal, ancient creature.",
    promptFields: [
        { id: 'biome', label: 'Biome / Environment', type: 'text', placeholder: "e.g., Sky, Above the clouds" },
        { id: 'era', label: 'Tech / Magic Era', type: 'text', placeholder: "e.g., High Magic, Steampunk" },
        { id: 'primary_inhabitants', label: 'Primary Inhabitants', type: 'text', placeholder: "e.g., Sky-faring Gnomes, Exiled Dragon Riders" },
        { id: 'sensory_details', label: 'Sensory Details', type: 'textarea', placeholder: "e.g., Smells of ozone and strange flora; constant low hum from the creature's breathing." },
        { id: 'state_of_repair', label: 'State of Repair', type: 'text', placeholder: "e.g., Crumbling, with makeshift repairs" },
        { id: 'hidden_secret', label: 'Hidden Secret', type: 'textarea', placeholder: "e.g., The creature is not asleep, but actively dying." },
    ],
    systemInstruction: "You are a master worldbuilder creating immersive, living locations. Consider politics, economy, culture, and daily life. Include sensory details and story potential. Think about who lives here and why.",
    schema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        history: { type: Type.STRING },
        key_landmarks: { type: Type.ARRAY, items: { type: Type.STRING } },
        culture_and_society: { type: Type.STRING },
      },
    },
    proSchemaAdditions: {
        political_landscape: { type: Type.STRING },
        economic_drivers: { type: Type.STRING },
        potential_plot_hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    temperature: 0.8,
    displayOrder: ["description", "history", "culture_and_society", "key_landmarks", "political_landscape", "economic_drivers", "potential_plot_hooks"],
  },
  {
    id: 'magic_system',
    name: 'Magic System',
    description: 'Design a unique magic system with its own rules, costs, and limitations.',
    iconId: 'magic',
    templateType: 'worldbuilding',
    mainPromptLabel: "Magic System Concept",
    mainPromptPlaceholder: "e.g., A system where magic is drawn from emotions, but using it drains the user's memories.",
    promptFields: [
        { id: 'magic_source', label: 'Magic Source', type: 'text', placeholder: "e.g., Elemental planes, Divine beings" },
        { id: 'casting_method', label: 'Casting Method', type: 'text', placeholder: "e.g., Incantations and gestures, Ancient runes" },
        { id: 'rarity', label: 'Rarity', type: 'text', placeholder: "e.g., One in a million, Common among nobles" },
        { id: 'visual_style', label: 'Visual Style', type: 'text', placeholder: "e.g., Geometric light patterns, Raw, chaotic energy" },
    ],
    systemInstruction: "You are designing balanced, logical magic systems. Every spell or ability must have clear rules, limitations, costs, and consequences. Consider how magic affects society, politics, and daily life.",
    schema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        overview: { type: Type.STRING },
        rules_and_limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
        costs_and_consequences: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    proSchemaAdditions: {
        societal_impact: { type: Type.STRING },
        learning_and_mastery: { type: Type.STRING },
        forbidden_magic: { type: Type.STRING },
    },
    temperature: 0.7,
    displayOrder: ["overview", "rules_and_limitations", "costs_and_consequences", "societal_impact", "learning_and_mastery", "forbidden_magic"],
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Flesh out a new faction, guild, or secret society for your world.',
    iconId: 'building',
    templateType: 'worldbuilding',
    mainPromptLabel: "Organization Concept",
    mainPromptPlaceholder: "e.g., A secretive order of librarians who preserve forbidden knowledge.",
    promptFields: [
        { id: 'leader', label: 'Leader', type: 'text', placeholder: "e.g., An immortal, thousand-year-old archivist" },
        { id: 'allies_enemies', label: 'Allies & Enemies', type: 'textarea', placeholder: "e.g., Allied with spy networks; enemies of the state church." },
        { id: 'entry_requirements', label: 'Entry Requirements', type: 'textarea', placeholder: "e.g., Must solve an ancient riddle, By invitation only" },
        { id: 'motto_vs_goal', label: 'Public Motto vs. True Goal', type: 'textarea', placeholder: "Motto: 'Knowledge for all.' Goal: 'Control information...'" },
    ],
    systemInstruction: "You are creating a detailed organization. Focus on its goals, hierarchy, methods, and influence on the world. Give it a clear identity and purpose.",
    schema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        purpose_and_goals: { type: Type.STRING },
        hierarchy_and_structure: { type: Type.STRING },
        public_perception: { type: Type.STRING },
      },
    },
    proSchemaAdditions: {
        methods_and_operations: { type: Type.STRING },
        key_figures: { type: Type.ARRAY, items: { type: Type.STRING } },
        assets_and_resources: { type: Type.STRING },
    },
    temperature: 0.75,
    displayOrder: ["purpose_and_goals", "hierarchy_and_structure", "public_perception", "methods_and_operations", "key_figures", "assets_and_resources"],
  },
  {
    id: 'historical_event',
    name: 'Historical Event',
    description: 'Create a pivotal moment that shapes your world\'s history.',
    iconId: 'scroll',
    templateType: 'worldbuilding',
    mainPromptLabel: "Event Concept",
    mainPromptPlaceholder: "e.g., A war between mountain-dwarves and valley-elves over a mythical forge.",
    promptFields: [
        { id: 'era', label: 'Era', type: 'text', placeholder: "e.g., The First Age, Centuries ago" },
        { id: 'key_factions', label: 'Key Factions Involved', type: 'text', placeholder: "e.g., The Ironbeard Clan, The Sunpetal Elves" },
        { id: 'catalyst', label: 'Catalyst', type: 'textarea', placeholder: "e.g., The forge was rediscovered, reigniting an old claim." },
        { id: 'outcome', label: 'Outcome & Aftermath', type: 'textarea', placeholder: "e.g., A pyrrhic victory for the dwarves; the valley was magically scarred." },
    ],
    systemInstruction: "You are a master historian chronicling the significant events of a fantasy world. Focus on the causes, key players, the unfolding of the event, and its lasting consequences on the world and its people.",
    schema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        summary: { type: Type.STRING },
        key_moments: { type: Type.ARRAY, items: { type: Type.STRING } },
        long_term_consequences: { type: Type.STRING },
      },
    },
    proSchemaAdditions: {
        historical_records_and_myths: { type: Type.STRING },
        unresolved_conflicts: { type: Type.STRING },
        key_figures_involved: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    temperature: 0.8,
    displayOrder: ["summary", "key_moments", "long_term_consequences", "historical_records_and_myths", "unresolved_conflicts", "key_figures_involved"],
  },
  {
    id: 'creature',
    name: 'Creature / Monster',
    description: 'Design the unique fauna (or horrors) that inhabit your world.',
    iconId: 'claw',
    templateType: 'worldbuilding',
    mainPromptLabel: "Creature Concept",
    mainPromptPlaceholder: "e.g., A large, six-legged reptilian predator that can camouflage itself as stone.",
    promptFields: [
        { id: 'habitat', label: 'Habitat', type: 'text', placeholder: "e.g., Caverns, Deserts, The Ethereal Plane" },
        { id: 'diet', label: 'Diet', type: 'text', placeholder: "e.g., Carnivore, Feeds on magical energy" },
        { id: 'primary_abilities', label: 'Primary Abilities', type: 'textarea', placeholder: "e.g., Venomous bite, Telepathic lure" },
        { id: 'temperament', label: 'Temperament', type: 'text', placeholder: "e.g., Aggressive hunter, Shy and elusive" },
    ],
    systemInstruction: "You are an expert xenobiologist and cryptozoologist. When designing a creature, focus on its physical description, abilities, behavior, and how it fits into the world's ecosystem and lore.",
    schema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        physical_description: { type: Type.STRING },
        abilities_and_powers: { type: Type.ARRAY, items: { type: Type.STRING } },
        behavior_and_ecology: { type: Type.STRING },
      },
    },
    proSchemaAdditions: {
        origin_story: { type: Type.STRING },
        weaknesses_and_vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
        societal_role_or_impact: { type: Type.STRING },
    },
    temperature: 0.85,
    displayOrder: ["physical_description", "abilities_and_powers", "behavior_and_ecology", "origin_story", "weaknesses_and_vulnerabilities", "societal_role_or_impact"],
  },
  {
    id: 'item',
    name: 'Item / Artifact',
    description: 'Create legendary weapons, magical items, or key plot devices.',
    iconId: 'sword',
    templateType: 'worldbuilding',
    mainPromptLabel: "Item Concept",
    mainPromptPlaceholder: "e.g., A compass that doesn't point north, but to what the holder desires most.",
    promptFields: [
        { id: 'origin', label: 'Origin', type: 'text', placeholder: "e.g., Forged by a forgotten god, A happy accident" },
        { id: 'appearance', label: 'Appearance', type: 'textarea', placeholder: "e.g., Made of shimmering moonstone, Crude and hastily assembled" },
        { id: 'primary_power', label: 'Primary Power', type: 'textarea', placeholder: "e.g., Grants the wielder control over fire" },
        { id: 'drawback', label: 'Curse or Drawback', type: 'textarea', placeholder: "e.g., Drains the user's life force, Slowly drives the holder mad" },
    ],
    systemInstruction: "You are a legendary artificer and historian. When creating an item, describe its appearance, powers, origins, and any curses or drawbacks in vivid detail. Consider its history and the legends surrounding it.",
    schema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description_and_appearance: { type: Type.STRING },
        magical_properties_and_powers: { type: Type.ARRAY, items: { type: Type.STRING } },
        history_and_origin: { type: Type.STRING },
      },
    },
    proSchemaAdditions: {
        curses_or_drawbacks: { type: Type.STRING },
        craftsmanship_details: { type: Type.STRING },
        known_wielders_or_owners: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    temperature: 0.75,
    displayOrder: ["description_and_appearance", "magical_properties_and_powers", "history_and_origin", "curses_or_drawbacks", "craftsmanship_details", "known_wielders_or_owners"],
  },
  {
    id: 'visual',
    name: 'Visual',
    description: 'Generate an image of a character, location, or object from a description.',
    iconId: 'camera',
    templateType: 'visual',
    mainPromptLabel: "Image Description",
    mainPromptPlaceholder: "e.g., A portrait of a wise, old wizard with a long white beard, wearing blue robes and holding a glowing staff.",
    promptFields: [
        { id: 'style', label: 'Art Style', type: 'text', placeholder: "e.g., Oil painting, digital art, anime" },
        { id: 'mood', label: 'Mood / Atmosphere', type: 'text', placeholder: "e.g., Mysterious, cheerful, epic" },
    ],
    systemInstruction: "You are an AI image generator.",
  }
];

export const DEFAULT_CREDITS = 100;

// New Token-Based Credit System
export const TOKENS_PER_CREDIT = 1000; // The number of tokens that equate to one credit. For example, 1000 tokens cost 1 credit.
export const VISUAL_GENERATION_CREDIT_COST = 10; // Visuals have a fixed cost

// Thresholds for UI warnings and errors
export const LOW_CREDIT_WARNING_THRESHOLD = 10;
export const INSUFFICIENT_CREDITS_ERROR_THRESHOLD = 5;