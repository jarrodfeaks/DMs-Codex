import streamlit as st
import json
import io
import pandas as pd

def parse_json(data):
    try:
        return json.loads(data)
    except json.JSONDecodeError:
        return None

def parse_csv(data):
    try:
        df = pd.read_csv(io.StringIO(data))
        return df.to_dict(orient='records')[0]
    except Exception as e:
        st.error(f"Error parsing CSV: {str(e)}")
        return None

def parse_txt(data):
    lines = data.split('\n')
    character = {}
    for line in lines:
        if ':' in line:
            key, value = line.split(':', 1)
            character[key.strip()] = value.strip()
    return character

def display_character_info(character):
    st.subheader("Imported Character Information")
    for key, value in character.items():
        st.write(f"{key}: {value}")

def main():
    st.set_page_config(layout="wide", page_title="Import Character")

    st.title("Import Character from File")

    uploaded_file = st.file_uploader("Choose a character file", type=["txt", "json", "csv"])
    
    if uploaded_file is not None:
        file_contents = uploaded_file.getvalue().decode("utf-8")
        
        if uploaded_file.type == "application/json":
            parsed_character = parse_json(file_contents)
            if parsed_character:
                st.success("JSON file parsed successfully!")
                display_character_info(parsed_character)
            else:
                st.error("Unable to parse JSON file. Please check the format and try again.")
        
        elif uploaded_file.type == "text/csv":
            parsed_character = parse_csv(file_contents)
            if parsed_character:
                st.success("CSV file parsed successfully!")
                display_character_info(parsed_character)
            else:
                st.error("Unable to parse CSV file. Please check the format and try again.")
        
        else: 
            parsed_character = parse_txt(file_contents)
            if parsed_character:
                st.success("Text file parsed successfully!")
                display_character_info(parsed_character)
            else:
                st.error("Unable to parse text file. Please check the format and try again.")
        
        # Show raw file contents (for debugging or verification)
        with st.expander("Show raw file contents"):
            st.text(file_contents)

    # AI Assistance sidebar
    st.sidebar.title("AI Assistance")
    if st.sidebar.button("Suggest File Formats"):
        st.sidebar.write("""
        Recommended file formats:
        - JSON: Structured data with keys for character attributes
        - CSV: First row as headers, second row as values
        - TXT: 'Key: Value' pairs, one per line
        """)
    
    if st.sidebar.button("Import Troubleshooting"):
        st.sidebar.write("""
        If you're having trouble importing:
        1. Check the file format and structure
        2. Ensure all required fields are present
        3. Remove any extra formatting or special characters
        4. For text files, use clear 'Key: Value' pairs
        """)

if __name__ == "__main__":
    main()