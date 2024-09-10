import streamlit as st
        
pages = {
    "Sprint-1": [ 
        st.Page("create-char.py", title="Create", icon=":material/add_circle:"),
        st.Page("edit-char.py", title="Edit", icon=":material/edit:"),
        st.Page("import-char.py", title="Import", icon=":material/upload:")
    ],
}

pg = st.navigation(pages)
pg.run()