from os import path
from flask import current_app

from .ata_db_connect import Connection

ata_connection = Connection(current_app.config)
