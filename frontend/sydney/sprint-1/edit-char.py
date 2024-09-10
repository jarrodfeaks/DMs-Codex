import streamlit as st
import random

# Sample data
classes = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"]
races = ["Human", "Elf", "Dwarf", "Halfling", "Gnome", "Half-Elf", "Half-Orc", "Tiefling"]
backgrounds = ["Acolyte", "Charlatan", "Criminal", "Entertainer", "Folk Hero", "Guild Artisan", "Hermit", "Noble", "Outlander", "Sage", "Sailor", "Soldier"]
alignments = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"]

# Dummy data
def load_character(character_id):
    # Dummy function -> Fetch this data from actual database.
    return {
        "name": "Thoradin",
        "class": "Fighter",
        "race": "Dwarf",
        "background": "Soldier",
        "level": 5,
        "ability_scores": {"Strength": 16, "Dexterity": 12, "Constitution": 14, 
                           "Intelligence": 10, "Wisdom": 13, "Charisma": 8},
        "alignment": "Lawful Good",
        "backstory": "Thoradin comes from a long line of dwarven warriors...",
        "equipment": "Warhammer, Shield, Chain mail, Adventurer's pack",
        "skills": ["Athletics", "Intimidation", "Perception"],
        "spells": []
    }

st.set_page_config(layout="wide", page_title="Edit Character")

st.title("Edit Character: Thoradin")

character = load_character(1) # Ideally pass a characterID

tabs = st.tabs(["Basic Info", "Abilities & Skills", "Equipment & Spells", "Background & Notes"])

with tabs[0]:
    st.header("Basic Information")
    col1, col2 = st.columns(2)
    
    with col1:
        character['name'] = st.text_input("Character Name", value=character['name'])
        character['class'] = st.selectbox("Class", classes, index=classes.index(character['class']))
        character['race'] = st.selectbox("Race", races, index=races.index(character['race']))
        character['level'] = st.number_input("Level", min_value=1, max_value=20, value=character['level'])

    with col2:
        character['background'] = st.selectbox("Background", backgrounds, index=backgrounds.index(character['background']))
        character['alignment'] = st.selectbox("Alignment", alignments, index=alignments.index(character['alignment']))

with tabs[1]:
    st.header("Abilities & Skills")
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Ability Scores")
        for ability, score in character['ability_scores'].items():
            character['ability_scores'][ability] = st.slider(ability, min_value=3, max_value=20, value=score)

    with col2:
        st.subheader("Skills")
        all_skills = ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", 
                        "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", 
                        "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"]
        character['skills'] = st.multiselect("Selected Skills", all_skills, default=character['skills'])

with tabs[2]:
    st.header("Equipment & Spells")
    character['equipment'] = st.text_area("Equipment", value=character['equipment'], height=100)
    
    if character['class'] in ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"]:
        st.subheader("Spells")
        character['spells'] = st.text_area("Known Spells", value=", ".join(character['spells']), height=100)

with tabs[3]:
    st.header("Background & Notes")
    character['backstory'] = st.text_area("Character Backstory", value=character['backstory'], height=200)

if st.button("Save Changes"):
    st.success("Changes saved successfully! (This is where you'd implement saving logic)")

# AI Assistance sidebar
st.sidebar.title("AI Assistance")
if st.sidebar.button("Suggest Character Development"):
    st.sidebar.write(f"Consider having {character['name']} face a personal challenge related to their {character['background']} background.")

if st.sidebar.button("Generate Equipment Idea"):
    st.sidebar.write(f"A unique item for {character['name']}: {random.choice(['Enchanted compass', 'Rune-carved shield', 'Feather token'])}.")