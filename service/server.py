import os
from flask import (
    Blueprint, current_app, send_from_directory 
)

bp = Blueprint('server', __name__)
@bp.route('/', methods=('GET',))
@bp.route('/<path:path>')
def index(path = ''):
    if path != '' and os.path.exists(current_app.static_folder + '/' + path):
        return send_from_directory(current_app.static_folder, path)
    else:
        return send_from_directory(current_app.static_folder, 'index.html')