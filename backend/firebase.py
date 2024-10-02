import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("settings/myjournalapp-d25c7-firebase-adminsdk-ggayn-cf45b4e804.json")
firebase_admin.initialize_app(cred)
