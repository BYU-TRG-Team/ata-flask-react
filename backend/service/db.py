from os import path
from flask import current_app

from .ata_db_connect import Connection

try:
    ata_connection = Connection(current_app.config)
except:
    ata_connection = None
