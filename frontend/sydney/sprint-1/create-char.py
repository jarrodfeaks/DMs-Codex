import streamlit as st
import random

# Dummy data
classes = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"]
races = ["Human", "Elf", "Dwarf", "Halfling", "Gnome", "Half-Elf", "Half-Orc", "Tiefling"]
backgrounds = ["Acolyte", "Charlatan", "Criminal", "Entertainer", "Folk Hero", "Guild Artisan", "Hermit", "Noble", "Outlander", "Sage", "Sailor", "Soldier"]

def generate_ability_scores():
    return [random.randint(3, 18) for _ in range(6)]


st.set_page_config(layout="wide", page_title="Character Creator")

st.title("Create New Character")

col1, col2 = st.columns(2)

with col1:
    st.header("Character Options")

    selected_class = st.selectbox("Choose a Class", classes)
    st.write(f"You selected: {selected_class}")

    selected_race = st.selectbox("Choose a Race", races)
    st.write(f"You selected: {selected_race}")

    selected_background = st.selectbox("Choose a Background", backgrounds)
    st.write(f"You selected: {selected_background}")

    if st.button("Quick Build"):
        st.success("Character quickly built! (This is where AI generation would happen)")

with col2:
    st.header("Character Details")

    character_name = st.text_input("Character Name")

    st.subheader("Ability Scores")
    if st.button("Roll Ability Scores"):
        ability_scores = generate_ability_scores()
        st.session_state.ability_scores = ability_scores

    if 'ability_scores' not in st.session_state:
        st.session_state.ability_scores = [10, 10, 10, 10, 10, 10]

    abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"]
    for ability, score in zip(abilities, st.session_state.ability_scores):
        st.slider(ability, min_value=3, max_value=18, value=score, key=ability)

    alignment = st.selectbox("Alignment", ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"])
    
    st.text_area("Character Backstory", height=100)

if st.button("Save Character"):
    st.success("Character saved successfully! (This is where you'd implement saving logic)")

# AI Assistance
st.sidebar.title("AI Assistance")
if st.sidebar.button("Get Class Suggestions"):
    st.sidebar.write("Based on your selections, you might enjoy playing as a " + random.choice(classes) + ".")

if st.sidebar.button("Generate Character Idea"):
    st.sidebar.write("How about a " + random.choice(races) + " " + random.choice(classes) + " with a " + random.choice(backgrounds) + " background?")
