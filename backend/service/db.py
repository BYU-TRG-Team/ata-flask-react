from os import path
from flask import current_app

from .ata_db_connect import Connection

try:
    ata_connection = Connection(current_app.config_path)
except Exception as e:
    if (current_app.logger):
        current_app.logger.error(e.message)
    else:
        print(e.message)
    ata_connection = None
